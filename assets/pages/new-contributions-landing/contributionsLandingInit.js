// @flow

// ----- Imports ----- //
import {
  updatePaymentMethod
} from './contributionsLandingActions';
import { type Store, type Dispatch } from "redux";
import { type State } from './contributionsLandingReducer';
import { type Action } from './contributionsLandingActions';
import { type PaymentMethod, getValidPaymentMethods } from 'helpers/checkouts';

// ----- Functions ----- //



const init = (store:  Store<State, Action, Dispatch<Action>>) => {
  const dispatch = store.dispatch;
  const state = store.getState();

  const contributionType = state.page.form.contributionType;
  const countryId = state.common.internationalisation.countryId;
  const switches = state.common.settings.switches;

  const validPaymentMethods = getValidPaymentMethods(contributionType, switches, countryId);

  if (validPaymentMethods && validPaymentMethods[0]) {
    dispatch(updatePaymentMethod(validPaymentMethods[0]));
  }

};


// ----- Exports ----- //

    export { init };




