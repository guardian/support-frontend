// @flow
import { logException } from 'helpers/logger';
import type { ContributionType } from 'helpers/contributions';
import { type PaymentMethod, Stripe } from 'helpers/paymentMethods';

export const setupStripe = (setStripeHasLoaded: () => void) => {
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

export const createStripeSetupIntent = (setStripeSetupIntent: (clientSecret: string) => void) => {
  fetchJson(
    window.guardian.stripeSetupIntentEndpoint,
    requestOptions({publicKey: this.props.stripeKey}, 'omit', 'POST', null)
  ).then(result => {
    setStripeSetupIntent(result.client_secret)
  })
};

export const stripeCardFormIsIncomplete = (
  contributionType: ContributionType,
  paymentMethod: PaymentMethod,
  stripeCardFormComplete: boolean,
): boolean => contributionType === 'ONE_OFF' &&
    paymentMethod === Stripe &&
    !(stripeCardFormComplete);
