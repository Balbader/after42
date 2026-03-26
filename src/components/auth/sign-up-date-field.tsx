import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Field,
	FieldError,
	FieldLabel,
} from '@/components/ui/field';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type DateFieldProps = {
	value: number;
	isTouched: boolean;
	isValid: boolean;
	errors: unknown[];
	onChange: (val: number) => void;
};

export function SignUpDateField({
	value,
	isTouched,
	isValid,
	errors,
	onChange,
}: DateFieldProps) {
	const t = useTranslations('authSignUp');
	const isInvalid = isTouched && !isValid;
	const selectedDate = value ? new Date(value) : undefined;

	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel>{t('dateOfBirth')}</FieldLabel>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						className={cn(
							'w-full justify-start text-left font-normal',
							!value && 'text-muted-foreground',
						)}
						aria-invalid={isInvalid}
					>
						<CalendarIcon className='mr-2 size-4 shrink-0' />
						{value ? format(selectedDate!, 'PPP') : t('pickDate')}
					</Button>
				</PopoverTrigger>
				<PopoverContent align='start' className='w-auto p-0'>
					<Calendar
						mode='single'
						captionLayout='dropdown'
						selected={selectedDate}
						onSelect={(date) => onChange(date ? date.getTime() : 0)}
						disabled={(date) =>
							date > new Date() || date < new Date('1900-01-01')
						}
						startMonth={new Date(1900, 0)}
						endMonth={new Date()}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
			{isInvalid && <FieldError errors={errors} />}
		</Field>
	);
}
