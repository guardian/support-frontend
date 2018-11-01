// @flow

// ----- Imports ----- //

import { type State } from '../../oneOffContributionsReducer';


// ----- Selectors ----- //

function getFormFields(state: State) {

  const fullName = {
    id: 'name',
    value: state.page.user.fullName,
  };

  const email = {
    id: 'email',
    value: state.page.user.email,
  };

  return { fullName, email };
}


// ----- Exports ----- //

export { getFormFields };
