// @flow

// ----- Imports ----- //

import { getErrors, getFormFields } from 'pages/digital-subscription-checkout/digitalSubscriptionCheckoutReducer';
import type { State } from './digitalSubscriptionCheckoutReducer';

// ----- Functions ----- //

const enableOrDisablePayPalExpressCheckoutButton = (formIsSubmittable: boolean) => {
  if (formIsSubmittable && window.enablePayPalButton) {
    window.enablePayPalButton();
  } else if (window.disablePayPalButton) {
    window.disablePayPalButton();
  }
};

const formIsValid = (state: State): boolean => {
  const errors = getErrors(getFormFields(state));
  return errors.length === 0
};

function enableOrDisableForm() {
  return (dispatch: Function, getState: () => State): void => {
    enableOrDisablePayPalExpressCheckoutButton(formIsValid(getState()));
  };
}

function setFormSubmissionDependentValue(setStateValue: () => Action) {
  return (dispatch: Function): void => {
    dispatch(setStateValue());
    dispatch(enableOrDisableForm());
  };
}

export { setFormSubmissionDependentValue, enableOrDisableForm, enableOrDisablePayPalExpressCheckoutButton };
