export const createSetupToken = async (csrfToken: string): Promise<string> => {
	const body = JSON.stringify({});

	const response = await fetch('/paypal-complete-payments/setup-token', {
		credentials: 'include',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Csrf-Token': csrfToken,
		},
		body,
	});

	const json = (await response.json()) as { token: string };

	return json.token;
};
