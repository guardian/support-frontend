// @flow

// ----- Imports ----- //
import { type Store } from 'redux';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import { loadPayPalRecurring } from 'helpers/paymentIntegrations/payPalRecurringCheckout';
import { setPayPalHasLoaded } from 'helpers/paymentIntegrations/payPalActions';
import {
  loadStripe,
  setupStripeCheckout,
} from 'helpers/paymentIntegrations/stripeCheckout';
import { setupAmazonPay } from 'helpers/paymentIntegrations/amazonPay';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Switches } from 'helpers/settings';
import { getQueryParameter } from 'helpers/url';
import {
  getContributionTypeFromSession,
  getContributionTypeFromUrl,
  getPaymentMethodFromSession,
  getValidPaymentMethods,
  type ThirdPartyPaymentLibrary,
  getValidContributionTypesFromUrlOrElse,
} from 'helpers/checkouts';
import { type ContributionType, contributionTypeAvailable } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
  type Action,
  checkIfEmailHasPassword,
  onThirdPartyPaymentAuthorised,
  paymentWaiting,
  selectAmount, setGuestAccountCreationToken,
  setThirdPartyPaymentLibrary,
  updateContributionTypeAndPaymentMethod, updatePaymentMethod, updateSelectedExistingPaymentMethod,
  updateUserFormData,
  setThankYouPageStage,
} from './contributionsLandingActions';
import { type State } from './contributionsLandingReducer';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { Stripe } from 'helpers/paymentMethods';
import {
  isUsableExistingPaymentMethod,
  mapExistingPaymentMethodToPaymentMethod, sendGetExistingPaymentMethodsRequest,
} from 'helpers/existingPaymentMethods/existingPaymentMethods';
import type { ExistingPaymentMethod } from 'helpers/existingPaymentMethods/existingPaymentMethods';
import { setExistingPaymentMethods, setContributionTypes } from 'helpers/page/commonActions';
import { doesUserAppearToBeSignedIn } from 'helpers/user/user';
import { isSwitchOn } from 'helpers/globals';
import type { ContributionTypes } from 'helpers/contributions';
import { campaigns, getCampaignName } from 'helpers/campaigns';
import { stripeAccountForContributionType } from 'helpers/paymentIntegrations/stripeCheckout';
import { initRecaptchaV3 } from '../../helpers/recaptcha';

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

function getInitialContributionType(
  countryGroupId: CountryGroupId,
  contributionTypes: ContributionTypes,
): ContributionType {

  const contributionType = getContributionTypeFromUrl() || getContributionTypeFromSession();

  // make sure we don't select a contribution type which isn't on the page
  if (contributionType &&
    contributionTypes[countryGroupId].find(ct => ct.contributionType === contributionType)) {
    return contributionType;
  }

  const defaultContributionType = contributionTypes[countryGroupId].find(ct => ct.isDefault);
  return defaultContributionType ?
    defaultContributionType.contributionType :
    contributionTypes[countryGroupId][0].contributionType;
}

// Stripe checkout is currently still used by the Payment Request button only
function initialiseStripeCheckout(
  onPaymentAuthorisation: (paymentAuthorisation: PaymentAuthorisation) => void,
  contributionType: ContributionType,
  currencyId: IsoCurrency,
  countryId: IsoCountry,
  isTestUser: boolean,
  dispatch: Function,
) {
  const library: ThirdPartyPaymentLibrary =
    setupStripeCheckout(
      onPaymentAuthorisation,
      stripeAccountForContributionType[contributionType],
      currencyId,
      countryId,
      isTestUser,
    );

  dispatch(setThirdPartyPaymentLibrary({ [contributionType]: { Stripe: library } }));
}


