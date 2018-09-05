// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import { type PaymentMethod } from 'helpers/checkouts';
import { amounts, type Amount, type Contrib } from 'helpers/contributions';
import { type CommonState } from 'helpers/page/page';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { createUserReducer, type User as UserState } from 'helpers/user/userReducer';

import { type Action } from './contributionsLandingActions';

// ----- Types ----- //

type FormState = {
  contributionType: Contrib,
  paymentMethod: PaymentMethod,
  amount: Amount | null,
  showOtherAmount: boolean,
};

type PageState = {
  form: FormState,
  user: UserState,
};

export type State = {
  common: CommonState,
  page: PageState,
};

// ----- Initial state ----- //

// ----- Functions ----- //

function createFormReducer(countryGroupId: CountryGroupId) {
  const initialState: FormState = {
    contributionType: 'ONE_OFF',
    paymentMethod: 'PayPal',
    amount: amounts('notintest').ONE_OFF[countryGroupId][0],
    showOtherAmount: false,
  };

  return function formReducer(state: FormState = initialState, action: Action): FormState {
    switch (action.type) {
      case 'UPDATE_CONTRIBUTION_TYPE':
        return {
          ...state,
          contributionType: action.contributionType,
          amount: amounts('notintest')[action.contributionType][countryGroupId][0],
          showOtherAmount: false,
        };

      case 'UPDATE_PAYMENT_METHOD':
        return { ...state, paymentMethod: action.paymentMethod };

      case 'SELECT_AMOUNT':
        return { ...state, amount: action.amount, showOtherAmount: false };

      case 'SELECT_OTHER_AMOUNT':
        return { ...state, amount: null, showOtherAmount: true };

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
  });
}


// ----- Reducer ----- //

export { initReducer };
