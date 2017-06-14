// @flow

// ----- Imports ----- //

import { setStripeAmount } from 'helpers/stripeCheckout/stripeCheckoutActions';
import validateContribution from '../helpers/validation';


// ----- Types ----- //

export type Action =
  | { type: 'SET_CONTRIB_VALUE', value: number }
  | { type: 'SET_FIRST_NAME', name: string }
  | { type: 'SET_LAST_NAME', name: string };


// ----- Actions ----- //

function setContribValue(value: number): Action {
  return { type: 'SET_CONTRIB_VALUE', value };
}

export function setFirstName(name: string): Action {
  return { type: 'SET_FIRST_NAME', name };
}

export function setLastName(name: string): Action {
  return { type: 'SET_LAST_NAME', name };
}

export function setContribAmount(amount: string): Function {

  const value = validateContribution(amount);

  return (dispatch) => {
    dispatch(setContribValue(value));
    dispatch(setStripeAmount(value));
  };

}
