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

type FormData = {
  firstName: string | null,
  lastName: string | null,
  email: string | null,
};

type FormState = {
  contributionType: Contrib,
  paymentMethod: PaymentMethod,
  selectedAmounts: { [Contrib]: Amount | 'other' },
  otherAmount: string | null,
  isWaiting: boolean,
  formData: FormData,
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

// ----- Functions ----- //

function createFormReducer(countryGroupId: CountryGroupId) {
  const amountsForCountry: { [Contrib]: Amount[] } = {
    ONE_OFF: amounts('notintest').ONE_OFF[countryGroupId],
    MONTHLY: amounts('notintest').MONTHLY[countryGroupId],
    ANNUAL: amounts('notintest').ANNUAL[countryGroupId],
  };
  
  const initialAmount: { [Contrib]: Amount | 'other' } = {
    ONE_OFF: amountsForCountry.ONE_OFF.find(amount => amount.isDefault) || amountsForCountry.ONE_OFF[0],
    MONTHLY: amountsForCountry.MONTHLY.find(amount => amount.isDefault) || amountsForCountry.MONTHLY[0],
    ANNUAL: amountsForCountry.ANNUAL.find(amount => amount.isDefault) || amountsForCountry.ANNUAL[0],
  };
  
  // ----- Initial state ----- //
  
  const initialState: FormState = {
    contributionType: 'MONTHLY',
    paymentMethod: 'Stripe',
    formData: {
      firstName: null,
      lastName: null,
      email: null,
    },
    showOtherAmount: false,
    selectedAmounts: initialAmount,
    otherAmount: null,
    isWaiting: false,
    done: false,
  };

  return function formReducer(state: FormState = initialState, action: Action): FormState {
    switch (action.type) {
      case 'UPDATE_CONTRIBUTION_TYPE':
        return {
          ...state,
          contributionType: action.contributionType,
          showOtherAmount: false,
        };

      case 'UPDATE_PAYMENT_METHOD':
        return { ...state, paymentMethod: action.paymentMethod };

      case 'UPDATE_FIRST_NAME':
        console.log('updating first name')
        return { ...state, formData: { ...state.formData, firstName: action.firstName } };
        
        case 'UPDATE_LAST_NAME':
        console.log('updating last name')
        return { ...state, formData: { ...state.formData, lastName: action.lastName } };
        
        case 'UPDATE_EMAIL':
        console.log('updating email')
        return { ...state, formData: { ...state.formData, email: action.email } };

      case 'SELECT_AMOUNT':
        return {
          ...state,
          selectedAmounts: { ...state.selectedAmounts, [action.contributionType]: action.amount },
        };

      case 'UPDATE_OTHER_AMOUNT':
        return { ...state, otherAmount: action.otherAmount };

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
