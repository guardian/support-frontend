// @flow

// ----- Imports ----- //
import { type Store, type Dispatch } from 'redux';
import {
  updatePaymentMethod,
  updateUserFormData,
} from './contributionsLandingActions';
import { type State } from './contributionsLandingReducer';
import { type Action, paymentWaiting, onThirdPartyPaymentAuthorised, isPaymentReady } from './contributionsLandingActions';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { setupStripeCheckout } from 'helpers/paymentIntegrations/newPaymentFlow/stripeCheckout';
import { type PaymentHandler, getPaymentMethodToSelect, getValidPaymentMethods } from 'helpers/checkouts';
import { type PaymentMatrix, type Contrib, logInvalidCombination } from 'helpers/contributions';
import { logException,} from 'helpers/logger';
import type {IsoCountry} from "../../helpers/internationalisation/country";



type args = {
  onPaymentAuthorisation: PaymentAuthorisation => void,
  contributionType: Contrib,
  currencyId: IsoCountry,
  isTestUser: boolean,
}

// ----- Functions ----- //


function selectDefaultPaymentMethod(state: State, dispatch: Dispatch<Action>) {
  const { contributionType } = state.page.form;
  const { countryId } = state.common.internationalisation;
  const { switches } = state.common.settings;

  const paymentMethodToSelect = getPaymentMethodToSelect(contributionType, switches, countryId);

  dispatch(updatePaymentMethod(paymentMethodToSelect));
}

function initialisePaymentMethods(state: State, dispatch: Dispatch<Action>) {
  const {countryId} = state.common.internationalisation;
  const {switches} = state.common.settings;
  const {currencyId } = state.common.internationalisation;
  const {isTestUser} = state.page.user;

  const onPaymentAuthorisation = (paymentAuthorisation: PaymentAuthorisation) => {
      dispatch(paymentWaiting(true));
      onThirdPartyPaymentAuthorised(paymentAuthorisation)(dispatch, () => state)
  };

  ['ONE_OFF', 'ANNUAL', 'MONTHLY'].forEach(contribType => {
    getValidPaymentMethods(contribType, switches, countryId).forEach((paymentMethod) => {
      if (paymentMethod == 'Stripe') {
        initialiseStripeCheckout(onPaymentAuthorisation, contribType, currencyId, !!isTestUser, dispatch)
      }
    });
  })
}

// ----- Logic ----- //

function initialiseStripeCheckout(onPaymentAuthorisation, contributionType, currencyId, isTestUser, dispatch) {

  setupStripeCheckout(onPaymentAuthorisation, contributionType, currencyId, isTestUser)
    .then((handler: PaymentHandler) => dispatch(isPaymentReady(true, { [contributionType] : { Stripe: handler } })));
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
