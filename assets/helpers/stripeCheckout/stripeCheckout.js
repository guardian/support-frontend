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

export const setup = (token: Function, closed: Function) => loadStripe().then(() => {

  stripeHandler = window.StripeCheckout.configure({
    key: 'pk_test_Qm3CGRdrV4WfGYCpm0sftR0f',
    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    token,
    closed,
  });

});


export const openDialogBox = () => {

  if (stripeHandler) {
    stripeHandler.open();
  }

};
