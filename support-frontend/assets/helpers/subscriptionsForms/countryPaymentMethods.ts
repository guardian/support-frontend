import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { DirectDebit, PayPal, Stripe } from 'helpers/forms/paymentMethods';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

function supportedPaymentMethods(
	currencyId: IsoCurrency,
	countryId: IsoCountry,
): PaymentMethod[] {
	// We only want to offer DD payment where the currency is GBP AND the country is GB
	// This excludes eg. the Isle of Man
	const allowsDirectDebit = currencyId === 'GBP' && countryId === 'GB';
	const countrySpecific: PaymentMethod[] = allowsDirectDebit
		? [DirectDebit, Stripe, PayPal]
		: [Stripe, PayPal];
	return countrySpecific;
}

export { supportedPaymentMethods };
