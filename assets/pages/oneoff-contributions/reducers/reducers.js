// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import type { User as UserState } from 'helpers/user/userReducer';
import type { State as StripeCheckoutState } from 'helpers/stripeCheckout/stripeCheckoutReducer';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';

import { intCmpReducer as intCmp } from 'helpers/tracking/guTracking';
import { refpvidReducer as refpvid } from 'helpers/tracking/guTracking';
import createStripeCheckoutReducer from 'helpers/stripeCheckout/stripeCheckoutReducer';
import createPayPalContributionsCheckoutReducer from 'helpers/payPalContributionsCheckout/payPalContributionsCheckoutReducer';
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
  refpvid: string,
  user: UserState,
  stripeCheckout: StripeCheckoutState,
  csrf: CsrfState,
};

// ----- Reducers ----- //

function createOneOffContribReducer(amount: number, currency: Currency, country: IsoCountry) {

  const initialState: State = {
    amount,
    currency,
    country,
    error: null,
    payPalType: 'NotSet',
  };

  return function oneOffContribReducer(state: State = initialState, action: Action): State {

    switch (action.type) {

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

export default function createRootOneOffContribReducer(
  amount: number,
  currency: Currency,
  country: IsoCountry,
) {
  return combineReducers({
    oneoffContrib: createOneOffContribReducer(amount, currency, country),
    intCmp,
    refpvid,
    user,
    stripeCheckout: createStripeCheckoutReducer(amount, currency.iso),
    payPalContributionsCheckout: createPayPalContributionsCheckoutReducer(amount, currency.iso),
    csrf,
  });
}
