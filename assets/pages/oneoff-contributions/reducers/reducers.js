// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { User as UserState } from 'helpers/user/userReducer';
import type { State as StripeCheckoutState } from 'helpers/stripeCheckout/stripeCheckoutReducer';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';

import { intCmpReducer as intCmp } from 'helpers/intCmp';
import createStripeCheckoutReducer from 'helpers/stripeCheckout/stripeCheckoutReducer';
import payPalContributionsCheckout from 'helpers/payPalContributionsCheckout/payPalContributionsCheckoutReducer';
import user from 'helpers/user/userReducer';
import csrf from 'helpers/csrf/csrfReducer';
import type { Currency } from 'helpers/internationalisation/currency';
import type { IsoCountry } from 'helpers/internationalisation/country';

import type { PayPalButtonType } from 'components/paymentMethods/paymentMethods';
import type { Action } from '../actions/oneoffContributionsActions';


// ----- Types ----- //

export type State = {
  amount: number,
  currency: Currency,
  country: IsoCountry,
  error: ?string,
  payPalType: PayPalButtonType,
};

export type CombinedState = {
  oneoffContrib: State,
  intCmp: string,
  user: UserState,
  stripeCheckout: StripeCheckoutState,
  csrf: CsrfState,
};

// ----- Reducers ----- //

function oneoffContrib(amount: number, currency: Currency, country: IsoCountry) {

  const initialState: State = {
    amount,
    currency,
    country,
    error: null,
    payPalType: 'NotSet',
  };

  return (state: State = initialState, action: Action): State => {

    switch (action.type) {

      case 'SET_CONTRIB_VALUE':
        return Object.assign({}, state, { amount: action.value });

      case 'CHECKOUT_ERROR':
        return Object.assign({}, state, { error: action.message });

      case 'SET_PAYPAL_BUTTON' :
        return Object.assign({}, state, { payPalType: action.value });

      default:
        return state;

    }
  };
}


// ----- Exports ----- //

export default (amount: number, currency: Currency, country: IsoCountry) =>
  combineReducers({
    oneoffContrib: oneoffContrib(amount, currency, country),
    intCmp,
    user,
    stripeCheckout: createStripeCheckoutReducer(amount, currency.iso),
    payPalContributionsCheckout,
    csrf,
  });
