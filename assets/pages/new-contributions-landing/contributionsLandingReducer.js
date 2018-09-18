// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import { type PaymentMethod, type PaymentHandler } from 'helpers/checkouts';
import { amounts, type Amount, type Contrib } from 'helpers/contributions';
import csrf from 'helpers/csrf/csrfReducer';
import { type CommonState } from 'helpers/page/page';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type UsState, type CaState } from 'helpers/internationalisation/country';
import { createUserReducer, type User as UserState } from 'helpers/user/userReducer';
import { type Csrf as CsrfState } from 'helpers/csrf/csrfReducer';

import { type Action } from './contributionsLandingActions';

// ----- Types ----- //

type FormData = {
  firstName: string | null,
  firstNameBlurred: boolean,
  lastName: string | null,
  lastNameBlurred: boolean,
  email: string | null,
  emailBlurred: boolean,
  otherAmounts: {
    [Contrib]: { amount: string | null, blurred: boolean }
  },
  state: UsState | CaState | null,
};

type FormState = {
  contributionType: Contrib,
  paymentMethod: PaymentMethod,
  paymentReady: boolean,
  paymentHandler: {
    [PaymentMethod]: PaymentHandler | null
  },
  selectedAmounts: { [Contrib]: Amount | 'other' },
  isWaiting: boolean,
  formData: FormData,
  done: boolean,
  isDirectDebitPopUpOpen: boolean,
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
    paymentHandler: {
      Stripe: null,
      DirectDebit: null,
      PayPal: null,
    },
    paymentReady: false,
    formData: {
      firstName: null,
      firstNameBlurred: false,
      lastName: null,
      lastNameBlurred: false,
      email: null,
      emailBlurred: false,
      otherAmounts: {
        ONE_OFF: { amount: null, blurred: false },
        MONTHLY: { amount: null, blurred: false },
        ANNUAL: { amount: null, blurred: false },
      },
      state: null,
    },
    showOtherAmount: false,
    selectedAmounts: initialAmount,
    isWaiting: false,
    done: false,
    isDirectDebitPopUpOpen: false,
  };

  return function formReducer(state: FormState = initialState, action: Action): FormState {
    switch (action.type) {
      case 'UPDATE_CONTRIBUTION_TYPE':
        return {
          ...state,
          contributionType: action.contributionType,
          showOtherAmount: false,
          formData: { ...state.formData },
        };

      case 'UPDATE_PAYMENT_METHOD':
        return { ...state, paymentMethod: action.paymentMethod };

      case 'UPDATE_PAYMENT_READY':
        return action.paymentHandler
          ? {
            ...state,
            paymentReady: action.paymentReady,
            paymentHandler: { ...state.paymentHandler, ...action.paymentHandler },
          }
          : { ...state, paymentReady: action.paymentReady };

      case 'UPDATE_FIRST_NAME':
        return { ...state, formData: { ...state.formData, firstName: action.firstName } };

      case 'UPDATE_LAST_NAME':
        return { ...state, formData: { ...state.formData, lastName: action.lastName } };

      case 'UPDATE_EMAIL':
        return { ...state, formData: { ...state.formData, email: action.email } };

      case 'UPDATE_STATE':
        return { ...state, formData: { ...state.formData, state: action.state } };

      case 'UPDATE_BLURRED':
        switch (action.field) {
          case 'otherAmount':
            return {
              ...state,
              formData: {
                ...state.formData,
                otherAmounts: {
                  ...state.formData.otherAmounts,
                  [state.contributionType]: {
                    amount: state.formData.otherAmounts[state.contributionType].amount,
                    blurred: true,
                  },
                },
              },
            };
          case 'email':
            return { ...state, formData: { ...state.formData, emailBlurred: true } };
          case 'lastName':
            return { ...state, formData: { ...state.formData, lastNameBlurred: true } };
          case 'firstName':
          default:
            return { ...state, formData: { ...state.formData, firstNameBlurred: true } };
        }

      case 'SELECT_AMOUNT':
        return {
          ...state,
          selectedAmounts: { ...state.selectedAmounts, [action.contributionType]: action.amount },
        };

      case 'UPDATE_OTHER_AMOUNT':
        return {
          ...state,
          formData: {
            ...state.formData,
            otherAmounts: {
              ...state.formData.otherAmounts,
              [state.contributionType]: {
                amount: action.otherAmount,
                blurred: state.formData.otherAmounts[state.contributionType].blurred,
              },
            },
          },
        };

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
