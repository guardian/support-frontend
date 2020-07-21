// @flow
import { logException } from 'helpers/logger';
import { type PaymentMethod, Stripe } from 'helpers/paymentMethods';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { ContributionType } from 'helpers/contributions';

const setupStripe = (setStripeHasLoaded: () => void) => {
  if (window.Stripe) {
    setStripeHasLoaded();
  } else {
    const htmlElement = document.getElementById('stripe-js');
    if (htmlElement !== null) {
      htmlElement.addEventListener(
        'load',
        setStripeHasLoaded,
      );
    } else {
      logException('Failed to find stripe-js element, cannot initialise Stripe Elements');
    }
  }
};

const stripeCardFormIsIncomplete = (
  paymentMethod: PaymentMethod,
  stripeCardFormComplete: boolean,
): boolean =>
  paymentMethod === Stripe &&
  !(stripeCardFormComplete);

export type StripeAccount = 'ONE_OFF' | 'REGULAR';

const stripeAccountForContributionType: {[ContributionType]: StripeAccount } = {
  ONE_OFF: 'ONE_OFF',
  MONTHLY: 'REGULAR',
  ANNUAL: 'REGULAR',
};

function getStripeKey(stripeAccount: StripeAccount, country: IsoCountry, isTestUser: boolean): string {
  switch (country) {
    case 'AU':
      return isTestUser ?
        window.guardian.stripeKeyAustralia[stripeAccount].uat :
        window.guardian.stripeKeyAustralia[stripeAccount].default;
    case 'US':
      return isTestUser ?
        window.guardian.stripeKeyUnitedStates[stripeAccount].uat :
        window.guardian.stripeKeyUnitedStates[stripeAccount].default;
    default:
      return isTestUser ?
        window.guardian.stripeKeyDefaultCurrencies[stripeAccount].uat :
        window.guardian.stripeKeyDefaultCurrencies[stripeAccount].default;
  }
}

export {
  setupStripe,
  stripeCardFormIsIncomplete,
  stripeAccountForContributionType,
  getStripeKey,
};
