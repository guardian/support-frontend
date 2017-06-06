// @flow

const stripeHandler = null;

const loadStripe = () => {

  return new Promise((resolve) => {

    if(! window.StripeCheckout) {

      const script = document.createElement('script');

      script.onload = function () {
        console.info("Stripe script loaded");
        resolve();
      };

      script.src = 'https://checkout.stripe.com/checkout.js';
      document.head.appendChild(script);

    } else {
      resolve();
    }

  );

}

export const setup = (token) => {

  return loadStripe.then(() => {

    stripeHandler = window.StripeCheckout.configure({
      key: 'pk_test_Qm3CGRdrV4WfGYCpm0sftR0f',
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      token,
    });

  });

};

export const openDialogBox = () => {
  stripeHandler.open();
}


export const stripeCheckoutReducer = (
  state: Participations = {},
  action: Action): Participations => {

  switch (action.type) {

    case 'SETUP_STRIPE_CHECKOUT' : {

    }

    case 'STRIPE_CHECKOUT_LOADED': {
      return Object.assign({}, state, action.payload);
    }

    case 'OPEN_STRIPE_OVERLAY' : {

    }

    default:
      return state;
  }
};




