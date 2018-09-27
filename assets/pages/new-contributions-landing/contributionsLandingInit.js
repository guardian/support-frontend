// @flow

// ----- Imports ----- //
import { type Store, type Dispatch } from 'redux';
import { getValidPaymentMethods } from 'helpers/checkouts';
import { type Switches } from 'helpers/settings';
import { type IsoCountry } from 'helpers/internationalisation/country';
import {
updatePaymentMethod,
updateUserFormData,
} from './contributionsLandingActions';
import { type State } from './contributionsLandingReducer';
import { type Action } from './contributionsLandingActions';

// ----- Functions ----- //

function setPaymentMethod(
  dispatch: Dispatch<Action>,
  contributionType: string,
  switches: Switches,
  countryId: IsoCountry
) {
  const validPaymentMethods = getValidPaymentMethods(contributionType, switches, countryId);

  if (validPaymentMethods[0]) {
    dispatch(updatePaymentMethod(validPaymentMethods[0]));
  } else {
    dispatch(updatePaymentMethod('None'));
  }
}


const init = (store: Store<State, Action, Dispatch<Action>>) => {
  const { dispatch } = store;
  const state = store.getState();

  const { contributionType } = state.page.form;
  const { countryId } = state.common.internationalisation;
  const { switches } = state.common.settings;
  setPaymentMethod(dispatch, contributionType, switches, countryId);

  const { firstName, lastName, email } = state.page.user;
  dispatch(updateUserFormData({ firstName, lastName, email }));


};


// ----- Exports ----- //

export { init, setPaymentMethod };
