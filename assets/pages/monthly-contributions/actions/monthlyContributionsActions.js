// @flow

// ----- Imports ----- //

import { setStripeAmount } from 'helpers/stripeCheckout/stripeCheckoutActions';
import validateContribution from '../helpers/validation';


// ----- Types ----- //

export type Action = { type: 'SET_CONTRIB_VALUE', value: number };


// ----- Actions ----- //

function setContribValue(value: number): Action {
  return { type: 'SET_CONTRIB_VALUE', value };
}

export default function setContribAmount(amount: string): Function {

  const value = validateContribution(amount);

  return (dispatch) => {
    dispatch(setContribValue(value));
    dispatch(setStripeAmount(value));
  };

}
