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

interface CreateCheckoutSessionResponse {
	id: string;
	url: string;
}
export const stripeCreateCheckoutSession =
	async (): Promise<CreateCheckoutSessionResponse> => {
		const response = await fetch('/stripe/create-checkout-session', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			// No payload yet, but I imagine there'll be something we need to send in future (price? promo code?)
			body: JSON.stringify({}),
		});

		const json = (await response.json()) as CreateCheckoutSessionResponse;

		return json;
	};
