import { Button, Html, Head, Body } from '@react-email/components';
import { Tailwind, pixelBasedPreset } from '@react-email/components';
import * as React from 'react';

export default function Email(props: { url: string }) {
	const { url } = props;

	return (
		<Tailwind
			config={{
				presets: [pixelBasedPreset],
				theme: {
					extend: {
						colors: {
							brand: '#007291',
						},
					},
				},
			}}
		>
			<Html>
				<Head>
					<title>Welcome to Oto</title>
				</Head>
				<Body>
					<h1>Welcome to Oto</h1>
					<p>
						Thank you for signing up. Please click the button below to verify
						your email.
					</p>
					<Button href={url}>Verify Email</Button>
				</Body>
			</Html>
		</Tailwind>
	);
}
