// @flow

import type { Action } from 'helpers/forms/paymentIntegrations/payPalActions';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';

type PayPalState = {
  hasLoaded: boolean,
  csrf: CsrfState,
}

const initialState: PayPalState = {
  hasLoaded: false,
  csrf: window.guardian.csrf,
}

export function createPayPalReducer() {
  return function payPalReducer(
    state: PayPalState = initialState,
    action: Action,
  ): PayPalState {

    switch (action.type) {
      case 'SET_PAYPAL_HAS_LOADED':
        return { ...state, hasLoaded: true };
      default:
        return state;
    }
  };
}

