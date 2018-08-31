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
import { type RegularContributionType } from 'helpers/contributions';
import type { State as MarketingConsentState } from 'components/marketingConsent/marketingConsentReducer';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { checkoutFormReducer as checkoutForm, type RegularContributionsCheckoutFormState } from './components/contributionsCheckoutContainer/checkoutFormReducer';
import type { Action } from './regularContributionsActions';
import type { PaymentStatus } from './components/regularContributionsPayment';


// ----- Types ----- //

export type RegularContributionsState = {
  amount: number,
  contributionType: RegularContributionType,
  error: ?string,
  paymentStatus: PaymentStatus,
  paymentMethod: ?PaymentMethod,
  payPalHasLoaded: boolean,
  statusUri: ?string,
  pollCount: number,
};

export type PageState = {
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
    error: null,
    paymentStatus: 'NotStarted',
    paymentMethod,
    payPalHasLoaded: false,
    statusUri: null,
    pollCount: 0,
  };

  return function regularContributionsReducer(
    state: RegularContributionsState = initialState,
    action: Action,
  ): RegularContributionsState {

    switch (action.type) {

      case 'CHECKOUT_PENDING':
        return Object.assign({}, state, { paymentStatus: 'PollingTimedOut', paymentMethod: action.paymentMethod });

      case 'CHECKOUT_SUCCESS':
        return Object.assign({}, state, { paymentStatus: 'Success', paymentMethod: action.paymentMethod });

      case 'CHECKOUT_ERROR':
        return Object.assign({}, state, { paymentStatus: 'Failed', error: action.message });

      case 'CREATING_CONTRIBUTOR':
        return Object.assign({}, state, { paymentStatus: 'Pending' });

      case 'SET_PAYPAL_HAS_LOADED':
        return Object.assign({}, state, { payPalHasLoaded: true });

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
