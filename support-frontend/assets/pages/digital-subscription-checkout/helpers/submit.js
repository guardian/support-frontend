// @flow

// ----- Imports ----- //

import { type Dispatch } from 'redux';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import { showPaymentMethod } from 'pages/digital-subscription-checkout/helpers/paymentProviders';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { validateCheckoutForm } from 'helpers/subscriptionsForms/formValidation';

// ----- Functions ----- //

function submitForm(dispatch: Dispatch<Action>, state: CheckoutState) {
  if (validateCheckoutForm(dispatch, state)) {
    showPaymentMethod(dispatch, state);
  }
}

// ----- Export ----- //

export {
  submitForm,
};
