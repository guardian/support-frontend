// @flow

// ----- Imports ----- //

import * as payPalExpressCheckout from './payPalExpressCheckout';


// ----- Types ----- //

export type Action =
  | { type: 'START_PAYPAL_EXPRESS_CHECKOUT' }
  | { type: 'PAYPAL_EXPRESS_CHECKOUT_LOADED' }
  | { type: 'SET_PAYPAL_EXPRESS_CHECKOUT_BAID', baid: string }
  | { type: 'CLOSE_PAYPAL_EXPRESS_OVERLAY' }
  | { type: 'OPEN_PAYPAL_EXPRESS_OVERLAY' }
  | { type: 'SET_PAYPAL_EXPRESS_AMOUNT', amount: number }
  | { type: 'PAYPAL_EXPRESS_ERROR', message: string }
  ;


// ----- Actions ----- //

function startPayPalExpressCheckout(): Action {
  return { type: 'START_PAYPAL_EXPRESS_CHECKOUT' };
}

function payPalExpressCheckoutLoaded(): Action {
  return { type: 'PAYPAL_EXPRESS_CHECKOUT_LOADED' };
}

export function payPalExpressError(message: string): Action {
  return { type: 'PAYPAL_EXPRESS_ERROR', message };
}

export function setPayPalExpressAmount(amount: number): Action {
  return { type: 'SET_PAYPAL_EXPRESS_AMOUNT', amount };
}


function handleSetupResponse(response: Object) {
  let resp = null;
  if (response.status === 200) {
    resp = response.json();
  }

  return resp;
}

// First Step: setupPayment
// Sends request to server to setup payment, and returns Paypal token.
function setupPayment(dispatch, state: Object) {

  return (resolve, reject) => {
    const requestBody = {
      amount: state.payPalExpressCheckout.amount,
      billingPeriod: state.payPalExpressCheckout.billingPeriod,
      currency: state.payPalExpressCheckout.currency,
    };
    const SETUP_PAYMENT_URL = '/paypal/setup-payment';

    fetch(SETUP_PAYMENT_URL, {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    }).then(handleSetupResponse)
      .then((token) => {
        if (token) {
          resolve(token.token);
        } else {
          dispatch(payPalExpressError('PayPal token came back blank.'));
        }
      }).catch((err) => {
        dispatch(payPalExpressError(err.message));
        reject(err);
      });
  };
}

// Second step: createAgreement
function createAgreement(payPalData) {
  const CREATE_AGREEMENT_URL = '/paypal/create-agreement';
  return fetch(CREATE_AGREEMENT_URL, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ token: payPalData.paymentToken }),
  }).then(response => response.json());
}

// Third Step: postForm with baid
function requestData(baid: string, getState: Function) {

  const state = getState();

  const monthlyContribFields = {
    contribution: {
      amount: state.stripeCheckout.amount,
      currency: state.stripeCheckout.currency,
    },
    paymentFields: {
      baid,
    },
    country: state.monthlyContrib.country,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
  };

  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(monthlyContribFields),
  };
}

// Creates the new member by posting the form data with the BAID.
function postForm(baid: string, dispatch: Function, getState: Function) {
  const MONTHLY_CONTRIB_ENDPOINT = '/monthly-contributions/create';
  const MONTHLY_CONTRIB_THANKYOU = '/monthly-contributions/thankyou';

  const request = requestData(baid, getState);

  return fetch(MONTHLY_CONTRIB_ENDPOINT, request).then((response) => {

    if (response.ok) {
      window.location.assign(MONTHLY_CONTRIB_THANKYOU);
    }

    response.text().then(err => dispatch(payPalExpressError(err)));

  });
}

// SetupPaypalExpressCheckout
export function setupPayPalExpressCheckout(): Function {

  return (dispatch, getState) => {

    const handleBaId = (baid: Object) => {
      postForm(baid.token, dispatch, getState);
    };

    const onAuthorize = (data) => {
      createAgreement(data)
        .then(handleBaId)
        .catch((err) => {
          dispatch(payPalExpressError(err));
        });
    };

    dispatch(startPayPalExpressCheckout());

    return payPalExpressCheckout.setup(
      getState().payPalExpressCheckout,
      setupPayment(dispatch, getState()),
      onAuthorize,
    ).then(() => dispatch(payPalExpressCheckoutLoaded()));
  };
}
