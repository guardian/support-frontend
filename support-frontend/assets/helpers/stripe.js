// @flow
import { logException } from 'helpers/logger';

export const setupStripe = (setStripeHasLoaded: () => void) => {
  if (window.Stripe) setStripeHasLoaded();
  else {
    const htmlElement = document.getElementById('stripe-js');
    if (htmlElement !== null) {
      htmlElement.addEventListener(
        'load',
        setStripeHasLoaded,
      );
    } else {
      logException('Failed to find stripe-js element, cannot initialise Stripe Elements')
    }
  }
};
