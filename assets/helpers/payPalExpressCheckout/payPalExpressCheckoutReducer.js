// @flow

// ----- Imports ----- //

import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { Action } from './payPalExpressCheckoutActions';


// ----- Types ----- //

export type State = {
  amount: number,
  billingPeriod: string,
  currency: IsoCurrency,
  loaded: boolean,
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
