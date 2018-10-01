// @flow

// ----- Imports ----- //

import { type Dispatch } from 'redux';
import { routes } from 'helpers/routes';
import { addQueryParamsToURL } from 'helpers/url';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { CheckoutFailureReason } from 'helpers/checkoutErrors';

// ----- Types ----- //

export type Action =
    | { type: 'CHECKOUT_ERROR', checkoutFailureReason: CheckoutFailureReason }
    | { type: 'CHECKOUT_SUCCESS' };


// ----- Action Creators ----- //

function checkoutError(checkoutFailureReason: CheckoutFailureReason): Action {
  return { type: 'CHECKOUT_ERROR', checkoutFailureReason };
}

function checkoutSuccess(): Action {
  return { type: 'CHECKOUT_SUCCESS' };
}

function getCountryFromCurrency(currency: IsoCurrency): string {
  switch (currency) {
    case 'GBP':
      return ('GB');

    case 'USD':
      return ('US');

    case 'AUD':
      return ('AU');

    default:
      return ('ROW');
  }
}

function paymentSuccessful(currency: IsoCurrency, paymentType: string, paymentMethod: string) {
  return (dispatch: Dispatch<Action>) => {

    const ctry = getCountryFromCurrency(currency);
    const url = addQueryParamsToURL(
      routes.tipContributionSuccess,
      { country: ctry, contribution_type: paymentType, payment_method: paymentMethod },
    );
    fetch(url);
    dispatch(checkoutSuccess());
  };
}

// ----- Exports ----- //

export { checkoutError, paymentSuccessful };
