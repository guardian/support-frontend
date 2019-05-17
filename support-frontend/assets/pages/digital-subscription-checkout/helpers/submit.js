// @flow

// ----- Imports ----- //

import { type Dispatch } from 'redux';
import { validateForm } from 'pages/digital-subscription-checkout/helpers/validation';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import { showPaymentMethod } from 'pages/digital-subscription-checkout/helpers/paymentProviders';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';


// ----- Functions ----- //

function submitForm(dispatch: Dispatch<Action>, state: CheckoutState) {
  if (validateForm(dispatch, state)) {
    showPaymentMethod(dispatch, state);
  }
}

// ----- Export ----- //

export {
  submitForm,
};
