// @ts-expect-error - required for hooks
import type { Stripe as StripeSDK } from '@stripe/stripe-js/pure';
import { loadStripe } from '@stripe/stripe-js/pure';
import { useEffect, useState } from 'react';
import type { ContributionType } from 'helpers/contributions';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { Stripe } from 'helpers/forms/paymentMethods';
import type { IsoCountry } from 'helpers/internationalisation/country';

const stripeCardFormIsIncomplete = (
	paymentMethod: PaymentMethod,
	stripeCardFormComplete: boolean,
): boolean => paymentMethod === Stripe && !stripeCardFormComplete;

export type StripeAccount = 'ONE_OFF' | 'REGULAR';
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
	isTestUser: boolean,
): string {
	switch (country) {
		case 'AU':
			return isTestUser
				? window.guardian.stripeKeyAustralia[stripeAccount].uat
				: window.guardian.stripeKeyAustralia[stripeAccount].default;

		case 'US':
			return isTestUser
				? window.guardian.stripeKeyUnitedStates[stripeAccount].uat
				: window.guardian.stripeKeyUnitedStates[stripeAccount].default;

		default:
			return isTestUser
				? window.guardian.stripeKeyDefaultCurrencies[stripeAccount].uat
				: window.guardian.stripeKeyDefaultCurrencies[stripeAccount].default;
	}
}

//  this is required as useStripeObjects is used in multiple components
//  but we only want to call setLoadParameters once.
const stripeScriptHasBeenAddedToPage = (): boolean =>
	!!document.querySelector("script[src^='https://js.stripe.com']");

export const useStripeObjects = (
	stripeAccount: StripeAccount,
	stripeKey: string,
) => {
	const [stripeObjects, setStripeObjects] = useState<
		Record<StripeAccount, StripeSDK | null>
	>({
		REGULAR: null,
		ONE_OFF: null,
	});
	useEffect(() => {
		if (stripeObjects[stripeAccount] === null) {
			if (!stripeScriptHasBeenAddedToPage()) {
				loadStripe.setLoadParameters({
					advancedFraudSignals: false,
				});
			}

			loadStripe(stripeKey).then((newStripe) => {
				setStripeObjects((prevData) => ({
					...prevData,
					[stripeAccount]: newStripe,
				}));
			});
		}
	}, [stripeAccount]);
	return stripeObjects;
};
export {
	stripeCardFormIsIncomplete,
	stripeAccountForContributionType,
	getStripeKey,
};
