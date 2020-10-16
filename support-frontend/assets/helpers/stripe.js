// @flow
// $FlowIgnore - required for hooks
import { useEffect, useState } from 'react';
import { loadStripe, type Stripe as StripeSDK } from '@stripe/stripe-js/pure';
import { onConsentChange } from '@guardian/consent-management-platform';
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

const stripeScriptHasBeenAddedToPage = (): boolean =>
  !!document.querySelector('script[src^=\'https://js.stripe.com\']');

export const useStripeObjects = (stripeAccount: StripeAccount, stripeKey: string) => {
  const [stripeObjects, setStripeObjects] = useState<{[StripeAccount]: StripeSDK | null}>({
    REGULAR: null,
    ONE_OFF: null,
  });
  (useEffect(
    () => {
      if (stripeObjects[stripeAccount] === null) {
        console.log('card form');

        new Promise((resolve) => {
          onConsentChange(({ ccpa, tcfv2 }) => {
            if (ccpa) {
              resolve(true);
            }
            if (tcfv2 && tcfv2.consents[1]) {
              resolve(true);
            }
            resolve(false);
          });
        }).then((hasRequiredConsentsForFraudDetection) => {
          if (!stripeScriptHasBeenAddedToPage()) {
            loadStripe.setLoadParameters({ advancedFraudSignals: hasRequiredConsentsForFraudDetection });
          }
          return loadStripe(stripeKey);
        }).then((newStripe) => {
          setStripeObjects(prevData => ({ ...prevData, [stripeAccount]: newStripe }));
        });
      }
    },
    [stripeAccount],
  ));

  return stripeObjects;
};


export {
  setupStripe,
  stripeCardFormIsIncomplete,
  stripeAccountForContributionType,
  getStripeKey,
};
