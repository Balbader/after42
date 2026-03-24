import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';

import { logError } from '@/lib/log-helpers';

const ORG = process.env.GITHUB_ORG_NAME;

let installationOctokit: Octokit | null = null;
let cachedInstallationId: number | null = null;

function requireGithubEnv(): { appId: string; privateKey: string; org: string } {
	const appId = process.env.GITHUB_APP_ID;
	const keyB64 = process.env.GITHUB_APP_PRIVATE_KEY;
	const org = ORG;
	if (!appId) {
		throw new Error('Missing environment variable: GITHUB_APP_ID');
	}
	if (!keyB64) {
		throw new Error('Missing environment variable: GITHUB_APP_PRIVATE_KEY');
	}
	if (!org) {
		throw new Error('Missing environment variable: GITHUB_ORG_NAME');
	}
	let privateKey: string;
	try {
		privateKey = Buffer.from(keyB64, 'base64').toString('utf-8');
	} catch {
		throw new Error('GITHUB_APP_PRIVATE_KEY must be valid base64-encoded PEM');
	}
	return { appId, privateKey, org };
}

async function getInstallationId(
	appOctokit: Octokit,
	org: string,
): Promise<number> {
	if (cachedInstallationId !== null) {
		return cachedInstallationId;
	}
	const { data } = await appOctokit.apps.getOrgInstallation({ org });
	cachedInstallationId = data.id;
	return data.id;
}

/**
 * Authenticated Octokit for the GitHub App installation (singleton).
 * Throws if required env vars are missing or installation cannot be resolved.
 */
export async function getGitHubClient(): Promise<Octokit> {
	if (installationOctokit) {
		return installationOctokit;
	}
	const { appId, privateKey, org } = requireGithubEnv();

	const appOctokit = new Octokit({
		authStrategy: createAppAuth,
		auth: {
			appId,
			privateKey,
		},
	});

	const installationId = await getInstallationId(appOctokit, org);

	installationOctokit = new Octokit({
		authStrategy: createAppAuth,
		auth: {
			appId,
			privateKey,
			installationId,
		},
	});

	return installationOctokit;
}

function isProbablyText(buffer: Buffer): boolean {
	if (buffer.length === 0) return true;
	if (buffer.includes(0)) return false;
	return true;
}

async function sleep(ms: number) {
	await new Promise((r) => setTimeout(r, ms));
}

export async function createChallengeRepo(
	challengeId: string,
	readmeContent: string,
	starterFiles: Record<string, string>,
): Promise<string> {
	const octokit = await getGitHubClient();
	const { org } = requireGithubEnv();
	const repoName = `challenge-${challengeId}`;

	await octokit.repos.createInOrg({
		org,
		name: repoName,
		private: true,
		auto_init: false,
		description: `after42 challenge ${challengeId}`,
	});

	const treeItems: {
		path: string;
		mode: '100644';
		type: 'blob';
		sha: string;
	}[] = [];

	const readmeBlob = await octokit.git.createBlob({
		owner: org,
		repo: repoName,
		content: Buffer.from(readmeContent, 'utf8').toString('base64'),
		encoding: 'base64',
	});
	treeItems.push({
		path: 'README.md',
		mode: '100644',
		type: 'blob',
		sha: readmeBlob.data.sha,
	});

	for (const [path, content] of Object.entries(starterFiles)) {
		const normalized = path.replace(/^\/+/, '');
		if (!normalized || normalized.includes('..')) continue;
		const blob = await octokit.git.createBlob({
			owner: org,
			repo: repoName,
			content: Buffer.from(content, 'utf8').toString('base64'),
			encoding: 'base64',
		});
		treeItems.push({
			path: normalized,
			mode: '100644',
			type: 'blob',
			sha: blob.data.sha,
		});
	}

	const { data: tree } = await octokit.git.createTree({
		owner: org,
		repo: repoName,
		tree: treeItems,
	});

	const { data: commit } = await octokit.git.createCommit({
		owner: org,
		repo: repoName,
		message: 'Initial challenge import',
		tree: tree.sha,
		parents: [],
	});

	await octokit.git.createRef({
		owner: org,
		repo: repoName,
		ref: 'refs/heads/main',
		sha: commit.sha,
	});

	return repoName;
}

