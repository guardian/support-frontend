import type { IsoCurrency } from '@modules/internationalisation/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';

export const setupPayPalPayment = async (
	amount: number,
	currency: IsoCurrency,
	billingPeriod: BillingPeriod,
	csrfToken: string,
): Promise<string> => {
	const body = JSON.stringify({
		amount,
		billingPeriod,
		currency,
		requireShippingAddress: false,
	});

	const response = await fetch('/paypal/setup-payment', {
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

export const paypalOneClickCheckout = async (
	paymentToken: unknown,
	csrfToken: string,
): Promise<string> => {
	const body = JSON.stringify({
		token: paymentToken,
	});

	const response = await fetch('/paypal/one-click-checkout', {
		credentials: 'include',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Csrf-Token': csrfToken,
		},
		body,
	});

	const json = (await response.json()) as { baid: string };

	return json.baid;
};
