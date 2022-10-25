import type { PaymentMethod } from 'helpers/forms/paymentMethods';

export type PaymentMethodState = {
	name: PaymentMethod;
	errors?: string[];
};

export const initialState: PaymentMethodState = {
	name: 'None',
};
