import type { Stripe as StripeJs } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import { useEffect, useState } from 'react';
import type { ContributionType } from 'helpers/contributions';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { Stripe } from 'helpers/forms/paymentMethods';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { IsoCurrency } from '../internationalisation/currency';

const stripeCardFormIsIncomplete = (
	paymentMethod: PaymentMethod,
	stripeCardFormComplete: boolean,
): boolean => paymentMethod === Stripe && !stripeCardFormComplete;

export type StripeAccount = 'ONE_OFF' | 'REGULAR';

export type StripePaymentIntentResult = {
	client_secret?: string;
};

const stripeAccountForContributionType: Record<
	ContributionType,
	StripeAccount
> = {
	ONE_OFF: 'ONE_OFF',
	MONTHLY: 'REGULAR',
	ANNUAL: 'REGULAR',
};

function getStripeKey(
	stripeAccount: StripeAccount,
	country: IsoCountry,
	currency: IsoCurrency,
	isTestUser: boolean,
): string {
	let account;
	switch (currency) {
		case 'AUD': // need to match with how support-workers does it
			account = window.guardian.stripeKeyAustralia[stripeAccount];
			break;
		case 'USD':
			if (country === 'US') {
				// this allows support of US only cards (for single)
				account = window.guardian.stripeKeyUnitedStates[stripeAccount];
			} else {
				account = window.guardian.stripeKeyDefaultCurrencies[stripeAccount];
			}
			break;
		default:
			account = window.guardian.stripeKeyDefaultCurrencies[stripeAccount];
	}
	return isTestUser ? account.test : account.default;
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
	stripeCardFormIsIncomplete,
	stripeAccountForContributionType,
	getStripeKey,
};
