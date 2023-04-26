import type { StripePaymentMethod } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';

export type PaymentMethodState = {
	name: PaymentMethod;
	stripePaymentMethod?: StripePaymentMethod;
	errors?: string[];
};

export const initialState: PaymentMethodState = {
	name: 'None',
};
