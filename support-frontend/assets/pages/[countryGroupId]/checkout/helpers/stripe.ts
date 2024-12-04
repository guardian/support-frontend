export const stripeCreateSetupIntentPrb = async (
	stripePublicKey: string,
): Promise<{ client_secret: string }> => {
	const response = await fetch('/stripe/create-setup-intent/prb', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			stripePublicKey,
		}),
	});

	return response.json() as Promise<{ client_secret: string }>;
};

export const stripeCreateSetupIntentRecaptcha = async (
	isTestUser: boolean,
	stripePublicKey: string,
	token: string,
): Promise<string> => {
	const response = await fetch('/stripe/create-setup-intent/recaptcha', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			isTestUser,
			stripePublicKey,
			token,
		}),
	});

	const json = (await response.json()) as Record<string, string>;

	return json.client_secret;
};
