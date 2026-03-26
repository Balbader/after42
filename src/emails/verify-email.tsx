import {
	Body,
	Button,
	Container,
	Head,
	Hr,
	Html,
	Link,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';

interface VerifyEmailProps {
	username: string;
	verifyUrl: string;
	locale?: 'en' | 'fr';
}

const copy = {
	en: {
		title: 'Verify your email address',
		body: (name: string) =>
			`Thanks ${name} for signing up! To complete your registration and secure your account, please verify your email address by clicking the button below.`,
		button: 'Verify Email Address',
		fallback: `If the button doesn't work, you can copy and paste this link into your browser:`,
		footer:
			"This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.",
		regards: 'Best regards,',
		team: 'The Team',
	},
	fr: {
		title: 'Confirmez votre adresse e-mail',
		body: (name: string) =>
			`Merci ${name} pour votre inscription ! Pour finaliser votre compte et le sécuriser, veuillez confirmer votre adresse e-mail en cliquant sur le bouton ci-dessous.`,
		button: 'Confirmer mon e-mail',
		fallback:
			'Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :',
		footer:
			'Ce lien expire dans 24 heures. Si vous n’avez pas créé de compte, ignorez cet e-mail.',
		regards: 'Cordialement,',
		team: 'L’équipe',
	},
} as const;

export default function VerifyEmail(props: VerifyEmailProps) {
	const { username, verifyUrl, locale = 'en' } = props;
	const c = copy[locale];
	const lang = locale === 'fr' ? 'fr' : 'en';

	return (
		<Html dir='ltr' lang={lang}>
			<Tailwind>
				<Head />
				<Body className='bg-gray-100 py-10 font-sans'>
					<Container className='mx-auto max-w-150 rounded-xl bg-white p-8'>
						<Section>
							<Text className='mt-0 mb-4 font-bold text-[24px] text-gray-900'>
								{c.title}
							</Text>

							<Text className='mt-0 mb-6 text-[16px] leading-6 text-gray-700'>
								{c.body(username)}
							</Text>

							<Section className='mb-8 text-center'>
								<Button
									className='box-border rounded-[6px] bg-blue-600 px-8 py-3 font-medium text-[16px] text-white no-underline'
									href={verifyUrl}
								>
									{c.button}
								</Button>
							</Section>

							<Text className='mt-0 mb-6 text-[14px] leading-5 text-gray-600'>
								{c.fallback}
								<br />
								{verifyUrl}
							</Text>

							<Text className='mt-0 mb-8 text-[14px] leading-5 text-gray-600'>
								{c.footer}
							</Text>

							<Hr className='my-6 border-gray-200' />

							<Text className='m-0 text-[12px] leading-4 text-gray-500'>
								{c.regards}
								<br />
								{c.team}
							</Text>
						</Section>

						<Section className='mt-8 border-t border-gray-200 pt-6'>
							<Text className='m-0 text-center text-[12px] leading-4 text-gray-400'>
								after42
							</Text>

							<Text className='m-0 mt-2 text-center text-[12px] leading-4 text-gray-400'>
								<Link className='text-gray-400 underline' href='/'>
									Unsubscribe
								</Link>{' '}
								| © {new Date().getFullYear()} after42
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
