import type { ActiveProductKey } from '@guardian/support-service-lambdas/modules/product-catalog/src/productCatalog';
import type { Stripe as StripeJs } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import { useEffect, useState } from 'react';
import type { ContributionType } from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { IsoCurrency } from '../internationalisation/currency';

export type StripeAccountType = 'ONE_OFF' | 'REGULAR';

export type StripePaymentIntentResult = {
	client_secret?: string;
};

const stripeAccountForContributionType: Record<
	ContributionType,
	StripeAccountType
> = {
	ONE_OFF: 'ONE_OFF',
	MONTHLY: 'REGULAR',
	ANNUAL: 'REGULAR',
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
	ratePlanKey: string,
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

//  this is required as useStripeAccount is used in multiple components
//  but we only want to call setLoadParameters once.
const stripeScriptHasBeenAddedToPage = (): boolean =>
	!!document.querySelector("script[src^='https://js.stripe.com']");

export function useStripeAccount(stripeKey: string): StripeJs | null {
	const [stripeSdk, setStripeSdk] = useState<StripeJs | null>(null);

	useEffect(() => {
		if (stripeSdk === null && stripeKey) {
			if (!stripeScriptHasBeenAddedToPage()) {
				loadStripe.setLoadParameters({
					advancedFraudSignals: false,
				});
			}

			void loadStripe(stripeKey).then((newStripe) => {
				setStripeSdk(newStripe);
			});
		}
	}, [stripeKey]);

	return stripeSdk;
}

export {
	stripeAccountForContributionType,
	getStripeKeyForCountry,
	getStripeKeyForProduct,
};
