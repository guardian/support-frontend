import type { StripeFormErrors } from 'helpers/redux/checkout/payment/stripe/state';

export type StripeCardFormDisplayErrors = StripeFormErrors & {
	recaptcha?: string[];
	zipCode?: string[];
};
