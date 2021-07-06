import { PaymentMethod } from 'helpers/forms/paymentMethods';
import { DirectDebit, PayPal, Stripe } from 'helpers/forms/paymentMethods';
import { IsoCountry } from 'helpers/internationalisation/country';

function supportedPaymentMethods(country: IsoCountry): PaymentMethod[] {
	const countrySpecific: PaymentMethod[] =
		country === 'GB' ? [DirectDebit, Stripe, PayPal] : [Stripe, PayPal];
	return countrySpecific;
}

export { supportedPaymentMethods };
