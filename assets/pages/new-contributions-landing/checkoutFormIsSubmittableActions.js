// @flow

// ----- Imports ----- //

import { canContributeWithoutSigningIn } from 'helpers/identityApis';
import { type Action as UserAction } from 'helpers/user/userActions';
import {
  checkAmountOrOtherAmount,
  checkEmail,
  checkFirstName,
  checkLastName,
  checkStateIfApplicable,
} from 'helpers/formValidation';
import {
  type ContributionType,
  type OtherAmounts,
  type SelectedAmounts,
  contributionTypeIsRecurring,
} from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { CaState, UsState } from 'helpers/internationalisation/country';
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

export type FormIsValidParameters = {
  selectedAmounts: SelectedAmounts,
  otherAmounts: OtherAmounts,
  countryGroupId: CountryGroupId,
  contributionType: ContributionType,
  state: UsState | CaState | null,
  firstName: string | null,
  lastName: string | null,
  email: string | null,
  showOneOffNameFields: boolean,
}

const getFormIsValid = (formIsValidParameters: FormIsValidParameters) => {
  const {
    selectedAmounts,
    otherAmounts,
    countryGroupId,
    contributionType,
    state,
    firstName,
    lastName,
    email,
    showOneOffNameFields,
  } = formIsValidParameters;

  return (
    showOneOffNameFields ?
      checkFirstName(firstName) && checkLastName(lastName) :
      true
  ) && checkEmail(email)
    && checkStateIfApplicable(state, countryGroupId)
    && checkAmountOrOtherAmount(selectedAmounts, otherAmounts, contributionType, countryGroupId);
};


const formIsValidParameters = (state: State) => ({
  selectedAmounts: state.page.form.selectedAmounts,
  otherAmounts: state.page.form.formData.otherAmounts,
  countryGroupId: state.common.internationalisation.countryGroupId,
  contributionType: state.page.form.contributionType,
  state: state.page.form.formData.state,
  firstName: state.page.form.formData.firstName,
  lastName: state.page.form.formData.lastName,
  email: state.page.form.formData.email,
  showOneOffNameFields: state.common.abParticipations.showOneOffNameFields === 'control' || state.page.form.contributionType !== 'ONE_OFF',
});

function enableOrDisableForm() {
  return (dispatch: Function, getState: () => State): void => {

    const state = getState();
    const { isRecurringContributor } = state.page.user;

    const shouldBlockExistingRecurringContributor =
      isRecurringContributor && contributionTypeIsRecurring(state.page.form.contributionType);

    const userCanContributeWithoutSigningIn = canContributeWithoutSigningIn(
      state.page.form.contributionType,
      state.page.user.isSignedIn,
      state.page.form.userTypeFromIdentityResponse,
    );

    const formIsValid = getFormIsValid(formIsValidParameters(state));
    dispatch(setFormIsValid(formIsValid));

    const shouldEnable =
      formIsValid
      && !(shouldBlockExistingRecurringContributor)
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
