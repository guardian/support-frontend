export type StripeCardState = {
	formComplete: boolean;
	setupIntentClientSecret?: string;
	// The payment method is a token from Stripe that allows us to later retrieve the money
	stripePaymentMethod?: string;
};

export const initialStripeCardState: StripeCardState = {
	formComplete: false,
};
