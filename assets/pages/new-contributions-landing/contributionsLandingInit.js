// @flow

// ----- Imports ----- //
import { type Store, type Dispatch } from 'redux';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { loadPayPalRecurring } from 'helpers/paymentIntegrations/newPaymentFlow/payPalRecurringCheckout';
import { setupStripeCheckout, loadStripe } from 'helpers/paymentIntegrations/newPaymentFlow/stripeCheckout';
import { type ThirdPartyPaymentLibrary, getValidPaymentMethods, getPaymentMethodFromSession } from 'helpers/checkouts';
import { amounts, type Amount } from 'helpers/contributions';
import {
  type Action,
  paymentWaiting,
  onThirdPartyPaymentAuthorised,
  setThirdPartyPaymentLibrary,
  updatePaymentMethod,
  updateUserFormData,
  setPayPalHasLoaded,
  selectAmount,
  checkIfEmailHasPassword,
} from './contributionsLandingActions';
import { type State } from './contributionsLandingReducer';

// ----- Functions ----- //

function selectDefaultPaymentMethod(state: State, dispatch: Dispatch<Action>) {
  const { contributionType } = state.page.form;
  const { countryId } = state.common.internationalisation;
  const { switches } = state.common.settings;

  const paymentMethodFromSession = getPaymentMethodFromSession();
  const validPaymentMethods = getValidPaymentMethods(contributionType, switches, countryId);

  const paymentMethodToSelect =
    paymentMethodFromSession && validPaymentMethods.includes(getPaymentMethodFromSession())
      ? paymentMethodFromSession
      : validPaymentMethods[0] || 'None';

  dispatch(updatePaymentMethod(paymentMethodToSelect));
}

function initialiseStripeCheckout(onPaymentAuthorisation, contributionType, currencyId, isTestUser, dispatch) {
  const library: ThirdPartyPaymentLibrary =
    setupStripeCheckout(onPaymentAuthorisation, contributionType, currencyId, isTestUser);
  dispatch(setThirdPartyPaymentLibrary({ [contributionType]: { Stripe: library } }));
}

function initialisePaymentMethods(state: State, dispatch: Function) {
  const { countryId, currencyId } = state.common.internationalisation;
  const { switches } = state.common.settings;
  const { isTestUser } = state.page.user;

  const onPaymentAuthorisation = (paymentAuthorisation: PaymentAuthorisation) => {
    dispatch(paymentWaiting(true));
    dispatch(onThirdPartyPaymentAuthorised(paymentAuthorisation));
  };

  loadStripe().then(() => {
    ['ONE_OFF', 'ANNUAL', 'MONTHLY'].forEach((contribType) => {
      const validPayments = getValidPaymentMethods(contribType, switches, countryId);
      if (validPayments.includes('Stripe')) {
        initialiseStripeCheckout(onPaymentAuthorisation, contribType, currencyId, !!isTestUser, dispatch);
      }
    });
  });

  loadPayPalRecurring().then(() => dispatch(setPayPalHasLoaded()));
}

function initialiseSelectedAnnualAmount(state: State, dispatch: Function) {
  const { countryGroupId } = state.common.internationalisation;
  const annualTestVariant = state.common.abParticipations.annualContributionsRoundThree;

  if (annualTestVariant) {
    const annualAmounts: Amount[] = amounts(annualTestVariant).ANNUAL[countryGroupId];

    dispatch(selectAmount(annualAmounts.find(amount => amount.isDefault) || annualAmounts[0], 'ANNUAL'));
  }
}

const init = (store: Store<State, Action, Function>) => {
  const { dispatch } = store;

  const state = store.getState();
  selectDefaultPaymentMethod(state, dispatch);
  initialisePaymentMethods(state, dispatch);
  initialiseSelectedAnnualAmount(state, dispatch);

  const { firstName, lastName, email } = state.page.user;
  dispatch(checkIfEmailHasPassword(email));
  dispatch(updateUserFormData({ firstName, lastName, email }));

};


// ----- Exports ----- //

export { init };
