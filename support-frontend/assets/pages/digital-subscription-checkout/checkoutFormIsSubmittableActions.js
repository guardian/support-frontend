// @flow

// ----- Imports ----- //

import { getErrors, getFormFields } from 'pages/digital-subscription-checkout/digitalSubscriptionCheckoutReducer';
import type { State } from './digitalSubscriptionCheckoutReducer';
import type { Action } from './digitalSubscriptionCheckoutActions';
import { formIsValid } from 'pages/digital-subscription-checkout/helpers/validation';

// ----- Functions ----- //

const enableOrDisablePayPalExpressCheckoutButton = (formIsSubmittable: boolean) => {
  if (formIsSubmittable && window.enablePayPalButton) {
    window.enablePayPalButton();
  } else if (window.disablePayPalButton) {
    window.disablePayPalButton();
  }
};

function enableOrDisableForm() {
  return (dispatch: Function, getState: () => State): void => {
    enableOrDisablePayPalExpressCheckoutButton(formIsValid(getState));
  };
}

function setFormSubmissionDependentValue(setStateValue: () => Action) {
  return (dispatch: Function): void => {
    dispatch(setStateValue());
    dispatch(enableOrDisableForm());
  };
}

export { setFormSubmissionDependentValue, enableOrDisableForm, enableOrDisablePayPalExpressCheckoutButton };
