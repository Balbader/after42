import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import * as schemas from './schemas/schema';
import { jobPost } from './schemas/job-post';
import { challenge } from './schemas/challenge';
import { programmer } from './schemas/programmer';
import { recruiter } from './schemas/recruiter';
import { company } from './schemas/company';

config({ path: '.env' });

export const db = drizzle({
	connection: {
		url: process.env.TURSO_CONNECTION_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN!,
	},
	schema: {
		user: schemas.user,
		session: schemas.session,
		account: schemas.account,
		verification: schemas.verification,
		jobPost,
		challenge,
		programmer,
		recruiter,
		company,
	},
	relations: schemas.relations,
});
