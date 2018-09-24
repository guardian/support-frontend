// @flow

// ----- Imports ----- //

import type { PaymentMethod } from 'helpers/checkouts';
import { routes } from 'helpers/routes';
import { addQueryParamsToURL } from 'helpers/url';


// ----- Types ----- //

export type Action =
  | { type: 'CHECKOUT_PENDING', paymentMethod: PaymentMethod }
  | { type: 'CHECKOUT_SUCCESS', paymentMethod: PaymentMethod }
  | { type: 'CHECKOUT_ERROR', message: string }
  | { type: 'SET_PAYPAL_HAS_LOADED' }
  | { type: 'CREATING_CONTRIBUTOR' };

// ----- Actions ----- //

function checkoutPending(paymentMethod: PaymentMethod): Action {
  return { type: 'CHECKOUT_PENDING', paymentMethod };
}

function checkoutSuccess(paymentMethod: PaymentMethod): Action {
  return { type: 'CHECKOUT_SUCCESS', paymentMethod };
}

function paymentSuccessful(ctry: string, paymentType: string, paymentMethod: PaymentMethod) {
  return (dispatch: Dispatch<Action>) => {

    const url = addQueryParamsToURL(
      routes.tipContributionSuccess,
      { country: ctry, contribution_type: paymentType, payment_method: paymentMethod },
    );
    fetch(url);
    dispatch(checkoutSuccess(paymentMethod));
  };
}

function checkoutError(specificError: ?string): Action {
  const defaultError = 'There was an error processing your payment. Please\u00a0try\u00a0again\u00a0later.';
  const message = specificError || defaultError;
  return { type: 'CHECKOUT_ERROR', message };
}

function setPayPalHasLoaded(): Action {
  return { type: 'SET_PAYPAL_HAS_LOADED' };
}

function creatingContributor(): Action {
  return { type: 'CREATING_CONTRIBUTOR' };
}

// ----- Exports ----- //

export {
  checkoutPending,
  paymentSuccessful,
  checkoutError,
  setPayPalHasLoaded,
  creatingContributor,
};
