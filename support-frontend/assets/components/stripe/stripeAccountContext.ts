import React from 'react';
import type { StripeAccount } from 'helpers/forms/stripe';

type StripeAccountContextData = {
	publicKey: string;
	stripeAccount: StripeAccount | 'NONE';
};

export const StripeAccountContext =
	React.createContext<StripeAccountContextData>({
		publicKey: '',
		stripeAccount: 'NONE',
	});