export async function forkChallengeRepo(
	repoName: string,
	candidateAlias: string,
): Promise<{ forkName: string; cloneUrl: string }> {
	const octokit = await getGitHubClient();
	const { org } = requireGithubEnv();

	const match = /^challenge-(.+)$/.exec(repoName);
	const challengeId = match ? match[1] : repoName;
	const forkName = `challenge-${challengeId}-cand-${candidateAlias}`.replace(
		/[^a-zA-Z0-9._-]/g,
		'-',
	);

	const { data: fork } = await octokit.repos.createFork({
		owner: org,
		repo: repoName,
		organization: org,
		name: forkName,
	});

	let ready = fork;
	for (let i = 0; i < 30; i++) {
		try {
			const { data: repo } = await octokit.repos.get({
				owner: org,
				repo: fork.name,
			});
			if (repo && repo.size !== undefined) {
				ready = repo;
				break;
			}
		} catch {
			/* fork still provisioning */
		}
		await sleep(2000);
	}

	try {
		await octokit.repos.addCollaborator({
			owner: org,
			repo: ready.name,
			username: candidateAlias,
			permission: 'push',
		});
	} catch (err) {
		logError('github.forkChallengeRepo: addCollaborator failed', err);
	}

	const cloneUrl =
		ready.clone_url ??
		`https://github.com/${org}/${ready.name}.git`;

	return { forkName: ready.name, cloneUrl };
}

export async function archiveFork(forkName: string): Promise<void> {
	const octokit = await getGitHubClient();
	const { org } = requireGithubEnv();
	await octokit.repos.update({
		owner: org,
		repo: forkName,
		archived: true,
	});
}

export async function getRepoTree(
	repoName: string,
): Promise<Record<string, string>> {
	const octokit = await getGitHubClient();
	const { org } = requireGithubEnv();

	const { data: repo } = await octokit.repos.get({ owner: org, repo: repoName });
	const defaultBranch = repo.default_branch ?? 'main';

	const { data: ref } = await octokit.git.getRef({
		owner: org,
		repo: repoName,
		ref: `heads/${defaultBranch}`,
	});

	const { data: commitObj } = await octokit.git.getCommit({
		owner: org,
		repo: repoName,
		commit_sha: ref.object.sha,
	});

	const { data: tree } = await octokit.git.getTree({
		owner: org,
		repo: repoName,
		tree_sha: commitObj.tree.sha,
		recursive: 'true',
	});

	const out: Record<string, string> = {};

	for (const entry of tree.tree) {
		if (entry.type !== 'blob' || !entry.path || !entry.sha) continue;
		const { data: blob } = await octokit.git.getBlob({
			owner: org,
			repo: repoName,
			file_sha: entry.sha,
		});
		let buf: Buffer;
		if (blob.encoding === 'base64') {
			buf = Buffer.from(blob.content, 'base64');
		} else {
			buf = Buffer.from(blob.content, 'utf8');
		}
		if (!isProbablyText(buf)) continue;
		out[entry.path] = buf.toString('utf8');
	}

	return out;
}

export async function getCommitCount(repoName: string): Promise<number> {
	const octokit = await getGitHubClient();
	const { org } = requireGithubEnv();

	let page = 1;
	let total = 0;
	for (;;) {
		const { data } = await octokit.repos.listCommits({
			owner: org,
			repo: repoName,
			per_page: 100,
			page,
		});
		total += data.length;
		if (data.length < 100) break;
		page += 1;
	}
	return total;
}

export const github = {
	getGitHubClient,
	createChallengeRepo,
	forkChallengeRepo,
	archiveFork,
	getRepoTree,
	getCommitCount,
};
