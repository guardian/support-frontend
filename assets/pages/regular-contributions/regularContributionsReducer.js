// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';

import type { User as UserState } from 'helpers/user/userReducer';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { DirectDebitState } from 'components/directDebit/directDebitReducer';
import { createUserReducer } from 'helpers/user/userReducer';
import { directDebitReducer as directDebit } from 'components/directDebit/directDebitReducer';
import { marketingConsentReducerFor } from 'components/marketingConsent/marketingConsentReducer';
import csrf from 'helpers/csrf/csrfReducer';
import type { CommonState } from 'helpers/page/commonReducer';
import type { PaymentMethod } from 'helpers/contributions';
import type { ErrorReason } from 'helpers/errorReasons';
import { type RegularContributionType } from 'helpers/contributions';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import type { State as MarketingConsentState } from 'components/marketingConsent/marketingConsentReducer';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { checkoutFormReducer as checkoutForm, type RegularContributionsCheckoutFormState } from './helpers/checkoutForm/checkoutFormReducer';
import type { Action } from './regularContributionsActions';
import type { PaymentStatus } from './components/regularContributionsPayment';


// ----- Types ----- //

type RegularContributionsState = {
  amount: number,
  contributionType: RegularContributionType,
  errorReason: ?ErrorReason,
  paymentStatus: PaymentStatus,
  paymentMethod: ?PaymentMethod,
  payPalHasLoaded: boolean,
  statusUri: ?string,
  pollCount: number,
  guestAccountCreationToken: ?string,
  userTypeFromIdentityResponse: UserTypeFromIdentityResponse,
};

type PageState = {
  regularContrib: RegularContributionsState,
  user: UserState,
  csrf: CsrfState,
  directDebit: DirectDebitState,
  checkoutForm: RegularContributionsCheckoutFormState,
  marketingConsent: MarketingConsentState,
};

export type State = {
  common: CommonState,
  page: PageState,
};


// ----- Reducers ----- //

function createRegularContributionsReducer(
  amount: number,
  paymentMethod: ?PaymentMethod,
  contributionType: RegularContributionType,
) {

  const initialState: RegularContributionsState = {
    amount,
    contributionType,
    errorReason: null,
    paymentStatus: 'NotStarted',
    paymentMethod,
    payPalHasLoaded: false,
    statusUri: null,
    pollCount: 0,
    guestAccountCreationToken: null,
    userTypeFromIdentityResponse: 'noRequestSent',
  };

  return function regularContributionsReducer(
    state: RegularContributionsState = initialState,
    action: Action,
  ): RegularContributionsState {

    switch (action.type) {

      case 'CHECKOUT_PENDING':
        return { ...state, paymentStatus: 'PollingTimedOut', paymentMethod: action.paymentMethod };

      case 'CHECKOUT_SUCCESS':
        return { ...state, paymentStatus: 'Success', paymentMethod: action.paymentMethod };

      case 'CHECKOUT_ERROR':
        return { ...state, paymentStatus: 'Failed', errorReason: action.errorReason };

      case 'CREATING_CONTRIBUTOR':
        return { ...state, paymentStatus: 'Pending' };

      case 'SET_PAYPAL_HAS_LOADED':
        return { ...state, payPalHasLoaded: true };

      case 'SET_GUEST_ACCOUNT_CREATION_TOKEN':
        return { ...state, guestAccountCreationToken: action.guestAccountCreationToken };

      case 'SET_USER_TYPE_FROM_IDENTITY_RESPONSE':
        return { ...state, userTypeFromIdentityResponse: action.userTypeFromIdentityResponse };

      default:
        return state;

    }
  };
}


// ----- Exports ----- //

export default function createRootRegularContributionsReducer(
  amount: number,
  paymentMethod: ?PaymentMethod,
  contributionType: RegularContributionType,
  countryGroup: CountryGroupId,
) {
  return combineReducers({
    regularContrib: createRegularContributionsReducer(amount, paymentMethod, contributionType),
    marketingConsent: marketingConsentReducerFor('CONTRIBUTIONS_THANK_YOU'),
    user: createUserReducer(countryGroup),
    csrf,
    directDebit,
    checkoutForm,
  });
}
