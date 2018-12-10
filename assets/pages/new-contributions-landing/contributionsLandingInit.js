// @flow

// ----- Imports ----- //
import { type Store } from 'redux';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { loadPayPalRecurring } from 'helpers/paymentIntegrations/newPaymentFlow/payPalRecurringCheckout';
import { setupStripeCheckout, loadStripe } from 'helpers/paymentIntegrations/newPaymentFlow/stripeCheckout';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Switches } from 'helpers/settings';
import {
  type ThirdPartyPaymentLibrary,
  getValidPaymentMethods,
  getPaymentMethodFromSession,
  getValidContributionTypes,
  getContributionTypeFromSessionOrElse,
} from 'helpers/checkouts';
import { type Participations } from 'helpers/abTests/abtest';
import { getUsSingleAmounts } from 'helpers/abTests/helpers/usSingleContributionsAmounts';
import { getAnnualAmounts } from 'helpers/abTests/helpers/annualContributions';
import { type Amount, type PaymentMethod, type ContributionType } from 'helpers/contributions';
import {
  type Action,
  paymentWaiting,
  onThirdPartyPaymentAuthorised,
  setThirdPartyPaymentLibrary,
  updateUserFormData,
  setPayPalHasLoaded,
  selectAmount,
  checkIfEmailHasPassword,
  updateContributionTypeAndPaymentMethod,
} from './contributionsLandingActions';
import { type State } from './contributionsLandingReducer';

// ----- Functions ----- //

function getInitialPaymentMethod(
  contributionType: ContributionType,
  countryId: IsoCountry,
  switches: Switches,
): PaymentMethod {
  const paymentMethodFromSession = getPaymentMethodFromSession();
  const validPaymentMethods = getValidPaymentMethods(contributionType, switches, countryId);

  return (
    paymentMethodFromSession && validPaymentMethods.includes(getPaymentMethodFromSession())
      ? paymentMethodFromSession
      : validPaymentMethods[0] || 'None'
  );
}

function getInitialContributionType(abParticipations: Participations): ContributionType {
  const { usContributionTypes } = abParticipations;
  const abTestParams = usContributionTypes
    ? usContributionTypes.split('_')
    : [];

  let contributionType: ContributionType;
  if (abTestParams.includes('default-annual')) {
    contributionType = getContributionTypeFromSessionOrElse('ANNUAL');
  } else if (abTestParams.includes('default-single')) {
    contributionType = getContributionTypeFromSessionOrElse('ONE_OFF');
  } else {
    contributionType = getContributionTypeFromSessionOrElse('MONTHLY');
  }

  return (
    // make sure we don't select a contribution type which isn't on the page
    getValidContributionTypes(abParticipations).includes(contributionType)
      ? contributionType
      : getValidContributionTypes(abParticipations)[0]
  );
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

function selectInitialAnnualAmount(state: State, dispatch: Function) {
  const { countryGroupId } = state.common.internationalisation;
  const annualTestVariant = state.common.abParticipations.annualContributionsRoundThree;

  if (annualTestVariant) {
    const annualAmounts: Amount[] = getAnnualAmounts(annualTestVariant)[countryGroupId];

    dispatch(selectAmount(annualAmounts.find(amount => amount.isDefault) || annualAmounts[0], 'ANNUAL'));
  }
}

function selectInitialUsSingleAmount(state: State, dispatch: Function) {
  const usSingleContributionAmountsTestVariant = state.common.abParticipations.usSingleContributionsAmounts;

  if (usSingleContributionAmountsTestVariant) {
    const usSingleAmounts: Amount[] = getUsSingleAmounts(usSingleContributionAmountsTestVariant);

    dispatch(selectAmount(usSingleAmounts.find(amount => amount.isDefault) || usSingleAmounts[1], 'ONE_OFF'));
  }
}

function selectInitialContributionTypeAndPaymentMethod(state: State, dispatch: Function) {
  const { abParticipations } = state.common;
  const { countryId } = state.common.internationalisation;
  const { switches } = state.common.settings;

  const contributionType = getInitialContributionType(abParticipations);
  const paymentMethod = getInitialPaymentMethod(contributionType, countryId, switches);

  dispatch(updateContributionTypeAndPaymentMethod(contributionType, paymentMethod));
}

const init = (store: Store<State, Action, Function>) => {
  const { dispatch } = store;

  const state = store.getState();

  initialisePaymentMethods(state, dispatch);

  selectInitialAnnualAmount(state, dispatch);
  selectInitialUsSingleAmount(state, dispatch);
  selectInitialContributionTypeAndPaymentMethod(state, dispatch);

  const {
    firstName,
    lastName,
    email,
  } = state.page.user;

  dispatch(checkIfEmailHasPassword(email));
  dispatch(updateUserFormData({ firstName, lastName, email }));


};


// ----- Exports ----- //

export { init };
