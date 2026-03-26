import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';

interface ResetPasswordEmailProps {
	username: string;
	resetUrl: string;
	userEmail: string;
	locale?: 'en' | 'fr';
}

const copy = {
	en: {
		preview: 'Reset your password - Action required',
		heading: 'Reset Your Password',
		sub: 'We received a request to reset your password',
		hello: (name: string) => `Hello, ${name}`,
		introBefore:
			'We received a password reset request for your account associated with ',
		introAfter: '.',
		instructions:
			'Click the button below to create a new password. This link will expire in 24 hours for security reasons.',
		button: 'Reset Password',
		fallbackIntro:
			"If the button doesn't work, copy and paste this link into your browser:",
		security: 'Security Notice:',
		sec1: "• If you didn't request this password reset, please ignore this email",
		sec2: '• This link will expire in 24 hours',
		sec3: '• For security, never share this link with anyone',
		help: 'Need help? Contact us at',
		sentTo: 'This email was sent to',
	},
	fr: {
		preview: 'Réinitialisation du mot de passe',
		heading: 'Réinitialiser votre mot de passe',
		sub: 'Nous avons reçu une demande de réinitialisation',
		hello: (name: string) => `Bonjour ${name},`,
		introBefore:
			'Nous avons reçu une demande de réinitialisation pour le compte associé à ',
		introAfter: '.',
		instructions:
			'Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe. Ce lien expire dans 24 heures pour des raisons de sécurité.',
		button: 'Réinitialiser le mot de passe',
		fallbackIntro:
			'Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :',
		security: 'À noter :',
		sec1: '• Si vous n’avez pas demandé cette réinitialisation, ignorez cet e-mail',
		sec2: '• Ce lien expire dans 24 heures',
		sec3: '• Ne partagez jamais ce lien avec qui que ce soit',
		help: 'Besoin d’aide ? Écrivez-nous à',
		sentTo: 'Cet e-mail a été envoyé à',
	},
} as const;

const ResetPasswordEmail = (props: ResetPasswordEmailProps) => {
	const { username, resetUrl, userEmail, locale = 'en' } = props;
	const c = copy[locale];
	const lang = locale === 'fr' ? 'fr' : 'en';

	return (
		<Html dir='ltr' lang={lang}>
			<Tailwind>
				<Head />
				<Preview>{c.preview}</Preview>
				<Body className='bg-gray-100 py-10 font-sans'>
					<Container className='mx-auto max-w-150 rounded-xl bg-white p-10 shadow-sm'>
						<Section className='mb-8 text-center'>
							<Heading className='m-0 mb-2 font-bold text-[28px] text-gray-900'>
								{c.heading}
							</Heading>
							<Text className='m-0 text-[16px] text-gray-600'>{c.sub}</Text>
						</Section>

						<Section className='mb-8'>
							<Text className='m-0 mb-4 text-[16px] leading-6 text-gray-700'>
								{c.hello(username)}
							</Text>
							<Text className='m-0 mb-4 text-[16px] leading-6 text-gray-700'>
								{c.introBefore}
								<strong>{userEmail}</strong>
								{c.introAfter}
							</Text>
							<Text className='m-0 mb-6 text-[16px] leading-6 text-gray-700'>
								{c.instructions}
							</Text>
						</Section>

						<Section className='mb-8 text-center'>
							<Button
								className='box-border inline-block rounded-xl bg-blue-600 px-8 py-4 font-semibold text-[16px] text-white no-underline'
								href={resetUrl}
							>
								{c.button}
							</Button>
						</Section>

						<Section className='mb-8'>
							<Text className='m-0 mb-2 text-[14px] leading-5 text-gray-600'>
								{c.fallbackIntro}
							</Text>
							<Link
								className='break-all text-[14px] text-blue-600'
								href={resetUrl}
							>
								{resetUrl}
							</Link>
						</Section>

						<Section className='mb-8 rounded-xl bg-gray-50 p-5'>
							<Text className='m-0 mb-2 font-semibold text-[14px] leading-5 text-gray-700'>
								{c.security}
							</Text>
							<Text className='m-0 mb-2 text-[14px] leading-5 text-gray-600'>
								{c.sec1}
							</Text>
							<Text className='m-0 mb-2 text-[14px] leading-5 text-gray-600'>
								{c.sec2}
							</Text>
							<Text className='m-0 text-[14px] leading-5 text-gray-600'>
								{c.sec3}
							</Text>
						</Section>

						<Section className='mb-8'>
							<Text className='m-0 text-[14px] leading-5 text-gray-600'>
								{c.help}{' '}
								<Link className='text-blue-600' href='mailto:basil@after42.ai'>
									basil@after42.ai
								</Link>
							</Text>
						</Section>

						<Section className='border-t border-gray-200 pt-6'>
							<Text className='m-0 mb-2 text-[12px] leading-4 text-gray-500'>
								{c.sentTo} {userEmail}
							</Text>
							<Text className='m-0 text-[12px] leading-4 text-gray-500'>
								© {new Date().getFullYear()} after42
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default ResetPasswordEmail;
