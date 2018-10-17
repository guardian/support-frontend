// @flow

// ----- Imports ----- //
import { type Store, type Dispatch } from 'redux';
import { getPaymentMethodToSelect } from 'helpers/checkouts';
import { loadPayPalRecurring } from 'helpers/paymentIntegrations/newPaymentFlow/payPalRecurringCheckout';
import {
  updatePaymentMethod,
  updateUserFormData,
  setPayPalHasLoaded,
} from './contributionsLandingActions';
import { type State } from './contributionsLandingReducer';
import { type Action } from './contributionsLandingActions';

// ----- Functions ----- //


function initialisePaymentMethod(state: State, dispatch: Dispatch<Action>) {
  const { contributionType } = state.page.form;
  const { countryId } = state.common.internationalisation;
  const { switches } = state.common.settings;

  const paymentMethodToSelect = getPaymentMethodToSelect(contributionType, switches, countryId);

  dispatch(updatePaymentMethod(paymentMethodToSelect));
}


const init = (store: Store<State, Action, Dispatch<Action>>) => {
  const { dispatch } = store;

  const state = store.getState();
  initialisePaymentMethod(state, dispatch);

  loadPayPalRecurring().then(() => dispatch(setPayPalHasLoaded()));

  const { firstName, lastName, email } = state.page.user;
  dispatch(updateUserFormData({ firstName, lastName, email }));


};


// ----- Exports ----- //

export { init };
