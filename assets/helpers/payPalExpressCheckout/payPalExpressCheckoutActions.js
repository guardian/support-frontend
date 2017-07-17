// @flow

// ----- Imports ----- //

import * as payPalExpressCheckout from './payPalExpressCheckout';
import type { State as PaypalState } from './payPalExpressCheckoutReducer';


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

function setPayPalExpressCheckoutBaId(token: string): Action {
  return { type: 'SET_PAYPAL_EXPRESS_CHECKOUT_BAID', token };
}

function closePayPalExpressOverlay(): Action {
  return { type: 'CLOSE_PAYPAL_EXPRESS_OVERLAY' };
}

export function openPayPalExpressOverlay(amount: number, email: string): Action {
  stripeCheckout.openDialogBox(amount, email);
  return { type: 'OPEN_PAYPAL_EXPRESS_OVERLAY' };
}

export function setPayPalExpressAmount(amount: number): Action {
  return { type: 'SET_PAYPAL_EXPRESS_AMOUNT', amount };
}

export function payPalExpressError(message: string): Action {
  return { type: 'PAYPAL_EXPRESS_ERROR', amount };
}


// Sends request to server to setup payment, and returns Paypal token.
function setupPayment(dispatch, state: PaypalState) {

  return (resolve, reject) => {

    const requestBody = {
      amount: state.amount,
      billingPeriod: state.billingPeriod,
      currency: state.currency,
    };

    const SETUP_PAYMENT_URL = '/payPal/setup-payment';

    fetch(SETUP_PAYMENT_URL, {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    }).then(handleSetupResponse)
      .then(token => {
        if (token) {
          resolve(token);
        } else {
          dispatch(payPalExpressError('PayPal token came back blank.'));
        }
      }).catch(err => {
        dispatch(payPalExpressError(err.message));
        reject(err);
      })
    }
  }



export function setupPayPalExpressCheckout(callback: Function): Function {

  return (dispatch, getState) => {



    const onAuthorize = (data, actions) => {
      createAgreement(data).then(postForm)
        .catch(err => {
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


function createAgreement(payPalData) {

  const CREATE_AGREEMENT_URL = '/payPal/create-agreement';
  return fetch(CREATE_AGREEMENT_URL, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ token: payPalData.paymentToken }),
  }).then(response => response.json());
}


// Creates the new member by posting the form data with the BAID.
function postForm(baid) {
  let data = serializer(utilsHelper.toArray(form.elem.elements), { 'payment.payPalBaid': baid.token });

   	/*
   	  ajax({

     //  		url: form.elem.action,
    	// 	method: 'post',
    	// 	data: data,
    	// 	success: function (successData) {
    	// 		window.location.assign(successData.redirect);
    	// 	},
  	// 	error: function (errData) {
    	// 		alert(err);
    	// 	}
  	// });
     */
}


