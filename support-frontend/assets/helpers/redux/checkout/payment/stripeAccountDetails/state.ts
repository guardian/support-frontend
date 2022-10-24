import type { StripeAccount } from 'helpers/forms/stripe';

export type StripeAccountDetailsState = {
	publicKey: string;
	stripeAccount: StripeAccount;
};

export const initialStripeAccountDetailsState: StripeAccountDetailsState = {
	publicKey: '',
	stripeAccount: 'REGULAR',
};
