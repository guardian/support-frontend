// @flow

// ----- Imports ----- //

import { type State } from '../../regularContributionsReducer';


// ----- Selectors ----- //

function getFormFields(state: State) {


  const firstName = {
    id: 'first-name',
    value: state.page.user.firstName,
  };

  const lastName = {
    id: 'last-name',
    value: state.page.user.lastName,
  };

  const email = {
    id: 'email',
    value: state.page.user.email,
  };

  return { firstName, lastName, email };
}

// ----- Exports ----- //

export { getFormFields };
