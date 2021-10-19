// ----- Imports ----- //
import type { Action } from "helpers/subscriptionsForms/formActions";
import type { CheckoutState } from "helpers/subscriptionsForms/subscriptionCheckoutReducer";
import { checkoutFormIsValid } from "helpers/subscriptionsForms/formValidation";

// ----- Functions ----- //
const enableOrDisablePayPalExpressCheckoutButton = (formIsSubmittable: boolean) => {
  if (formIsSubmittable && window.enablePayPalButton) {
    window.enablePayPalButton();
  } else if (window.disablePayPalButton) {
    window.disablePayPalButton();
  }
};

function enableOrDisableForm() {
  return (dispatch: (...args: Array<any>) => any, getState: () => CheckoutState): void => {
    enableOrDisablePayPalExpressCheckoutButton(checkoutFormIsValid(getState()));
  };
}

function setFormSubmissionDependentValue(setStateValue: () => Action) {
  return (dispatch: (...args: Array<any>) => any): void => {
    dispatch(setStateValue());
    dispatch(enableOrDisableForm());
  };
}

export { setFormSubmissionDependentValue, enableOrDisableForm, enableOrDisablePayPalExpressCheckoutButton };