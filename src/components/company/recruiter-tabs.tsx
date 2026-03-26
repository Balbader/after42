'use client';

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useRef,
	type KeyboardEvent,
	type ReactNode,
} from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';

import { cn } from '@/lib/utils';

export type RecruiterTabId = 'pipeline' | 'challenges' | 'review';

const TAB_IDS: RecruiterTabId[] = ['pipeline', 'challenges', 'review'];

function parseTab(raw: string | null): RecruiterTabId {
	if (raw === 'challenges' || raw === 'review' || raw === 'pipeline') return raw;
	return 'pipeline';
}

type TabContextValue = {
	tab: RecruiterTabId;
	setTab: (id: RecruiterTabId) => void;
	tabIds: readonly RecruiterTabId[];
};

const RecruiterTabContext = createContext<TabContextValue | null>(null);

export function useRecruiterTab(): TabContextValue {
	const ctx = useContext(RecruiterTabContext);
	if (!ctx) {
		throw new Error('useRecruiterTab must be used within RecruiterTabProvider');
	}
	return ctx;
}

export function RecruiterTabProvider({ children }: { children: ReactNode }) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const tab = parseTab(searchParams.get('tab'));

	const setTab = useCallback(
		(next: RecruiterTabId) => {
			const params = new URLSearchParams(searchParams.toString());
			if (next === 'pipeline') {
				params.delete('tab');
			} else {
				params.set('tab', next);
			}
			const q = params.toString();
			router.replace(q ? `/dashboard?${q}` : '/dashboard');
		},
		[router, searchParams],
	);

	const value = useMemo(
		() => ({ tab, setTab, tabIds: TAB_IDS }),
		[tab, setTab],
	);

	return (
		<RecruiterTabContext.Provider value={value}>{children}</RecruiterTabContext.Provider>
	);
}

type TabDef = { id: RecruiterTabId; label: string };

export function RecruiterTabNav({ tabs }: { tabs: TabDef[] }) {
	const { tab, setTab, tabIds } = useRecruiterTab();
	const listRef = useRef<HTMLDivElement>(null);
	const tabRefs = useRef<Map<RecruiterTabId, HTMLButtonElement>>(new Map());

	const focusTab = useCallback((id: RecruiterTabId) => {
		tabRefs.current.get(id)?.focus();
	}, []);

	const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		const idx = tabIds.indexOf(tab);
		if (idx < 0) return;

		if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
			e.preventDefault();
			const dir = e.key === 'ArrowRight' ? 1 : -1;
			const nextIdx = (idx + dir + tabIds.length) % tabIds.length;
			const nextId = tabIds[nextIdx];
			setTab(nextId);
			focusTab(nextId);
		}
		if (e.key === 'Home') {
			e.preventDefault();
			setTab(tabIds[0]);
			focusTab(tabIds[0]);
		}
		if (e.key === 'End') {
			e.preventDefault();
			const last = tabIds[tabIds.length - 1];
			setTab(last);
			focusTab(last);
		}
	};

	return (
		<div
			ref={listRef}
			role='tablist'
			aria-label='Dashboard sections'
			onKeyDown={onKeyDown}
			className='flex w-full snap-x snap-mandatory gap-1 overflow-x-auto border-b border-[#E7E5E4] pb-0 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-6 md:overflow-visible [&::-webkit-scrollbar]:hidden'
		>
			{tabs.map((t) => {
				const selected = tab === t.id;
				return (
					<button
						key={t.id}
						ref={(el) => {
							if (el) tabRefs.current.set(t.id, el);
							else tabRefs.current.delete(t.id);
						}}
						type='button'
						role='tab'
						id={`recruiter-tab-${t.id}`}
						aria-selected={selected}
						aria-controls={`recruiter-panel-${t.id}`}
						tabIndex={selected ? 0 : -1}
						onClick={() => setTab(t.id)}
						className={cn(
							'snap-start whitespace-nowrap rounded-t-md px-3 py-2.5 font-(family-name:--font-dm-sans) text-sm transition-colors md:px-1 md:py-3',
							selected
								? 'border-b-2 border-[#C2410C] font-semibold text-[#1C1917] md:border-b-2 md:border-[#C2410C]'
								: 'border-b-2 border-transparent font-medium text-[#78716C] hover:text-[#1C1917]',
						)}
					>
						{t.label}
					</button>
				);
			})}
		</div>
	);
}

export function RecruiterTabPanel({
	id,
	children,
	className,
}: {
	id: RecruiterTabId;
	children: ReactNode;
	className?: string;
}) {
	const { tab } = useRecruiterTab();
	if (tab !== id) return null;

	return (
		<div
			role='tabpanel'
			id={`recruiter-panel-${id}`}
			aria-labelledby={`recruiter-tab-${id}`}
			className={className}
		>
			{children}
		</div>
	);
}
