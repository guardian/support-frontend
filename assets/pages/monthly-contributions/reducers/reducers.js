// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';

import type { User as UserState } from 'helpers/user/userReducer';
import type { State as StripeCheckoutState } from 'helpers/stripeCheckout/stripeCheckoutReducer';
import type { State as PayPalExpressCheckoutState } from 'helpers/payPalExpressCheckout/payPalExpressCheckoutReducer';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';

import { intCmpReducer as intCmp } from 'helpers/tracking/guTracking';
import createStripeCheckoutReducer from 'helpers/stripeCheckout/stripeCheckoutReducer';
import createPayPalExpressCheckout from 'helpers/payPalExpressCheckout/payPalExpressCheckoutReducer';
import user from 'helpers/user/userReducer';
import csrf from 'helpers/csrf/csrfReducer';
import type { Currency } from 'helpers/internationalisation/currency';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { PaymentStatus } from 'components/paymentMethods/paymentMethods';

import type { PayPalButtonType } from 'components/paymentMethods/paymentMethods';
import type { Action } from '../actions/monthlyContributionsActions';


// ----- Types ----- //

export type State = {
  amount: number,
  currency: Currency,
  country: IsoCountry,
  error: ?string,
  paymentStatus: PaymentStatus,
  payPalType: PayPalButtonType,
  statusUri: ?string,
  pollCount: number,
};

export type CombinedState = {
  monthlyContrib: State,
  intCmp: string,
  user: UserState,
  stripeCheckout: StripeCheckoutState,
  payPalExpressCheckout: PayPalExpressCheckoutState,
  csrf: CsrfState,
};

// ----- Reducers ----- //

function createMonthlyContribReducer(amount: number, currency: Currency, country: IsoCountry) {

  const initialState: State = {
    amount,
    currency,
    country,
    error: null,
    paymentStatus: 'NotStarted',
    payPalType: 'NotSet',
    statusUri: null,
    pollCount: 0,
  };

  return function monthlyContrib(state: State = initialState, action: Action): State {
    switch (action.type) {

      case 'CHECKOUT_ERROR':
        return Object.assign({}, state, { paymentStatus: 'Failed', error: action.message });

      case 'CREATING_CONTRIBUTOR':
        return Object.assign({}, state, { paymentStatus: 'Pending' });

      case 'SET_PAYPAL_BUTTON':
        return Object.assign({}, state, { payPalType: action.value });

      case 'SET_STATUS_URI' :
        return Object.assign({}, state, { statusUri: action.uri });

      case 'INCREMENT_POLL_COUNT':
        return Object.assign({}, state, { pollCount: state.pollCount + 1 });

      case 'RESET_POLL_COUNT':
        return Object.assign({}, state, { pollCount: 0 });

      default:
        return state;

    }
  };
}


// ----- Exports ----- //

export default function createRootMonthlyContributionsReducer(
  amount: number,
  currency: Currency,
  country: IsoCountry,
) {
  return combineReducers({
    monthlyContrib: createMonthlyContribReducer(amount, currency, country),
    intCmp,
    user,
    stripeCheckout: createStripeCheckoutReducer(amount, currency.iso),
    payPalExpressCheckout: createPayPalExpressCheckout(amount, currency.iso),
    csrf,
  });
}
