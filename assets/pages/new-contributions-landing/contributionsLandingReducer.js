// @flow

// ----- Imports ----- //

import type { CheckoutFailureReason } from 'helpers/checkoutErrors';
import { combineReducers } from 'redux';
import { type PaymentHandler } from 'helpers/checkouts';
import { amounts, type Amount, type Contrib, type PaymentMethod } from 'helpers/contributions';
import csrf from 'helpers/csrf/csrfReducer';
import sessionId from 'helpers/sessionId/reducer';
import { type CommonState } from 'helpers/page/page';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type UsState, type CaState } from 'helpers/internationalisation/country';
import { createUserReducer, type User as UserState } from 'helpers/user/userReducer';
import type { DirectDebitState } from 'components/directDebit/directDebitReducer';
import { directDebitReducer as directDebit } from 'components/directDebit/directDebitReducer';
import { type Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { type SessionId as SessionIdState } from 'helpers/sessionId/reducer';

import { type Action } from './contributionsLandingActions';

// ----- Types ----- //

export type UserFormData = {
  firstName: string | null,
  lastName: string | null,
  email: string | null,
}

export type ThankYouPageStageMap<T> = {
  setPassword: T,
  thankYou: T,
  thankYouPasswordSet: T,
  thankYouPasswordNotSet: T
}

export type ThankYouPageStage = $Keys<ThankYouPageStageMap<null>>

type FormData = UserFormData & {
  otherAmounts: {
    [Contrib]: { amount: string | null }
  },
  state: UsState | CaState | null,
  checkoutFormHasBeenSubmitted: boolean,
};

type SetPasswordData = {
  password: string,
  passwordHasBeenSubmitted: boolean,
}

type FormState = {
  contributionType: Contrib,
  paymentMethod: PaymentMethod,
  paymentReady: boolean,
  paymentHandlers: {
    [PaymentMethod]: PaymentHandler | null
  },
  selectedAmounts: { [Contrib]: Amount | 'other' },
  isWaiting: boolean,
  formData: FormData,
  setPasswordData: SetPasswordData,
  paymentComplete: boolean,
  paymentError: CheckoutFailureReason | null,
  guestAccountCreationToken: ?string,
  thankYouPageStage: ThankYouPageStage,
  payPalHasLoaded: boolean,
};

type PageState = {
  form: FormState,
  user: UserState,
  csrf: CsrfState,
  directDebit: DirectDebitState,
  sessionId: SessionIdState,
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
    paymentMethod: 'None',
    paymentHandlers: {
      Stripe: null,
      DirectDebit: null,
      PayPal: null,
      None: null,
    },
    paymentReady: false,
    formData: {
      firstName: null,
      lastName: null,
      email: null,
      otherAmounts: {
        ONE_OFF: { amount: null },
        MONTHLY: { amount: null },
        ANNUAL: { amount: null },
      },
      state: null,
      checkoutFormHasBeenSubmitted: false,
    },
    setPasswordData: {
      password: '',
      passwordHasBeenSubmitted: false,
    },
    showOtherAmount: false,
    selectedAmounts: initialAmount,
    isWaiting: false,
    paymentComplete: false,
    paymentError: null,
    guestAccountCreationToken: null,
    thankYouPageStage: 'thankYou',
    payPalHasLoaded: false,
  };

  return function formReducer(state: FormState = initialState, action: Action): FormState {
    switch (action.type) {
      case 'UPDATE_CONTRIBUTION_TYPE':
        return {
          ...state,
          contributionType: action.contributionType,
          showOtherAmount: false,
          paymentMethod: action.paymentMethodToSelect,
          formData: { ...state.formData },
        };

      case 'UPDATE_PAYMENT_METHOD':
        return { ...state, paymentMethod: action.paymentMethod };

      case 'UPDATE_PAYMENT_READY':
        return action.paymentHandlers
          ? {
            ...state,
            paymentReady: action.paymentReady,
            paymentHandlers: { ...state.paymentHandlers, ...action.paymentHandlers },
          }
          : { ...state, paymentReady: action.paymentReady };

      case 'UPDATE_FIRST_NAME':
        return { ...state, formData: { ...state.formData, firstName: action.firstName } };

      case 'UPDATE_LAST_NAME':
        return { ...state, formData: { ...state.formData, lastName: action.lastName } };

      case 'UPDATE_EMAIL':
        return { ...state, formData: { ...state.formData, email: action.email } };

      case 'UPDATE_PASSWORD':
        return { ...state, setPasswordData: { ...state.setPasswordData, password: action.password } };

      case 'SET_PASSWORD_HAS_BEEN_SUBMITTED':
        return { ...state, setPasswordData: { ...state.setPasswordData, passwordHasBeenSubmitted: true } };

      case 'UPDATE_STATE':
        return { ...state, formData: { ...state.formData, state: action.state } };

      case 'UPDATE_USER_FORM_DATA':
        return { ...state, formData: { ...state.formData, ...action.userFormData } };

      case 'SET_PAYPAL_HAS_LOADED':
        return { ...state, payPalHasLoaded: true };


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
              },
            },
          },
        };

      case 'PAYMENT_FAILURE':
        return { ...state, paymentComplete: false, paymentError: action.paymentError };

      case 'PAYMENT_WAITING':
        return { ...state, paymentComplete: false, isWaiting: action.isWaiting };

      case 'PAYMENT_SUCCESS':
        return { ...state, paymentComplete: true };

      case 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED':
        return { ...state, formData: { ...state.formData, checkoutFormHasBeenSubmitted: true } };

      case 'SET_GUEST_ACCOUNT_CREATION_TOKEN':
        return { ...state, guestAccountCreationToken: action.guestAccountCreationToken };

      // Don't allow the stage to be set to setPassword unless both an email and
      // guest registration token is present
      case 'SET_THANK_YOU_PAGE_STAGE':
        if ((action.thankYouPageStage === 'setPassword')
          && (!state.guestAccountCreationToken || !state.formData.email)) {
          return { ...state, thankYouPageStage: 'thankYou' };
        }
        return { ...state, thankYouPageStage: action.thankYouPageStage };

      default:
        return state;
    }
  };
}

function initReducer(countryGroupId: CountryGroupId) {

  return combineReducers({
    form: createFormReducer(countryGroupId),
    user: createUserReducer(countryGroupId),
    directDebit,
    csrf,
    sessionId,
  });
}


// ----- Reducer ----- //

export { initReducer };
