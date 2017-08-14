// @flow

// ----- Imports ----- //

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { State as PayPalExpressCheckoutState } from 'helpers/payPalExpressCheckout/payPalExpressCheckoutReducer';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { Action } from './payPalExpressCheckoutActions';

// ----- Types ----- //

export type State = {
  amount: number,
  billingPeriod: string,
  currency: IsoCurrency,
  loaded: boolean,
};

export type CombinedState = {
  csrf: CsrfState,
  payPalExpressCheckout: PayPalExpressCheckoutState,
};

// ----- Exports ----- //

export default function payPalExpressCheckoutReducer(amount: number, currency: IsoCurrency) {

  const initialState: State = {
    amount,
    billingPeriod: 'monthly',
    currency,
    loaded: false,
  };

  return (state: State = initialState, action: Action): State => {

    switch (action.type) {

      case 'PAYPAL_EXPRESS_CHECKOUT_LOADED':
        return Object.assign({}, state, { loaded: true });

      default:
        return state;

    }
  };
}
