// @flow

// ----- Imports ----- //

import { type State } from '../../oneOffContributionsReducer';


// ----- Selectors ----- //

function getFormFields(state: State) {

  const fullName = {
    id: 'name',
    value: state.page.user.fullName,
    ...state.page.checkoutForm.fullName,
  };

  const email = {
    id: 'email',
    value: state.page.user.email,
    ...state.page.checkoutForm.email,
  };

  return { fullName, email };
}


// ----- Exports ----- //

export { getFormFields };
