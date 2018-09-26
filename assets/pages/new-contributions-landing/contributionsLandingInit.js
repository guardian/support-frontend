// @flow

// ----- Imports ----- //
import { type Store, type Dispatch } from 'redux';
import { getValidPaymentMethods } from 'helpers/checkouts';
import { updatePaymentMethod } from './contributionsLandingActions';
import { type State } from './contributionsLandingReducer';
import { type Action } from './contributionsLandingActions';

// ----- Functions ----- //

const init = (store: Store<State, Action, Dispatch<Action>>) => {
  const { dispatch } = store;
  const state = store.getState();

  const { contributionType } = state.page.form;
  const { countryId } = state.common.internationalisation;
  const { switches } = state.common.settings;

  const validPaymentMethods = getValidPaymentMethods(contributionType, switches, countryId);

  if (validPaymentMethods[0]) {
    dispatch(updatePaymentMethod(validPaymentMethods[0]));
  } else {
    dispatch(updatePaymentMethod('None'));
  }
};


// ----- Exports ----- //

export { init };
