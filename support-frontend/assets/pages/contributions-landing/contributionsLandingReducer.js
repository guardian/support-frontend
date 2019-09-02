// @flow

// ----- Imports ----- //

import { type ErrorReason } from 'helpers/errorReasons';
import { combineReducers } from 'redux';
import { type ContributionType, type ThirdPartyPaymentLibraries } from 'helpers/contributions';
import csrf from 'helpers/csrf/csrfReducer';
import { type CommonState } from 'helpers/page/commonReducer';
import { type UsState, type CaState } from 'helpers/internationalisation/country';
import { createUserReducer, type User as UserState } from 'helpers/user/userReducer';
import { type DirectDebitState } from 'components/directDebit/directDebitReducer';
import { directDebitReducer as directDebit } from 'components/directDebit/directDebitReducer';
import type { StripePaymentMethod } from 'helpers/paymentIntegrations/readerRevenueApis';
import type { OtherAmounts, SelectedAmounts } from 'helpers/contributions';
import { type Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { getContributionTypeFromSession } from 'helpers/checkouts';
import * as storage from 'helpers/storage';
import { type UserTypeFromIdentityResponse } from 'helpers/identityApis';

import { type Action } from './contributionsLandingActions';
import { type State as MarketingConsentState } from '../../components/marketingConsent/marketingConsentReducer';
import { marketingConsentReducerFor } from '../../components/marketingConsent/marketingConsentReducer';
import type { PaymentMethod } from 'helpers/paymentMethods';
import type { RecentlySignedInExistingPaymentMethod } from '../../helpers/existingPaymentMethods/existingPaymentMethods';

// ----- Types ----- //

export type UserFormData = {
  firstName: string | null,
  lastName: string | null,
  email: string | null,
  state: string | null,
}

export type ThankYouPageStageMap<T> = {
  thankYouSetPassword: T,
  thankYou: T,
  thankYouPasswordSet: T,
  thankYouPasswordDeclinedToSet: T,
}

export type ThankYouPageStage = $Keys<ThankYouPageStageMap<null>>

type FormData = UserFormData & {
  otherAmounts: OtherAmounts,
  state: UsState | CaState | null,
  checkoutFormHasBeenSubmitted: boolean,
};

type SetPasswordData = {
  password: string,
  passwordHasBeenSubmitted: boolean,
  passwordError: boolean,
}

type StripePaymentRequestButtonData = {
  paymentMethod: 'none' | StripePaymentMethod | null,
  stripePaymentRequestObject: Object | null,
  stripePaymentRequestButtonClicked: boolean,
}

export type Stripe3DSResult = {
  error?: Object,
  paymentIntent: {
    id: string,
  }
}

export type StripeCardFormData = {
  formComplete: boolean,
  // These callbacks must be initialised after the StripeCardForm component has been created
  createPaymentMethod: ((email: string) => void) | null,
  handle3DS: ((clientSecret: string) => Promise<Stripe3DSResult>) | null,
}

type FormState = {
  contributionType: ContributionType,
  paymentMethod: PaymentMethod,
  existingPaymentMethod?: RecentlySignedInExistingPaymentMethod,
  thirdPartyPaymentLibraries: ThirdPartyPaymentLibraries,
  selectedAmounts: SelectedAmounts,
  isWaiting: boolean,
  formData: FormData,
  stripeV3HasLoaded: boolean,
  stripePaymentRequestButtonData: StripePaymentRequestButtonData,
  stripeCardFormData: StripeCardFormData,
  setPasswordData: SetPasswordData,
  paymentComplete: boolean,
  paymentError: ErrorReason | null,
  guestAccountCreationToken: ?string,
  thankYouPageStage: ThankYouPageStage,
  hasSeenDirectDebitThankYouCopy: boolean,
  payPalHasLoaded: boolean,
  userTypeFromIdentityResponse: UserTypeFromIdentityResponse,
  formIsValid: boolean,
  formIsSubmittable: boolean,
  tickerGoalReached: boolean,
};

type PageState = {
  form: FormState,
  user: UserState,
  csrf: CsrfState,
  directDebit: DirectDebitState,
  marketingConsent: MarketingConsentState,
};

export type State = {
  common: CommonState,
  page: PageState,
};

// ----- Functions ----- //

function createFormReducer() {

  // ----- Initial state ----- //

  const initialState: FormState = {
    contributionType: getContributionTypeFromSession() || 'MONTHLY',
    paymentMethod: 'None',
    thirdPartyPaymentLibraries: {
      ONE_OFF: {
        Stripe: null,
      },
      MONTHLY: {
        Stripe: null,
        PayPal: null,
      },
      ANNUAL: {
        Stripe: null,
        PayPal: null,
      },
    },
    formData: {
      firstName: null,
      lastName: null,
      email: storage.getSession('gu.email') || null,
      otherAmounts: {
        ONE_OFF: { amount: null },
        MONTHLY: { amount: null },
        ANNUAL: { amount: null },
      },
      state: null,
      checkoutFormHasBeenSubmitted: false,
    },
    stripeV3HasLoaded: false,
    stripePaymentRequestButtonData: {
      paymentMethod: null,
      stripePaymentRequestObject: null,
      stripePaymentRequestButtonClicked: false,
    },
    stripeCardFormData: {
      formComplete: false,
      createPaymentMethod: null,
      handle3DS: null,
    },
    setPasswordData: {
      password: '',
      passwordHasBeenSubmitted: false,
      passwordError: false,
    },
    showOtherAmount: false,
    selectedAmounts: {},
    isWaiting: false,
    paymentComplete: false,
    paymentError: null,
    guestAccountCreationToken: null,
    thankYouPageStage: 'thankYou',
    payPalHasLoaded: false,
    hasSeenDirectDebitThankYouCopy: false,
    userTypeFromIdentityResponse: 'noRequestSent',
    formIsValid: true,
    formIsSubmittable: true,
    tickerGoalReached: false,
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

      case 'UPDATE_SELECTED_EXISTING_PAYMENT_METHOD':
        return { ...state, existingPaymentMethod: action.existingPaymentMethod };

      case 'UPDATE_PAYMENT_READY':
        return {
          ...state,
          thirdPartyPaymentLibraries: {
            ONE_OFF: {
              ...state.thirdPartyPaymentLibraries.ONE_OFF,
              ...action.thirdPartyPaymentLibraryByContrib.ONE_OFF,
            },
            MONTHLY: {
              ...state.thirdPartyPaymentLibraries.MONTHLY,
              ...action.thirdPartyPaymentLibraryByContrib.MONTHLY,
            },
            ANNUAL: {
              ...state.thirdPartyPaymentLibraries.ANNUAL,
              ...action.thirdPartyPaymentLibraryByContrib.ANNUAL,
            },
          },
        };

      case 'SET_CREATE_STRIPE_PAYMENT_METHOD':
        return {
          ...state,
          stripeCardFormData: {
            ...state.stripeCardFormData,
            createPaymentMethod: action.createStripePaymentMethod,
          },
        };

      case 'SET_HANDLE_STRIPE_3DS':
        return {
          ...state,
          stripeCardFormData: {
            ...state.stripeCardFormData,
            handle3DS: action.handleStripe3DS,
          },
        };

      case 'SET_STRIPE_CARD_FORM_COMPLETE':
        return {
          ...state,
          stripeCardFormData: {
            ...state.stripeCardFormData,
            formComplete: action.isComplete,
          },
        };

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

      case 'SET_PASSWORD_ERROR':
        return { ...state, setPasswordData: { ...state.setPasswordData, passwordError: action.passwordError } };

      case 'SET_USER_TYPE_FROM_IDENTITY_RESPONSE':
        return { ...state, userTypeFromIdentityResponse: action.userTypeFromIdentityResponse };

      case 'UPDATE_STATE':
        return { ...state, formData: { ...state.formData, state: action.state } };

      case 'SET_PAYMENT_REQUEST_BUTTON_PAYMENT_METHOD':
        return {
          ...state,
          stripePaymentRequestButtonData: {
            ...state.stripePaymentRequestButtonData,
            paymentMethod: action.paymentMethod,
          },
        };

      case 'SET_STRIPE_PAYMENT_REQUEST_OBJECT':
        return {
          ...state,
          stripePaymentRequestButtonData: {
            ...state.stripePaymentRequestButtonData,
            stripePaymentRequestObject: action.stripePaymentRequestObject,
          },
        };

      case 'SET_STRIPE_PAYMENT_REQUEST_BUTTON_CLICKED':
        return {
          ...state,
          stripePaymentRequestButtonData: {
            ...state.stripePaymentRequestButtonData,
            stripePaymentRequestButtonClicked: true,
          },
        };


      case 'SET_STRIPE_V3_HAS_LOADED':
        return {
          ...state,
          stripeV3HasLoaded: true,
        };

      case 'UPDATE_USER_FORM_DATA':
        return { ...state, formData: { ...state.formData, ...action.userFormData } };

      case 'SET_PAYPAL_HAS_LOADED':
        return { ...state, payPalHasLoaded: true };

      case 'SET_TICKER_GOAL_REACHED':
        return { ...state, tickerGoalReached: true };

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
              [action.contributionType]: {
                amount: action.otherAmount,
              },
            },
          },
        };

      case 'PAYMENT_FAILURE':
        return { ...state, paymentComplete: false, paymentError: action.paymentError };

      case 'SET_FORM_IS_VALID':
        return { ...state, formIsValid: action.isValid };

      case 'SET_FORM_IS_SUBMITTABLE':
        return { ...state, formIsSubmittable: action.formIsSubmittable };

      case 'PAYMENT_WAITING':
        return { ...state, paymentComplete: false, isWaiting: action.isWaiting };

      case 'PAYMENT_SUCCESS':
        return { ...state, paymentComplete: true };

      case 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED':
        return { ...state, formData: { ...state.formData, checkoutFormHasBeenSubmitted: true } };

      case 'SET_HAS_SEEN_DIRECT_DEBIT_THANK_YOU_COPY':
        return { ...state, hasSeenDirectDebitThankYouCopy: true };

      case 'SET_GUEST_ACCOUNT_CREATION_TOKEN':
        return { ...state, guestAccountCreationToken: action.guestAccountCreationToken };

      // Don't allow the stage to be set to thankYouSetPassword unless both an email and
      // guest registration token is present
      case 'SET_THANK_YOU_PAGE_STAGE':
        if ((action.thankYouPageStage === 'thankYouSetPassword')
          && (!state.guestAccountCreationToken || !state.formData.email)) {
          return { ...state, thankYouPageStage: 'thankYou' };
        }
        return { ...state, thankYouPageStage: action.thankYouPageStage };

      default:
        return state;
    }
  };
}

function initReducer() {

  return combineReducers({
    form: createFormReducer(),
    user: createUserReducer(),
    directDebit,
    csrf,
    marketingConsent: marketingConsentReducerFor('MARKETING_CONSENT'),
  });
}


// ----- Reducer ----- //

export { initReducer };
