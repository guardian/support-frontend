// @flow

// ----- Imports ----- //

import { formFieldIsValid } from 'helpers/checkoutForm/checkoutForm';
import { type State } from '../../oneOffContributionsReducer';


// ----- Selectors ----- //

function getFormFields(state: State) {

  const fullNameFromState = {
    value: state.page.user.fullName,
    ...state.page.checkoutForm.fullName,
  };

  const emailFromState = {
    value: state.page.user.email,
    ...state.page.checkoutForm.email,
  };

  const fullName = {
    value: fullNameFromState.value,
    shouldValidate: state.page.checkoutForm.fullName.shouldValidate,
    isValid: formFieldIsValid(fullNameFromState),
  };
  const email = {
    value: emailFromState.value,
    shouldValidate: state.page.checkoutForm.email.shouldValidate,
    isValid: formFieldIsValid(emailFromState),
  };

  return { fullName, email };
}


// ----- Exports ----- //

export { getFormFields };