function initialisePaymentMethods(
  state: State,
  dispatch: Function,
  contributionTypes: ContributionTypes,
) {

  const { countryId, currencyId, countryGroupId } = state.common.internationalisation;
  const { switches } = state.common.settings;
  const isTestUser = !!state.page.user.isTestUser;

  const onPaymentAuthorisation = (paymentAuthorisation: PaymentAuthorisation) => {
    dispatch(paymentWaiting(true));
    dispatch(onThirdPartyPaymentAuthorised(paymentAuthorisation));
  };


  if (getQueryParameter('stripe-checkout-js') !== 'no') {
    loadStripe().then(() => {
      contributionTypes[countryGroupId].forEach((contributionTypeSetting) => {
        const validPayments = getValidPaymentMethods(
          contributionTypeSetting.contributionType,
          switches,
          countryId,
        );
        // Stripe Payment Intents is currently only for one-offs, so always initialise Stripe Checkout for now
        if (validPayments.includes(Stripe)) {
          initialiseStripeCheckout(
            onPaymentAuthorisation,
            contributionTypeSetting.contributionType,
            currencyId,
            countryId,
            isTestUser,
            dispatch,
          );
        }
      });
    });

    setupAmazonPay(countryGroupId, dispatch, isTestUser);

    // initiate fetch of existing payment methods
    const userAppearsLoggedIn = doesUserAppearToBeSignedIn();
    const existingDirectDebitON = isSwitchOn('recurringPaymentMethods.existingDirectDebit');
    const existingCardON = isSwitchOn('recurringPaymentMethods.existingCard');
    const existingPaymentsEnabledViaUrlParam = getQueryParameter('displayExistingPaymentOptions') === 'true';
    if (userAppearsLoggedIn && (existingCardON || existingDirectDebitON) && existingPaymentsEnabledViaUrlParam) {
      sendGetExistingPaymentMethodsRequest(
        currencyId,
        (allExistingPaymentMethods: ExistingPaymentMethod[]) => {
          const switchedOnExistingPaymentMethods = allExistingPaymentMethods.filter(existingPaymentMethod => (
            (existingPaymentMethod.paymentType === 'Card' && existingCardON) ||
            (existingPaymentMethod.paymentType === 'DirectDebit' && existingDirectDebitON)
          ));
          dispatch(setExistingPaymentMethods(switchedOnExistingPaymentMethods));
          const firstExistingPaymentMethod = (switchedOnExistingPaymentMethods[0]: any);
          if (firstExistingPaymentMethod && isUsableExistingPaymentMethod(firstExistingPaymentMethod)) {
            dispatch(updatePaymentMethod(mapExistingPaymentMethodToPaymentMethod(firstExistingPaymentMethod)));
            dispatch(updateSelectedExistingPaymentMethod(firstExistingPaymentMethod));
          }
        },
      );
    } else {
      dispatch(setExistingPaymentMethods([]));
    }
  }

  const recurringContributionsAvailable = contributionTypeAvailable('MONTHLY', countryGroupId, contributionTypes)
    || contributionTypeAvailable('ANNUAL', countryGroupId, contributionTypes);

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

// Override the settings from the server if contributionTypes are defined in url params or campaign settings
function getContributionTypes(state: State): ContributionTypes {
  const campaignName = getCampaignName();
  if (campaignName && campaigns[campaignName] && campaigns[campaignName].contributionTypes) {
    return campaigns[campaignName].contributionTypes;
  }

  return getValidContributionTypesFromUrlOrElse(state.common.settings.contributionTypes);
}

function selectInitialContributionTypeAndPaymentMethod(
  state: State,
  dispatch: Function,
  contributionTypes: ContributionTypes,
) {

  const { countryId } = state.common.internationalisation;
  const { switches } = state.common.settings;
  const { countryGroupId } = state.common.internationalisation;
  const contributionType = getInitialContributionType(countryGroupId, contributionTypes);
  const paymentMethod = getInitialPaymentMethod(contributionType, countryId, switches);
  dispatch(updateContributionTypeAndPaymentMethod(contributionType, paymentMethod));
}

const init = (store: Store<State, Action, Function>) => {
  const { dispatch } = store;

  const state = store.getState();

  // TODO - move these settings out of the redux store, as they only change once, upon initialisation
  const contributionTypes = getContributionTypes(state);
  dispatch(setContributionTypes(contributionTypes));

  initialisePaymentMethods(state, dispatch, contributionTypes);

  // This will be in window.guardian if it has come from a PayPal one-off contribution,
  // where it is returned by the Payment API to the backend, flashed into the session to preserve
  // it through a serverside redirect, and then written into window.guardian on the thank-you page.
  if (window.guardian.guestAccountCreationToken) {
    dispatch(setGuestAccountCreationToken(window.guardian.guestAccountCreationToken));
    dispatch(setThankYouPageStage('thankYouSetPassword'));
  }

  selectInitialAmounts(state, dispatch);
  selectInitialContributionTypeAndPaymentMethod(state, dispatch, contributionTypes);

  const {
    firstName,
    lastName,
    email,
    stateField,
  } = state.page.user;

  dispatch(checkIfEmailHasPassword(email));
  dispatch(updateUserFormData({
    firstName, lastName, email, state: stateField,
  }));

  //  Initialise Recaptcha V3
  initRecaptchaV3();
};


// ----- Exports ----- //

export { init };
