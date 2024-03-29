import type { PaymentMethod } from '@stripe/stripe-js';

export type StripeFormErrors = {
	cardNumber?: string[];
	expiry?: string[];
	cvc?: string[];
};

export type StripeField = keyof StripeFormErrors;

export type StripeErrorPayload = {
	field: StripeField;
	error?: string;
};

export type StripeCardState = {
	formComplete: boolean;
	showErrors: boolean;
	// The setupIntentClientSecret is generated during the checkout process and represents the intention to take payments in
	// the future, ie. a recurring payment
	setupIntentClientSecret?: string;
	// The payment method is a token generated by Stripe that allows us to later retrieve the money
	stripePaymentMethod?: string | PaymentMethod;
	errors: StripeFormErrors;
};

export const initialStripeCardState: StripeCardState = {
	formComplete: false,
	showErrors: false,
	errors: {
		cardNumber: ['Your card number is incomplete'],
		expiry: ["Your card's expiration date is incomplete"],
		cvc: ["Your card's security code is incomplete"],
	},
};
