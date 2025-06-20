import type { IsoCountry } from '@modules/internationalisation/country';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { DirectDebit, PayPal, Stripe } from 'helpers/forms/paymentMethods';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';


type SubscriptionsPaymentMethod =
	| typeof DirectDebit
	| typeof PayPal
	| typeof Stripe;

type SubscriptionsSwitches = 'paypal' | 'directDebit' | 'creditCard';

function getPaymentMethodSwitchName(
	paymentMethod: SubscriptionsPaymentMethod,
): SubscriptionsSwitches | null {
	switch (paymentMethod) {
		case PayPal:
			return 'paypal';

		case Stripe:
			return 'creditCard';

		case DirectDebit:
			return 'directDebit';

		default:
			return null;
	}
}

function supportedPaymentMethods(
	currencyId: IsoCurrency,
	countryId: IsoCountry,
): SubscriptionsPaymentMethod[] {
	const subsPaymentMethods: SubscriptionsPaymentMethod[] = [
		DirectDebit,
		Stripe,
		PayPal,
	];

	const switchedOnPaymentMethods: SubscriptionsPaymentMethod[] =
		subsPaymentMethods.filter((paymentMethod) =>
			isSwitchOn(
				`subscriptionsPaymentMethods.${
					getPaymentMethodSwitchName(paymentMethod) ?? '-'
				}`,
			),
		);

	// We only want to offer DD payment where the currency is GBP AND the country is GB
	// This excludes eg. the Isle of Man
	const allowsDirectDebit = currencyId === 'GBP' && countryId === 'GB';

	return allowsDirectDebit
		? switchedOnPaymentMethods
		: switchedOnPaymentMethods.filter((pm) => pm !== DirectDebit);
}

export { supportedPaymentMethods };
