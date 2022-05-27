import { DirectDebit, PayPal, Stripe } from 'helpers/forms/paymentMethods';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

export type SubscriptionsPaymentMethod =
	| typeof DirectDebit
	| typeof PayPal
	| typeof Stripe;

function supportedPaymentMethods(
	currencyId: IsoCurrency,
	countryId: IsoCountry,
): SubscriptionsPaymentMethod[] {
	// We only want to offer DD payment where the currency is GBP AND the country is GB
	// This excludes eg. the Isle of Man
	const allowsDirectDebit = currencyId === 'GBP' && countryId === 'GB';
	const countrySpecific: SubscriptionsPaymentMethod[] = allowsDirectDebit
		? [DirectDebit, Stripe, PayPal]
		: [Stripe, PayPal];
	return countrySpecific;
}

export { supportedPaymentMethods };
