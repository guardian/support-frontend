import type { StripeAccountType } from 'helpers/forms/stripe';

export type StripeAccountDetailsState = {
	publicKey: string;
	stripeAccount: StripeAccountType;
};

export const initialState: StripeAccountDetailsState = {
	publicKey: '',
	stripeAccount: 'REGULAR',
};
