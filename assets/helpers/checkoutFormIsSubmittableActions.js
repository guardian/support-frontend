// @flow

// ----- Functions ----- //

import { userCanContributeWithoutSigningIn } from 'helpers/identityApis';
import type { State } from '../pages/new-contributions-landing/contributionsLandingReducer';
import { formElementIsValid, getForm } from './checkoutForm/checkoutForm';
import {
  type Action as ContributionsLandingAction,
  setFormIsValid,
} from '../pages/new-contributions-landing/contributionsLandingActions';
import { type Action as UserAction } from './user/userActions';

type Action = ContributionsLandingAction | UserAction;

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
    const canContributeWithoutSigningIn = userCanContributeWithoutSigningIn(
      state.page.form.contributionType,
      state.page.user.isSignedIn,
      state.page.form.userTypeFromIdentityResponse,
    );

    const formIsValid = formElementIsValid(getForm('form--contribution'));
    dispatch(setFormIsValid(formIsValid));

    const shouldEnable =
      formIsValid
      && !isRecurringContributor
      && canContributeWithoutSigningIn;

    dispatch(setFormIsSubmittable(shouldEnable));
  };
}

function setFormSubmissionDependentValue(setStateValue: () => Action) {
  return (dispatch: Function): void => {
    dispatch(setStateValue());
    dispatch(enableOrDisableForm());
  };
}

export { setFormSubmissionDependentValue };
