'use client';

import { deleteJobPost } from '@/app/actions/job-post';
import { useRouter } from '@/i18n/navigation';
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

type Props = {
	jobPostId: string;
	title: string;
	onDeleted: () => void;
};

export function DeleteJobPostBtn({ jobPostId, title, onDeleted }: Props) {
	const t = useTranslations('jobPost');
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [pending, startTransition] = useTransition();

	const handleDelete = () => {
		startTransition(async () => {
			const result = await deleteJobPost(jobPostId);
			if (!result.success) {
				if (result.error.code === 'HAS_CHALLENGES') {
					toast.error(t('deleteBlockedByChallenges'));
				} else {
					toast.error(t('deleteError'));
				}
				setOpen(false);
				return;
			}
			toast.success(t('deleteSuccess'));
			setOpen(false);
			onDeleted();
			router.refresh();
		});
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<button
					type='button'
					className='inline-flex items-center gap-1.5 rounded-md border border-(--a42-border) bg-transparent px-3 py-2 font-(family-name:--font-dm-sans) text-sm font-medium text-(--a42-text-muted) transition-colors hover:border-red-300/80 hover:bg-red-50/80 hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-(--a42-bg) dark:hover:border-red-800 dark:hover:bg-red-950/40 dark:hover:text-red-200'
				>
					<Trash2 className='size-4 shrink-0' aria-hidden />
					{t('delete')}
				</button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className='font-(family-name:--font-dm-sans)'>
						{t('deleteTitle')}
					</AlertDialogTitle>
					<AlertDialogDescription className='font-(family-name:--font-dm-sans) text-left'>
						{t('deleteDescription', { title })}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className='font-(family-name:--font-dm-sans)'>
						{t('deleteCancel')}
					</AlertDialogCancel>
					<Button
						type='button'
						variant='destructive'
						disabled={pending}
						className='font-(family-name:--font-dm-sans)'
						onClick={handleDelete}
					>
						{pending ? (
							<>
								<Loader2 className='size-4 animate-spin' aria-hidden />
								{t('deletePending')}
							</>
						) : (
							t('deleteConfirm')
						)}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
