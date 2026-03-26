import { useTranslations } from 'next-intl';

import { Checkbox } from '@/components/ui/checkbox';
import {
	Field,
	FieldError,
	type FieldErrorsList,
	FieldLabel,
} from '@/components/ui/field';
import { Link } from '@/i18n/navigation';

type TermsFieldProps = {
	name: string;
	value: boolean;
	isTouched: boolean;
	isValid: boolean;
	errors: FieldErrorsList;
	onChange: (val: boolean) => void;
	onBlur: () => void;
};

export function SignUpTermsField({
	name,
	value,
	isTouched,
	isValid,
	errors,
	onChange,
	onBlur,
}: TermsFieldProps) {
	const t = useTranslations('authSignUp');
	const isInvalid = isTouched && !isValid;

	return (
		<Field
			data-invalid={isInvalid}
			orientation='horizontal'
			className='items-start'
		>
			<div className='flex items-start gap-3'>
				<Checkbox
					id={name}
					checked={value === true}
					onCheckedChange={(checked) => onChange(checked === true)}
					onBlur={onBlur}
					aria-invalid={isInvalid}
					aria-describedby={isInvalid ? `${name}-error` : undefined}
				/>
				<div className='text-balance'>
					<FieldLabel
						htmlFor={name}
						className='cursor-pointer font-normal text-sm text-muted-foreground'
					>
						<div>
							{t('termsLead')}{' '}
							<Link
								href='/terms'
								className='underline underline-offset-4 hover:text-primary'
							>
								{t('termsLink')}
							</Link>{' '}
							{t('termsAnd')}{' '}
							<Link
								href='/privacy'
								className='underline underline-offset-4 hover:text-primary'
							>
								{t('privacyLink')}
							</Link>
						</div>
					</FieldLabel>
					{isInvalid && (
						<FieldError id={`${name}-error`} errors={errors} />
					)}
				</div>
			</div>
		</Field>
	);
}
