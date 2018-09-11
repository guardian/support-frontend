// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import { type PaymentMethod } from 'helpers/checkouts';
import { amounts, type Amount, type Contrib } from 'helpers/contributions';
import csrf from 'helpers/csrf/csrfReducer';
import { type CommonState } from 'helpers/page/page';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { createUserReducer, type User as UserState } from 'helpers/user/userReducer';
import { type Csrf as CsrfState } from 'helpers/csrf/csrfReducer';

import { type Action } from './contributionsLandingActions';

// ----- Types ----- //

type FormState = {
  contributionType: Contrib,
  paymentMethod: PaymentMethod,
  amount: Amount | null,
  showOtherAmount: boolean,
  isWaiting: boolean,
  done: boolean,
};

type PageState = {
  form: FormState,
  user: UserState,
  csrf: CsrfState,
};

export type State = {
  common: CommonState,
  page: PageState,
};

// ----- Initial state ----- //

// ----- Functions ----- //

function createFormReducer(countryGroupId: CountryGroupId) {
  const oneOffAmounts = amounts('notintest').ONE_OFF[countryGroupId];
  const monthlyAmounts = amounts('notintest').MONTHLY[countryGroupId];
  const annualAmounts = amounts('notintest').ANNUAL[countryGroupId];

  const initialAmount: { [Contrib]: Amount } = {
    ONE_OFF: oneOffAmounts.find(amount => amount.isDefault) || oneOffAmounts[0],
    MONTHLY: monthlyAmounts.find(amount => amount.isDefault) || monthlyAmounts[0],
    ANNUAL: annualAmounts.find(amount => amount.isDefault) || annualAmounts[0],
  };

  const initialState: FormState = {
    contributionType: 'MONTHLY',
    paymentMethod: 'Stripe',
    amount: initialAmount.MONTHLY,
    showOtherAmount: false,
    isWaiting: false,
    done: false,
  };

  return function formReducer(state: FormState = initialState, action: Action): FormState {
    switch (action.type) {
      case 'UPDATE_CONTRIBUTION_TYPE':
        return {
          ...state,
          contributionType: action.contributionType,
          amount: initialAmount[action.contributionType],
          showOtherAmount: false,
        };

      case 'UPDATE_PAYMENT_METHOD':
        return { ...state, paymentMethod: action.paymentMethod };

      case 'SELECT_AMOUNT':
        return { ...state, amount: action.amount, showOtherAmount: false };

      case 'SELECT_OTHER_AMOUNT':
        return { ...state, amount: null, showOtherAmount: true };

      case 'PAYMENT_FAILURE':
        return { ...state, done: false, error: action.error };

      case 'PAYMENT_WAITING':
        return { ...state, done: false, isWaiting: action.isWaiting };

      case 'PAYMENT_SUCCESS':
        return { ...state, done: true };

      default:
        return state;
    }
  };
}

function initReducer(countryGroupId: CountryGroupId) {

  return combineReducers({
    form: createFormReducer(countryGroupId),
    user: createUserReducer(countryGroupId),
    csrf,
  });
}


// ----- Reducer ----- //

export { initReducer };
