// @flow

// ----- Imports ----- //

import type { Currency } from 'helpers/internationalisation/currency';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { setStripeAmount } from 'helpers/stripeCheckout/stripeCheckoutActions';
import {
  setPayPalExpressAmount,
} from 'helpers/payPalExpressCheckout/payPalExpressCheckoutActions';
import { parse as parseContribution } from 'helpers/contributions';


// ----- Types ----- //

export type Action =
  | { type: 'SET_COUNTRY', value: IsoCountry }
  | { type: 'SET_CONTRIB_VALUE', value: number, currency: Currency }
  | { type: 'CHECKOUT_ERROR', message: string }
  | { type: 'SET_PAYPAL_BUTTON', value: boolean }
  ;


// ----- Actions ----- //

export function setCountry(value: IsoCountry): Action {
  return { type: 'SET_COUNTRY', value };
}

function setContribValue(value: number, currency: Currency): Action {
  return { type: 'SET_CONTRIB_VALUE', value, currency };
}

export function checkoutError(message: string): Action {
  return { type: 'CHECKOUT_ERROR', message };
}

export function setPayPalButton(value: boolean): Action {
  return { type: 'SET_PAYPAL_BUTTON', value };
}

export function setContribAmount(amount: string, currency: Currency): Function {

  const value = parseContribution(amount, 'RECURRING').amount;

  return (dispatch) => {
    dispatch(setContribValue(value, currency));
    dispatch(setStripeAmount(value, currency));
    dispatch(setPayPalExpressAmount(value, currency));
  };

}
