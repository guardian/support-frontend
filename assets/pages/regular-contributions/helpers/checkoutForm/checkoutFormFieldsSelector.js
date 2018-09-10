// @flow

// ----- Imports ----- //

import { formFieldIsValid } from 'helpers/checkoutForm/checkoutForm';
import { type State } from '../../regularContributionsReducer';


// ----- Selectors ----- //

function getFormFields(state: State) {


  const firstName = {
    id: 'first-name',
    value: state.page.user.firstName,
    ...state.page.checkoutForm.firstName,
  };

  const lastName = {
    id: 'last-name',
    value: state.page.user.lastName,
    ...state.page.checkoutForm.lastName,
  };

  const email = {
    id: 'email',
    value: state.page.user.email,
    ...state.page.checkoutForm.email,
  };

  return { firstName, lastName, email };
}

// ----- Exports ----- //

export { getFormFields };
