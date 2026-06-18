import z from 'zod';

const request = async <T>(
	path: string,
	csrfToken: string,
	body: string,
	schema: z.ZodType<T>,
	description: string,
): Promise<T> => {
	const response = await fetch(path, {
		credentials: 'include',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Csrf-Token': csrfToken,
		},
		body,
	});

	if (!response.ok) {
		throw new Error(`${description} request returned a non OK response`);
	}

	const result = schema.safeParse(await response.json());

	if (!result.success) {
		throw new Error(`${description} response was invalid`);
	}

	return result.data;
};

const createSetupTokenResponseSchema = z.object({
	token: z.string(),
});

export const createSetupToken = async (csrfToken: string): Promise<string> => {
	const body = JSON.stringify({});

	const data = await request(
		'/paypal-complete-payments/setup-token',
		csrfToken,
		body,
		createSetupTokenResponseSchema,
		'Create setup token',
	);

	return data.token;
};

const paymentTokenResponseSchema = z.object({
	token: z.string(),
	email: z.string(),
});

export type PaymentToken = z.infer<typeof paymentTokenResponseSchema>;

export const exchangeSetupTokenForPaymentToken = async (
	csrfToken: string,
	setupToken: string,
): Promise<PaymentToken> => {
	const body = JSON.stringify({ setup_token: setupToken });

	const data = await request(
		'/paypal-complete-payments/payment-token',
		csrfToken,
		body,
		paymentTokenResponseSchema,
		'Create payment token',
	);

	return data;
};
