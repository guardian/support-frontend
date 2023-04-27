import type { StripePaymentMethod } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type {
	IsoCountry,
	StateProvince,
} from 'helpers/internationalisation/country';

export type PaymentMethodState = {
	name: PaymentMethod;
	stripePaymentMethod?: StripePaymentMethod;
	country?: IsoCountry;
	state?: StateProvince;
	errors?: string[];
};

export const initialState: PaymentMethodState = {
	name: 'None',
};
