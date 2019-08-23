// @flow

export const setupStripe = (setStripeHasLoaded: () => void) => {
  const htmlElement = document.getElementById('stripe-js');
  if (htmlElement !== null) {
    debugger
    htmlElement.addEventListener(
      'load',
      setStripeHasLoaded,
    );
  }
};
