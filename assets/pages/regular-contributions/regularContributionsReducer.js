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
import type { CommonState } from 'helpers/page/page';
import type { PaymentMethod } from 'helpers/checkouts';
import type { CheckoutFailureReason } from 'helpers/checkoutErrors';
import { type RegularContributionType } from 'helpers/contributions';
import type { State as MarketingConsentState } from 'components/marketingConsent/marketingConsentReducer';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { checkoutFormReducer as checkoutForm, type RegularContributionsCheckoutFormState } from './helpers/checkoutForm/checkoutFormReducer';
import type { Action } from './regularContributionsActions';
import type { PaymentStatus } from './components/regularContributionsPayment';


// ----- Types ----- //

type RegularContributionsState = {
  amount: number,
  contributionType: RegularContributionType,
  checkoutFailureReason: ?CheckoutFailureReason,
  paymentStatus: PaymentStatus,
  paymentMethod: ?PaymentMethod,
  payPalHasLoaded: boolean,
  statusUri: ?string,
  pollCount: number,
  guestAccountCreationToken: ?string,
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
    checkoutFailureReason: null,
    paymentStatus: 'NotStarted',
    paymentMethod,
    payPalHasLoaded: false,
    statusUri: null,
    pollCount: 0,
    guestAccountCreationToken: null,
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
        return { ...state, paymentStatus: 'Failed', checkoutFailureReason: action.checkoutFailureReason };

      case 'CREATING_CONTRIBUTOR':
        return { ...state, paymentStatus: 'Pending' };

      case 'SET_PAYPAL_HAS_LOADED':
        return { ...state, payPalHasLoaded: true };

      case 'SET_GUEST_ACCOUNT_CREATION_TOKEN':
        return { ...state, guestAccountCreationToken: action.guestAccountCreationToken };

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
