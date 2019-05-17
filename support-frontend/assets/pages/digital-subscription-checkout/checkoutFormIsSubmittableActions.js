// @flow

// ----- Imports ----- //

import type { Action } from 'helpers/subscriptionsForms/formActions';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { checkoutFormIsValid } from 'helpers/subscriptionsForms/formValidation';

// ----- Functions ----- //

const enableOrDisablePayPalExpressCheckoutButton = (formIsSubmittable: boolean) => {
  if (formIsSubmittable && window.enablePayPalButton) {
    window.enablePayPalButton();
  } else if (window.disablePayPalButton) {
    window.disablePayPalButton();
  }
};

function enableOrDisableForm() {
  return (dispatch: Function, getState: () => CheckoutState): void => {
    enableOrDisablePayPalExpressCheckoutButton(checkoutFormIsValid(getState()));
  };
}

function setFormSubmissionDependentValue(setStateValue: () => Action) {
  return (dispatch: Function): void => {
    dispatch(setStateValue());
    dispatch(enableOrDisableForm());
  };
}

export { setFormSubmissionDependentValue, enableOrDisableForm, enableOrDisablePayPalExpressCheckoutButton };
