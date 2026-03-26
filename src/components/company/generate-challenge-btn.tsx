'use client';

import { createChallenge } from '@/app/actions/challenge';
import { useRouter } from '@/i18n/navigation';
import { Loader2, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

type Props = {
    jobPostId: string;
};

export function GenerateChallengeBtn({ jobPostId }: Props) {
    const router = useRouter();
    const t = useTranslations('dashboard.generate');
    const [isPending, startTransition] = useTransition();
    const [created, setCreated] = useState(false);

    const runCreate = () => {
        startTransition(async () => {
            const result = await createChallenge(jobPostId);
            if ('error' in result) {
                toast.error(result.error, {
                    action: {
                        label: t('retry'),
                        onClick: runCreate,
                    },
                });
                return;
            }
            setCreated(true);
            toast.success(t('generatedTitle'), {
                description: result.title,
                action: {
                    label: t('viewFull'),
                    onClick: () => router.push(`/company/challenges/${result.challengeId}`),
                },
            });
            router.refresh();
        });
    };

    if (created) {
        return (
            <div className='mt-3 flex items-center gap-2'>
                <Check className='size-4 text-(--a42-score-high)' aria-hidden />
                <span className='font-(family-name:--font-dm-sans) text-[13px] font-medium text-(--a42-score-high)'>
                    {t('generatedTitle')}
                </span>
            </div>
        );
    }

    return (
        <div className='mt-3'>
            <button
                type='button'
                onClick={runCreate}
                disabled={isPending}
                className='inline-flex w-fit items-center justify-center rounded-md bg-(--a42-accent) px-4 py-2 font-(family-name:--font-dm-sans) text-sm font-medium text-white transition-colors hover:bg-(--a42-accent-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--a42-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--a42-bg) disabled:cursor-not-allowed disabled:opacity-60'
            >
                {isPending ? (
                    <>
                        <Loader2 className='mr-2 size-4 animate-spin' aria-hidden />
                        {t('generatingShort')}
                    </>
                ) : (
                    t('cta')
                )}
            </button>
        </div>
    );
}
