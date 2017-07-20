// @flow

// ----- Imports ----- //

import * as payPalExpressCheckout from './payPalExpressCheckout';

// ----- Types ----- //

export type Action =
  | { type: 'START_PAYPAL_EXPRESS_CHECKOUT' }
  | { type: 'SET_PAYPAL_EXPRESS_AMOUNT', amount: number }
  | { type: 'PAYPAL_EXPRESS_CHECKOUT_LOADED' }
  | { type: 'PAYPAL_EXPRESS_ERROR', message: string }
  ;

// ----- Setup ----- //

const SETUP_PAYMENT_URL = '/paypal/setup-payment';
const CREATE_AGREEMENT_URL = '/paypal/create-agreement';


// ----- Actions ----- //

function startPayPalExpressCheckout(): Action {
  return { type: 'START_PAYPAL_EXPRESS_CHECKOUT' };
}

export function setPayPalExpressAmount(amount: number): Action {
  return { type: 'SET_PAYPAL_EXPRESS_AMOUNT', amount };
}

function payPalExpressCheckoutLoaded(): Action {
  return { type: 'PAYPAL_EXPRESS_CHECKOUT_LOADED' };
}

export function payPalExpressError(message: string): Action {
  return { type: 'PAYPAL_EXPRESS_ERROR', message };
}

// ----- Auxiliary Functions -----//

function handleSetupResponse(response: Object) {
  let resp = null;
  if (response.status === 200) {
    resp = response.json();
  }

  return resp;
}

function payPalRequestData(bodyObj: Object, state: Object) {

  const body = JSON.stringify(bodyObj);

  return {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Csrf-Token': state.csrf.token },
    body,
  };
}

function setupPayment(dispatch, state) {

  const payPalState = state.payPalExpressCheckout;

  return (resolve, reject) => {

    const requestBody = {
      amount: payPalState.amount,
      billingPeriod: payPalState.billingPeriod,
      currency: payPalState.currency,
    };

    fetch(SETUP_PAYMENT_URL, payPalRequestData(requestBody, state))
      .then(handleSetupResponse)
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

function createAgreement(payPalData, state: Object) {
  const body = { token: payPalData.paymentToken };

  return fetch(CREATE_AGREEMENT_URL, payPalRequestData(body, state))
    .then(response => response.json());
}

// ----- Functions -----//

export function setupPayPalExpressCheckout(callback: Function): Function {

  return (dispatch, getState) => {

    const state = getState();
    const payPalState = state.payPalExpressCheckout;

    const handleBaId = (baid: Object) => {
      callback(baid.token, dispatch, getState);
    };

    const onAuthorize = (data) => {
      createAgreement(data, getState())
        .then(handleBaId)
        .catch((err) => {
          dispatch(payPalExpressError(err));
        });
    };

    dispatch(startPayPalExpressCheckout());

    return payPalExpressCheckout
      .setup(payPalState, setupPayment(dispatch, state), onAuthorize)
      .then(() => dispatch(payPalExpressCheckoutLoaded()));
  };
}
