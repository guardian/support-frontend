// @flow

// ----- Imports ----- //

import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { Action } from './payPalContributionsCheckoutActions';

// ----- Types ----- //

export type State = {
  amount: number,
  currency: string,
  payPalPayClicked: boolean,
};

export type CombinedState = {
  payPalContributionsCheckout: State,
  intCmp: ?string,
};

// ----- Exports ----- //

export default function createPayPalContributionsCheckoutReducer(
  amount: number,
  currency: IsoCurrency,
) {

  const initialState: State = {
    payPalPayClicked: false,
    currency,
    amount,
  };

  return function payPalContributionsCheckoutReducer(
    state: State = initialState,
    action: Action,
  ): State {
    switch (action.type) {

      case 'PAYPAL_PAY_CONTRIBUTIONS_CLICKED':
        return Object.assign({}, state, { payPalPayClicked: true });

      default:
        return state;

    }
  };
}
