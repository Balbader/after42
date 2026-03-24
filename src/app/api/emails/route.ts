import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import Email from '@/emails/email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
	const { url } = await req.json();
	try {
		const email = await resend.emails.send({
			from: 'onboarding@resend.dev',
			to: 'basil@after42.ai',
			subject: 'Welcome to After42!',
			react: Email({ url }),
		});
		return NextResponse.json(email);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to send email' },
			{ status: 500 },
		);
	}
}
