// @flow

// ----- Imports ----- //

import { setStripeAmount } from 'helpers/stripeCheckout/stripeCheckoutActions';
import validateContribution from '../helpers/validation';


// ----- Actions ----- //

export default function setContribAmount(amount: string): Function {

  return (dispatch) => {
    dispatch(setStripeAmount(validateContribution(amount)));
  };

}
