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

const getStripeKey = (currency: string, isTestUser: boolean) => {

  let stripeKey = null;

  switch (currency) {
    case 'AUD':
      stripeKey = isTestUser ?
        window.guardian.stripeKeyAustralia.uat : window.guardian.stripeKeyAustralia.default;
      break;
    default:
      stripeKey = isTestUser ?
        window.guardian.stripeKeyRestOfTheWorld.uat :
        window.guardian.stripeKeyRestOfTheWorld.default;
      break;
  }

  return stripeKey;
};

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

  const stripeKey = getStripeKey(currency, isTestUser);

  stripeHandler = window.StripeCheckout.configure({
    name: 'Guardian',
    description: 'Please enter your card details.',
    allowRememberMe: false,
    key: stripeKey,
    image: 'https://uploads.guim.co.uk/2018/01/15/gu.png',
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
