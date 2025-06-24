import type { IsoCountry } from '@modules/internationalisation/country';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';

export type StripeAccountType = 'ONE_OFF' | 'REGULAR';

export type StripePaymentIntentResult = {
	client_secret?: string;
};

function getStripeKeyForCountry(
	stripeAccountType: StripeAccountType,
	country: IsoCountry,
	currency: IsoCurrency,
	isTestUser: boolean,
): string {
	let account;
	switch (currency) {
		case 'AUD': // need to match with how support-workers does it
			account = window.guardian.stripeKeyAustralia[stripeAccountType];
			break;
		case 'USD':
			if (country === 'US') {
				// this allows support of US only cards (for single)
				account = window.guardian.stripeKeyUnitedStates[stripeAccountType];
			} else {
				account = window.guardian.stripeKeyDefaultCurrencies[stripeAccountType];
			}
			break;
		default:
			account = window.guardian.stripeKeyDefaultCurrencies[stripeAccountType];
	}
	return isTestUser ? account.test : account.default;
}

function getStripeKeyForProduct(
	stripeAccountType: StripeAccountType,
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	isTestUser: boolean,
) {
	if (
		(productKey === 'HomeDelivery' ||
			productKey === 'NationalDelivery' ||
			productKey === 'SubscriptionCard') &&
		ratePlanKey === 'Sunday'
	) {
		const account = window.guardian.stripeKeyTortoiseMedia[stripeAccountType];
		return isTestUser ? account.test : account.default;
	}
	return;
}

export { getStripeKeyForCountry, getStripeKeyForProduct };
