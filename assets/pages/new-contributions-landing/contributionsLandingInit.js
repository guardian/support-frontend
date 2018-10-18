// @flow

// ----- Imports ----- //
import { type Store, type Dispatch } from 'redux';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { loadPayPalRecurring } from 'helpers/paymentIntegrations/newPaymentFlow/payPalRecurringCheckout';
import { setupStripeCheckout } from 'helpers/paymentIntegrations/newPaymentFlow/stripeCheckout';
import { type ThirdPartyPaymentLibrary, getPaymentMethodToSelect, getValidPaymentMethods } from 'helpers/checkouts';
import {
  type Action,
  paymentWaiting,
  onThirdPartyPaymentAuthorised,
  setThirdPartyPaymentLibrary,
  updatePaymentMethod,
  updateUserFormData,
  setPayPalHasLoaded,
} from './contributionsLandingActions';
import { type State } from './contributionsLandingReducer';

// ----- Functions ----- //

function selectDefaultPaymentMethod(state: State, dispatch: Dispatch<Action>) {
  const { contributionType } = state.page.form;
  const { countryId } = state.common.internationalisation;
  const { switches } = state.common.settings;

  const paymentMethodToSelect = getPaymentMethodToSelect(contributionType, switches, countryId);

  dispatch(updatePaymentMethod(paymentMethodToSelect));
}

function initialiseStripeCheckout(onPaymentAuthorisation, contributionType, currencyId, isTestUser, dispatch) {
  setupStripeCheckout(onPaymentAuthorisation, contributionType, currencyId, isTestUser)
    .then((handler: ThirdPartyPaymentLibrary) =>
      dispatch(setThirdPartyPaymentLibrary({ [contributionType]: { Stripe: handler } })));
}

function initialisePaymentMethods(state: State, dispatch: Function) {
  const { countryId, currencyId } = state.common.internationalisation;
  const { switches } = state.common.settings;
  const { isTestUser } = state.page.user;

  const onPaymentAuthorisation = (paymentAuthorisation: PaymentAuthorisation) => {
    dispatch(paymentWaiting(true));
    dispatch(onThirdPartyPaymentAuthorised(paymentAuthorisation));
  };

  ['ONE_OFF', 'ANNUAL', 'MONTHLY'].forEach((contribType) => {
    const validPayments = getValidPaymentMethods(contribType, switches, countryId);
    if (validPayments.includes('Stripe')) {
      initialiseStripeCheckout(onPaymentAuthorisation, contribType, currencyId, !!isTestUser, dispatch);
    }
  });

  loadPayPalRecurring().then(() => dispatch(setPayPalHasLoaded()));
}

const init = (store: Store<State, Action, Dispatch<Action>>) => {
  const { dispatch } = store;

  const state = store.getState();
  selectDefaultPaymentMethod(state, dispatch);
  initialisePaymentMethods(state, dispatch);

  const { firstName, lastName, email } = state.page.user;
  dispatch(updateUserFormData({ firstName, lastName, email }));

};


// ----- Exports ----- //

export { init };
