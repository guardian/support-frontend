interface StripeResponseData {
	client_secret: string;
}

export const stripeCreateSetupIntentPrb = async (
	stripePublicKey: string,
): Promise<string> => {
	const response = await fetch('/stripe/create-setup-intent/prb', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			stripePublicKey,
		}),
	});

	const json = (await response.json()) as StripeResponseData;

	return json.client_secret;
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

	const json = (await response.json()) as StripeResponseData;

	return json.client_secret;
};
