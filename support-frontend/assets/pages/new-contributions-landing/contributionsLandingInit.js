// @flow

import { getUserFromIdentity } from 'helpers/identityApis';
import { setUserStateActions } from 'pages/new-contributions-landing/setUserStateActions';
// ----- Imports ----- //
import { type Store } from 'redux';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import { loadPayPalRecurring } from 'helpers/paymentIntegrations/payPalRecurringCheckout';
import { setPayPalHasLoaded } from 'helpers/paymentIntegrations/payPalActions';
import {
  loadStripe,
  setupStripeCheckout,
  type StripeAccount,
} from 'helpers/paymentIntegrations/stripeCheckout';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Switches } from 'helpers/settings';
import { getQueryParameter } from 'helpers/url';
import {
  getContributionTypeFromSessionOrElse,
  getContributionTypeFromUrlOrElse,
  getPaymentMethodFromSession,
  getValidContributionTypes,
  getValidPaymentMethods,
  type ThirdPartyPaymentLibrary,
} from 'helpers/checkouts';
import { type ContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
  type Action,
  checkIfEmailHasPassword,
  onThirdPartyPaymentAuthorised,
  paymentWaiting,
  selectAmount,
  setThirdPartyPaymentLibrary,
  updateContributionTypeAndPaymentMethod,
  updateUserFormData,
} from './contributionsLandingActions';
import { type State } from './contributionsLandingReducer';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { Stripe } from 'helpers/paymentMethods';

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

function getInitialContributionType(countryGroupId: CountryGroupId): ContributionType {
  const contributionType = getContributionTypeFromUrlOrElse(getContributionTypeFromSessionOrElse('ANNUAL'));
  return (
    // make sure we don't select a contribution type which isn't on the page
    getValidContributionTypes(countryGroupId).includes(contributionType)
      ? contributionType
      : getValidContributionTypes(countryGroupId)[0]
  );
}

const stripeAccountForContributionType: {[ContributionType]: StripeAccount } = {
  ONE_OFF: 'ONE_OFF',
  MONTHLY: 'REGULAR',
  ANNUAL: 'REGULAR',
};


function initialiseStripeCheckout(
  onPaymentAuthorisation: (paymentAuthorisation: PaymentAuthorisation) => void,
  contributionType: ContributionType,
  currencyId: IsoCurrency,
  isTestUser: boolean,
  dispatch: Function,
) {
  const library: ThirdPartyPaymentLibrary =
    setupStripeCheckout(
      onPaymentAuthorisation,
      stripeAccountForContributionType[contributionType],
      currencyId,
      isTestUser,
    );
  dispatch(setThirdPartyPaymentLibrary({ [contributionType]: { Stripe: library } }));
}


function initialisePaymentMethods(state: State, dispatch: Function) {
  const { countryId, currencyId, countryGroupId } = state.common.internationalisation;
  const { switches } = state.common.settings;
  const { isTestUser } = state.page.user;

  const onPaymentAuthorisation = (paymentAuthorisation: PaymentAuthorisation) => {
    dispatch(paymentWaiting(true));
    dispatch(onThirdPartyPaymentAuthorised(paymentAuthorisation));
  };

  const contributionTypes = getValidContributionTypes(countryGroupId);

  if (getQueryParameter('stripe-checkout-js') !== 'no') {
    loadStripe().then(() => {
      contributionTypes.forEach((contribType) => {
        const validPayments = getValidPaymentMethods(contribType, switches, countryId);
        if (validPayments.includes(Stripe)) {
          initialiseStripeCheckout(
            onPaymentAuthorisation,
            contribType,
            currencyId,
            !!isTestUser,
            dispatch,
          );
        }
      });
    });
  }

  const recurringContributionsAvailable = contributionTypes.includes('MONTHLY')
    || contributionTypes.includes('ANNUAL');

  if (getQueryParameter('paypal-js') !== 'no' && recurringContributionsAvailable) {
    loadPayPalRecurring().then(() => dispatch(setPayPalHasLoaded()));
  }
}

function selectInitialAmounts(state: State, dispatch: Function) {
  const { amounts } = state.common.settings;
  const { countryGroupId } = state.common.internationalisation;

  Object.keys(amounts[countryGroupId]).forEach((contributionType) => {
    const defaultAmount =
      amounts[countryGroupId][contributionType].find(amount => amount.isDefault) ||
      amounts[countryGroupId][contributionType][0];

    dispatch(selectAmount(defaultAmount, contributionType));
  });
}

function selectInitialContributionTypeAndPaymentMethod(state: State, dispatch: Function) {
  const { countryId } = state.common.internationalisation;
  const { switches } = state.common.settings;
  const { countryGroupId } = state.common.internationalisation;
  const contributionType = getInitialContributionType(countryGroupId);
  const paymentMethod = getInitialPaymentMethod(contributionType, countryId, switches);
  dispatch(updateContributionTypeAndPaymentMethod(contributionType, paymentMethod));
}

const {
  setId,
  setIsSignedIn,
  setDisplayName,
  setFirstName,
  setLastName,
  setEmail,
} = setUserStateActions;

function autofillUserDetails(dispatch: Function) {
  getUserFromIdentity().then(data => {
    if (data) {
      if (data.id) {
        dispatch(setIsSignedIn(true));
        dispatch(setId(data.id));
      }
      if (data.privateFields && data.privateFields.firstName) {
        dispatch(setFirstName(data.privateFields.firstName));
      }
      if (data.privateFields && data.privateFields.secondName) {
        dispatch(setLastName(data.privateFields.secondName));
      }
      if (data.primaryEmailAddress) {
        dispatch(setEmail(data.primaryEmailAddress));
      }
      if (data.publicFields && data.publicFields.displayName) {
        dispatch(setDisplayName(data.publicFields.displayName));
      }
    }
  });
}

const init = (store: Store<State, Action, Function>) => {
  const { dispatch } = store;

  const state = store.getState();
  autofillUserDetails(dispatch);
  initialisePaymentMethods(state, dispatch);

  selectInitialAmounts(state, dispatch);
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
