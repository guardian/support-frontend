// @flow
import { logException } from 'helpers/logger';
import type { ContributionType } from 'helpers/contributions';
import { type PaymentMethod, Stripe } from 'helpers/paymentMethods';
import type { StripeElementsTestVariants } from 'helpers/abTests/abtestDefinitions';

export const setupStripe = (setStripeHasLoaded: () => void) => {
  if (window.Stripe) { setStripeHasLoaded(); } else {
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

export const stripeCardFormIsIncomplete = (
  contributionType: ContributionType,
  paymentMethod: PaymentMethod,
  stripeElementsTestVariant: StripeElementsTestVariants,
  stripeCardFormComplete: boolean,
): boolean => contributionType === 'ONE_OFF' &&
    paymentMethod === Stripe &&
    stripeElementsTestVariant === 'stripeCardElement' &&
    !(stripeCardFormComplete);
