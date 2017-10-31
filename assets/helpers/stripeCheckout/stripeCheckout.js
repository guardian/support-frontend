// @flow


// ----- Setup ----- //

let stripeHandler = null;


// ----- Functions ----- //

const loadStripe = () => new Promise((resolve) => {

  if (!window.StripeCheckout) {

    const script = document.createElement('script');

    script.onload = resolve;
    script.src = 'https://checkout.stripe.com/checkout.js';

    if (document.head) {
      document.head.appendChild(script);
    }

  } else {
    resolve();
  }

});

export const setupStripeCheckout = (
  callback: Function,
  closeHandler: ?Function,
  currency: string,
  isTestUser: boolean,
): Promise<void> => loadStripe().then(() => {

  const handleToken = (token) => {
    callback(token.id);
  };
  const defaultCloseHandler: Function = () => {};

  stripeHandler = window.StripeCheckout.configure({
    name: 'Guardian',
    description: 'Please enter your card details.',
    allowRememberMe: false,
    key: isTestUser ? window.guardian.stripeKey.uat : window.guardian.stripeKey.default,
    image: 'https://d24w1tjgih0o9s.cloudfront.net/gu.png',
    locale: 'auto',
    currency,
    token: handleToken,
    closed: closeHandler || defaultCloseHandler,
  });
});

export const openDialogBox = (amount: number, email: string) => {
  if (stripeHandler) {
    stripeHandler.open({
      // Must be passed in pence.
      amount: amount * 100,
      email,
    });
  }
};
