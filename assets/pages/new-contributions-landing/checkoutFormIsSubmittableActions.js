// @flow

// ----- Imports ----- //

import { canContributeWithoutSigningIn } from 'helpers/identityApis';
import { type Action as UserAction } from 'helpers/user/userActions';
import { formElementIsValid, getForm } from 'helpers/checkoutForm/checkoutForm';
import type { State } from './contributionsLandingReducer';
import {
  type Action as ContributionsLandingAction,
  setFormIsValid,
} from './contributionsLandingActions';


// ----- Types ----- //

type Action = ContributionsLandingAction | UserAction;

// ----- Functions ----- //

const enableOrDisablePayPalExpressCheckoutButton = (formIsSubmittable: boolean) => {
  if (formIsSubmittable && window.enablePayPalButton) {
    window.enablePayPalButton();
  } else if (window.disablePayPalButton) {
    window.disablePayPalButton();
  }
};

const setFormIsSubmittable = (formIsSubmittable: boolean): Action => {
  enableOrDisablePayPalExpressCheckoutButton(formIsSubmittable);
  return ({ type: 'SET_FORM_IS_SUBMITTABLE', formIsSubmittable });
};

function enableOrDisableForm() {
  return (dispatch: Function, getState: () => State): void => {

    const state = getState();
    const { isRecurringContributor } = state.page.user;
    const userCanContributeWithoutSigningIn = canContributeWithoutSigningIn(
      state.page.form.contributionType,
      state.page.user.isSignedIn,
      state.page.form.userTypeFromIdentityResponse,
    );

    const formIsValid = formElementIsValid(getForm('form--contribution'));
    dispatch(setFormIsValid(formIsValid));

    const shouldEnable =
      formIsValid
      && !isRecurringContributor
      && userCanContributeWithoutSigningIn;

    dispatch(setFormIsSubmittable(shouldEnable));
  };
}

function setFormSubmissionDependentValue(setStateValue: () => Action) {
  return (dispatch: Function): void => {
    dispatch(setStateValue());
    dispatch(enableOrDisableForm());
  };
}

export { setFormSubmissionDependentValue, enableOrDisableForm };
