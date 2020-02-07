// @flow

// ----- Imports ----- //

import type { ErrorReason } from 'helpers/errorReasons';
import { type ThirdPartyPaymentLibrary } from 'helpers/checkouts';
import {
  type Amount,
  type ContributionType,
  getAmount,
  logInvalidCombination,
  type PaymentMatrix,
} from 'helpers/contributions';
import { getUserTypeFromIdentity, type UserTypeFromIdentityResponse } from 'helpers/identityApis';
import { type CaState, type UsState } from 'helpers/internationalisation/country';
import type {
  RegularPaymentRequest,
  StripeCheckoutAuthorisation, StripePaymentIntentAuthorisation, StripePaymentMethod,
} from 'helpers/paymentIntegrations/readerRevenueApis';
import {
  type AmazonPayAuthorisation,
  type PaymentAuthorisation,
  type PaymentResult,
  type StripePaymentRequestButtonMethod,
  postRegularPaymentRequest,
  regularPaymentFieldsFromAuthorisation,
} from 'helpers/paymentIntegrations/readerRevenueApis';
import type { StripeChargeData, CreateStripePaymentIntentRequest, AmazonPayData } from 'helpers/paymentIntegrations/oneOffContributions';
import {
  type CreatePaypalPaymentData,
  type CreatePayPalPaymentResponse,
  postOneOffPayPalCreatePaymentRequest,
  postOneOffStripeExecutePaymentRequest,
  processStripePaymentIntentRequest,
  postOneOffAmazonPayExecutePaymentRequest,
} from 'helpers/paymentIntegrations/oneOffContributions';
import { routes } from 'helpers/routes';
import * as storage from 'helpers/storage';
import { derivePaymentApiAcquisitionData, getOphanIds, getSupportAbTests } from 'helpers/tracking/acquisitions';
import { logException } from 'helpers/logger';
import trackConversion from 'helpers/tracking/conversions';
import { getForm } from 'helpers/checkoutForm/checkoutForm';
import { type FormSubmitParameters, onFormSubmit } from 'helpers/checkoutForm/onFormSubmit';
import * as cookie from 'helpers/cookie';
import { Annual, Monthly } from 'helpers/billingPeriods';
import type { Action as PayPalAction } from 'helpers/paymentIntegrations/payPalActions';
import { setFormSubmissionDependentValue } from './checkoutFormIsSubmittableActions';
import { type State, type ThankYouPageStage, type UserFormData, type Stripe3DSResult } from './contributionsLandingReducer';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { AmazonPay, DirectDebit, Stripe } from 'helpers/paymentMethods';
import type { RecentlySignedInExistingPaymentMethod } from 'helpers/existingPaymentMethods/existingPaymentMethods';
import { ExistingCard, ExistingDirectDebit } from 'helpers/paymentMethods';
import { getStripeKey, stripeAccountForContributionType, type StripeAccount } from 'helpers/paymentIntegrations/stripeCheckout';
import type { IsoCountry } from '../../helpers/internationalisation/country';

export type Action =
  | { type: 'UPDATE_CONTRIBUTION_TYPE', contributionType: ContributionType }
  | { type: 'UPDATE_PAYMENT_METHOD', paymentMethod: PaymentMethod }
  | { type: 'UPDATE_SELECTED_EXISTING_PAYMENT_METHOD', existingPaymentMethod: RecentlySignedInExistingPaymentMethod }
  | { type: 'UPDATE_FIRST_NAME', firstName: string }
  | { type: 'UPDATE_LAST_NAME', lastName: string }
  | { type: 'UPDATE_EMAIL', email: string }
  | { type: 'UPDATE_PASSWORD', password: string }
  | { type: 'UPDATE_STATE', state: UsState | CaState | null }
  | { type: 'UPDATE_BILLING_COUNTRY', billingCountry: IsoCountry }
  | { type: 'UPDATE_USER_FORM_DATA', userFormData: UserFormData }
  | { type: 'UPDATE_PAYMENT_READY', thirdPartyPaymentLibraryByContrib: { [ContributionType]: { [PaymentMethod]: ThirdPartyPaymentLibrary } } }
  | { type: 'SET_AMAZON_PAY_LOGIN_OBJECT', amazonLoginObject: Object }
  | { type: 'SET_AMAZON_PAY_PAYMENTS_OBJECT', amazonPaymentsObject: Object }
  | { type: 'SET_AMAZON_PAY_WALLET_WIDGET_READY', isReady: boolean }
  | { type: 'SET_AMAZON_PAY_ORDER_REFERENCE_ID', orderReferenceId: string }
  | { type: 'SET_AMAZON_PAY_PAYMENT_SELECTED', paymentSelected: boolean }
  | { type: 'SET_AMAZON_PAY_HAS_ACCESS_TOKEN' }
  | { type: 'SET_AMAZON_PAY_FATAL_ERROR' }
  | { type: 'SELECT_AMOUNT', amount: Amount | 'other', contributionType: ContributionType }
  | { type: 'UPDATE_OTHER_AMOUNT', otherAmount: string, contributionType: ContributionType }
  | { type: 'PAYMENT_RESULT', paymentResult: Promise<PaymentResult> }
  | { type: 'PAYMENT_FAILURE', paymentError: ErrorReason }
  | { type: 'PAYMENT_WAITING', isWaiting: boolean }
  | { type: 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED' }
  | { type: 'SET_PASSWORD_HAS_BEEN_SUBMITTED' }
  | { type: 'SET_PASSWORD_ERROR', passwordError: boolean }
  | { type: 'SET_GUEST_ACCOUNT_CREATION_TOKEN', guestAccountCreationToken: string }
  | { type: 'SET_FORM_IS_SUBMITTABLE', formIsSubmittable: boolean }
  | { type: 'SET_THANK_YOU_PAGE_STAGE', thankYouPageStage: ThankYouPageStage }
  | { type: 'SET_STRIPE_PAYMENT_REQUEST_OBJECT', stripePaymentRequestObject: Object, stripeAccount: StripeAccount }
  | { type: 'SET_PAYMENT_REQUEST_BUTTON_PAYMENT_METHOD', paymentMethod: StripePaymentRequestButtonMethod, stripeAccount: StripeAccount }
  | { type: 'SET_STRIPE_PAYMENT_REQUEST_BUTTON_CLICKED', stripeAccount: StripeAccount }
  | { type: 'SET_STRIPE_PAYMENT_REQUEST_ERROR', paymentError: ErrorReason, stripeAccount: StripeAccount }
  | { type: 'SET_STRIPE_V3_HAS_LOADED' }
  | { type: 'SET_CREATE_STRIPE_PAYMENT_METHOD', createStripePaymentMethod: (email: string) => void }
  | { type: 'SET_HANDLE_STRIPE_3DS', handleStripe3DS: (clientSecret: string) => Promise<Stripe3DSResult> }
  | { type: 'SET_STRIPE_CARD_FORM_COMPLETE', isComplete: boolean }
  | { type: 'SET_STRIPE_SETUP_INTENT_CLIENT_SECRET', setupIntentClientSecret: string }
  | PayPalAction
  | { type: 'SET_HAS_SEEN_DIRECT_DEBIT_THANK_YOU_COPY' }
  | { type: 'PAYMENT_SUCCESS' }
  | { type: 'SET_USER_TYPE_FROM_IDENTITY_RESPONSE', userTypeFromIdentityResponse: UserTypeFromIdentityResponse }
  | { type: 'SET_FORM_IS_VALID', isValid: boolean }
  | { type: 'SET_TICKER_GOAL_REACHED', tickerGoalReached: boolean }

const setFormIsValid = (isValid: boolean): Action => ({ type: 'SET_FORM_IS_VALID', isValid });

// Do not export this, as we only want it to be called via updateContributionTypeAndPaymentMethod
const updateContributionType = (contributionType: ContributionType): ((Function) => void) =>
  (dispatch: Function): void => {
    dispatch(setFormSubmissionDependentValue(() => ({ type: 'UPDATE_CONTRIBUTION_TYPE', contributionType })));
  };

const updatePaymentMethod = (paymentMethod: PaymentMethod): ((Function) => void) =>
  (dispatch: Function): void => {
    // PayPal one-off redirects away from the site before hitting the thank you page
    // so we need to store the payment method in the storage so that it is available on the
    // thank you page in all scenarios.
    storage.setSession('selectedPaymentMethod', paymentMethod);
    dispatch(setFormSubmissionDependentValue(() => ({ type: 'UPDATE_PAYMENT_METHOD', paymentMethod })));
  };

const updateSelectedExistingPaymentMethod = (existingPaymentMethod: RecentlySignedInExistingPaymentMethod): Action =>
  ({ type: 'UPDATE_SELECTED_EXISTING_PAYMENT_METHOD', existingPaymentMethod });

const updateFirstName = (firstName: string): ((Function) => void) =>
  (dispatch: Function): void => {
    dispatch(setFormSubmissionDependentValue(() => ({ type: 'UPDATE_FIRST_NAME', firstName })));
  };

const updateLastName = (lastName: string): ((Function) => void) =>
  (dispatch: Function): void => {
    dispatch(setFormSubmissionDependentValue(() => ({ type: 'UPDATE_LAST_NAME', lastName })));
  };

const updateEmail = (email: string): ((Function) => void) =>
  (dispatch: Function): void => {
    // PayPal one-off redirects away from the site before hitting the thank you page
    // so we need to store the email in the storage so that it is available on the
    // thank you page in all scenarios.
    storage.setSession('gu.email', email);
    dispatch(setFormSubmissionDependentValue(() => ({ type: 'UPDATE_EMAIL', email })));
  };

const updatePassword = (password: string): Action => ({ type: 'UPDATE_PASSWORD', password });

const setPaymentRequestButtonPaymentMethod =
  (paymentMethod: 'none' | StripePaymentMethod, stripeAccount: StripeAccount): Action =>
    ({ type: 'SET_PAYMENT_REQUEST_BUTTON_PAYMENT_METHOD', paymentMethod, stripeAccount });


const setStripePaymentRequestObject =
  (stripePaymentRequestObject: Object, stripeAccount: StripeAccount): Action =>
    ({ type: 'SET_STRIPE_PAYMENT_REQUEST_OBJECT', stripePaymentRequestObject, stripeAccount });

const setStripeV3HasLoaded = (): Action => ({ type: 'SET_STRIPE_V3_HAS_LOADED' });

const setStripePaymentRequestButtonClicked = (stripeAccount: StripeAccount): Action =>
  ({ type: 'SET_STRIPE_PAYMENT_REQUEST_BUTTON_CLICKED', stripeAccount });

const setStripePaymentRequestButtonError = (paymentError: ErrorReason, stripeAccount: StripeAccount): Action =>
  ({ type: 'SET_STRIPE_PAYMENT_REQUEST_ERROR', paymentError, stripeAccount });

const updateUserFormData = (userFormData: UserFormData): ((Function) => void) =>
  (dispatch: Function): void => {
    dispatch(setFormSubmissionDependentValue(() => ({ type: 'UPDATE_USER_FORM_DATA', userFormData })));
  };

const updateState = (state: UsState | CaState | null): ((Function) => void) =>
  (dispatch: Function): void => {
    dispatch(setFormSubmissionDependentValue(() => ({ type: 'UPDATE_STATE', state })));
  };

const updateBillingCountry = (billingCountry: IsoCountry): ((Function) => void) =>
  (dispatch: Function): void => {
    dispatch(setFormSubmissionDependentValue(() => ({ type: 'UPDATE_BILLING_COUNTRY', billingCountry })));
  };

const selectAmount = (amount: Amount | 'other', contributionType: ContributionType): ((Function) => void) =>
  (dispatch: Function): void => {
    dispatch(setFormSubmissionDependentValue(() => ({ type: 'SELECT_AMOUNT', amount, contributionType })));
  };

const setCheckoutFormHasBeenSubmitted = (): Action => ({ type: 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED' });

const setPasswordHasBeenSubmitted = (): Action => ({ type: 'SET_PASSWORD_HAS_BEEN_SUBMITTED' });

const setPasswordError = (passwordError: boolean): Action => ({ type: 'SET_PASSWORD_ERROR', passwordError });

const updateOtherAmount = (otherAmount: string, contributionType: ContributionType): ((Function) => void) =>
  (dispatch: Function): void => {
    dispatch(setFormSubmissionDependentValue(() => ({ type: 'UPDATE_OTHER_AMOUNT', otherAmount, contributionType })));
  };

const paymentSuccess = (): Action => ({ type: 'PAYMENT_SUCCESS' });

const paymentWaiting = (isWaiting: boolean): Action => ({ type: 'PAYMENT_WAITING', isWaiting });

const paymentFailure = (paymentError: ErrorReason): Action => ({ type: 'PAYMENT_FAILURE', paymentError });

const setGuestAccountCreationToken = (guestAccountCreationToken: string): Action =>
  ({ type: 'SET_GUEST_ACCOUNT_CREATION_TOKEN', guestAccountCreationToken });

const setThankYouPageStage = (thankYouPageStage: ThankYouPageStage): Action =>
  ({ type: 'SET_THANK_YOU_PAGE_STAGE', thankYouPageStage });

const setHasSeenDirectDebitThankYouCopy = (): Action => ({ type: 'SET_HAS_SEEN_DIRECT_DEBIT_THANK_YOU_COPY' });

const setThirdPartyPaymentLibrary =
  (thirdPartyPaymentLibraryByContrib: {
    [ContributionType]: {
      [PaymentMethod]: ThirdPartyPaymentLibrary
    }
  }): Action => ({
    type: 'UPDATE_PAYMENT_READY',
    thirdPartyPaymentLibraryByContrib: thirdPartyPaymentLibraryByContrib || null,
  });

const setAmazonPayLoginObject = (amazonLoginObject: Object): Action => ({
  type: 'SET_AMAZON_PAY_LOGIN_OBJECT',
  amazonLoginObject,
});

const setAmazonPayPaymentsObject = (amazonPaymentsObject: Object): Action => ({
  type: 'SET_AMAZON_PAY_PAYMENTS_OBJECT',
  amazonPaymentsObject,
});

const setAmazonPayWalletWidgetReady = (isReady: boolean): Action =>
  ({ type: 'SET_AMAZON_PAY_WALLET_WIDGET_READY', isReady });

const setAmazonPayHasAccessToken: Action = ({ type: 'SET_AMAZON_PAY_HAS_ACCESS_TOKEN' });
const setAmazonPayFatalError: Action = ({ type: 'SET_AMAZON_PAY_FATAL_ERROR' });

const setAmazonPayPaymentSelected = (paymentSelected: boolean): Action =>
  ({ type: 'SET_AMAZON_PAY_PAYMENT_SELECTED', paymentSelected });

const setAmazonPayOrderReferenceId = (orderReferenceId: string): Action =>
  ({ type: 'SET_AMAZON_PAY_ORDER_REFERENCE_ID', orderReferenceId });

const setUserTypeFromIdentityResponse =
  (userTypeFromIdentityResponse: UserTypeFromIdentityResponse): ((Function) => void) =>
    (dispatch: Function): void => {
      dispatch(setFormSubmissionDependentValue(() =>
        ({ type: 'SET_USER_TYPE_FROM_IDENTITY_RESPONSE', userTypeFromIdentityResponse })));
    };


const updateContributionTypeAndPaymentMethod =
  (contributionType: ContributionType, paymentMethodToSelect: PaymentMethod) =>
    (dispatch: Function): void => {
      // PayPal one-off redirects away from the site before hitting the thank you page
      // so we need to store the contrib type & payment method in the storage so that it is available on the
      // thank you page in all scenarios.
      storage.setSession('selectedContributionType', contributionType);
      storage.setSession('selectedPaymentMethod', paymentMethodToSelect);
      dispatch(updateContributionType(contributionType));
      dispatch(updatePaymentMethod(paymentMethodToSelect));
    };

const checkIfEmailHasPassword = (email: string) =>
  (dispatch: Function, getState: () => State): void => {
    const state = getState();
    const { csrf } = state.page;
    const { isSignedIn } = state.page.user;

    getUserTypeFromIdentity(
      email,
      isSignedIn,
      csrf,
      (userType: UserTypeFromIdentityResponse) =>
        dispatch(setUserTypeFromIdentityResponse(userType)),
    );
  };

const setTickerGoalReached = (): Action => ({ type: 'SET_TICKER_GOAL_REACHED', tickerGoalReached: true });

const setCreateStripePaymentMethod = (createStripePaymentMethod: (email: string) => void): Action =>
  ({ type: 'SET_CREATE_STRIPE_PAYMENT_METHOD', createStripePaymentMethod });

const setHandleStripe3DS = (handleStripe3DS: (clientSecret: string) => Promise<Stripe3DSResult>): Action =>
  ({ type: 'SET_HANDLE_STRIPE_3DS', handleStripe3DS });

const setStripeCardFormComplete = (isComplete: boolean): ((Function) => void) =>
  (dispatch: Function): void => {
    dispatch(setFormSubmissionDependentValue(() => ({ type: 'SET_STRIPE_CARD_FORM_COMPLETE', isComplete })));
  };

const setSetupIntentClientSecret = (setupIntentClientSecret: string): Action =>
  ({ type: 'SET_STRIPE_SETUP_INTENT_CLIENT_SECRET', setupIntentClientSecret });

const sendFormSubmitEventForPayPalRecurring = () =>
  (dispatch: Function, getState: () => State): void => {
    const state = getState();
    const formSubmitParameters: FormSubmitParameters = {
      ...state.page.form,
      flowPrefix: 'npf',
      form: getForm('form--contribution'),
      isSignedIn: state.page.user.isSignedIn,
      isRecurringContributor: state.page.user.isRecurringContributor,
      setFormIsValid: (isValid: boolean) => dispatch(setFormIsValid(isValid)),
      setCheckoutFormHasBeenSubmitted: () => dispatch(setCheckoutFormHasBeenSubmitted()),
    };
    onFormSubmit(formSubmitParameters);
  };

const buildStripeChargeDataFromAuthorisation = (
  stripePaymentMethod: StripePaymentMethod,
  token: string,
  state: State,
): StripeChargeData => ({
  paymentData: {
    currency: state.common.internationalisation.currencyId,
    amount: getAmount(
      state.page.form.selectedAmounts,
      state.page.form.formData.otherAmounts,
      state.page.form.contributionType,
    ),
    token,
    email: state.page.form.formData.email || '',
    stripePaymentMethod,
  },
  acquisitionData: derivePaymentApiAcquisitionData(
    state.common.referrerAcquisitionData,
    state.common.abParticipations,
  ),
  publicKey: getStripeKey(
    stripeAccountForContributionType[state.page.form.contributionType],
    state.common.internationalisation.countryId,
    state.page.user.isTestUser || false,
  ),
});

const stripeChargeDataFromCheckoutAuthorisation = (
  authorisation: StripeCheckoutAuthorisation,
  state: State,
): StripeChargeData => buildStripeChargeDataFromAuthorisation(
  authorisation.stripePaymentMethod,
  authorisation.token,
  state,
);

const stripeChargeDataFromPaymentIntentAuthorisation = (
  authorisation: StripePaymentIntentAuthorisation,
  state: State,
): StripeChargeData => buildStripeChargeDataFromAuthorisation(
  authorisation.stripePaymentMethod,
  'token-deprecated',
  state,
);

const regularPaymentRequestFromAuthorisation = (
  authorisation: PaymentAuthorisation,
  state: State,
): RegularPaymentRequest => ({
  firstName: state.page.form.formData.firstName || '',
  lastName: state.page.form.formData.lastName || '',
  email: state.page.form.formData.email || '',
  billingAddress: {
    lineOne: null, // required go cardless field
    lineTwo: null, // required go cardless field
    city: null, // required go cardless field
    state: state.page.form.formData.state,
    postCode: null, // required go cardless field
    country:
      state.page.form.formData.billingCountry ? state.page.form.formData.billingCountry : state.common.internationalisation.countryId,
  },
  deliveryAddress: null,
  product: {
    amount: getAmount(
      state.page.form.selectedAmounts,
      state.page.form.formData.otherAmounts,
      state.page.form.contributionType,
    ),
    currency: state.common.internationalisation.currencyId,
    billingPeriod: state.page.form.contributionType === 'MONTHLY' ? Monthly : Annual,
  },
  firstDeliveryDate: null,
  paymentFields: regularPaymentFieldsFromAuthorisation(authorisation),
  ophanIds: getOphanIds(),
  referrerAcquisitionData: state.common.referrerAcquisitionData,
  supportAbTests: getSupportAbTests(state.common.abParticipations),
  telephoneNumber: null,
});

const amazonPayDataFromAuthorisation = (
  authorisation: AmazonPayAuthorisation,
  state: State,
): AmazonPayData => ({
  paymentData: {
    currency: state.common.internationalisation.currencyId,
    amount: getAmount(
      state.page.form.selectedAmounts,
      state.page.form.formData.otherAmounts,
      state.page.form.contributionType,
    ),
    orderReferenceId: authorisation.orderReferenceId,
    email: state.page.form.formData.email || '',
  },
  acquisitionData: derivePaymentApiAcquisitionData(
    state.common.referrerAcquisitionData,
    state.common.abParticipations,
  ),
});

// A PaymentResult represents the end state of the checkout process,
// standardised across payment methods & contribution types.
// This will execute at the end of every checkout, with the exception
// of PayPal one-off where this happens on the backend after the user is redirected to our site.
const onPaymentResult = (paymentResult: Promise<PaymentResult>, paymentAuthorisation: PaymentAuthorisation) =>
  (dispatch: Dispatch<Action>, getState: () => State): Promise<PaymentResult> =>
    paymentResult.then((result) => {

      const state = getState();

      switch (result.paymentStatus) {
        case 'success':
          trackConversion(state.common.abParticipations, '/contribute/thankyou');
          dispatch(paymentSuccess());
          break;

        case 'failure':
        default: {
          // Payment Request button has its own error message, separate from the form
          const isPaymentRequestButton = paymentAuthorisation.stripePaymentMethod && (
            paymentAuthorisation.stripePaymentMethod === 'StripePaymentRequestButton' ||
            paymentAuthorisation.stripePaymentMethod === 'StripeApplePay'
          );

          if (isPaymentRequestButton) {
            dispatch(setStripePaymentRequestButtonError(
              result.error,
              stripeAccountForContributionType[state.page.form.contributionType],
            ));
          } else {
            if (result.error === 'amazon_pay_fatal') {
              dispatch(setAmazonPayFatalError);
            }
            if (result.error === 'amazon_pay_try_other_card') {
              // Must re-render the wallet widget in order to display amazon's error message
              dispatch(setAmazonPayWalletWidgetReady(false));
            }
            dispatch(paymentFailure(result.error));
          }

          dispatch(paymentWaiting(false));
        }
      }
      return result;
    });

const onCreateOneOffPayPalPaymentResponse =
  (paymentResult: Promise<CreatePayPalPaymentResponse>) =>
    (dispatch: Dispatch<Action>, getState: () => State): void => {
      paymentResult.then((result: CreatePayPalPaymentResponse) => {
        const state = getState();

        const acquisitionData = derivePaymentApiAcquisitionData(
          state.common.referrerAcquisitionData,
          state.common.abParticipations,
        );

        // We've only created a payment at this point, and the user has to get through
        // the PayPal flow on their site before we can actually try and execute the payment.
        // So we drop a cookie which will be used by the /paypal/rest/return endpoint
        // that the user returns to from PayPal, if payment is successful.
        cookie.set('acquisition_data', encodeURIComponent(JSON.stringify(acquisitionData)));

        if (result.type === 'success') {
          window.location.href = result.data.approvalUrl;
        } else {
          // For PayPal create payment errors, the Payment API passes through the
          // error from PayPal's API which we don't want to expose to the user.
          dispatch(paymentFailure('unknown'));
          dispatch(paymentWaiting(false));
        }
      });
    };

// The steps for one-off payment can be summarised as follows:
// 1. Create a payment
// 2. Authorise a payment
// 3. Execute a payment (money is actually taken at this point)
//
// For PayPal: we do 1 clientside, they do 2, we do 3 but serverside
// For Stripe: they do 1 & 2, we do 3 clientside.
//
// So from the clientside perspective, for one-off we just see "create payment" for PayPal
// and "execute payment" for Stripe, and these are not synonymous.
const createOneOffPayPalPayment = (data: CreatePaypalPaymentData) =>
  (dispatch: Dispatch<Action>): void => {
    dispatch(onCreateOneOffPayPalPaymentResponse(postOneOffPayPalCreatePaymentRequest(data)));
  };

const executeStripeOneOffPayment = (
  data: StripeChargeData,
  setGuestToken: (string) => void,
  setThankYouPage: (ThankYouPageStage) => void,
  paymentAuthorisation: PaymentAuthorisation,
) =>
  (dispatch: Dispatch<Action>): Promise<PaymentResult> =>
    dispatch(onPaymentResult(
      postOneOffStripeExecutePaymentRequest(data)(setGuestToken, setThankYouPage),
      paymentAuthorisation,
    ));

const makeCreateStripePaymentIntentRequest = (
  data: CreateStripePaymentIntentRequest,
  setGuestToken: (string) => void,
  setThankYouPage: (ThankYouPageStage) => void,
  handleStripe3DS: (clientSecret: string) => Promise<Stripe3DSResult>,
  paymentAuthorisation: PaymentAuthorisation,
) =>
  (dispatch: Dispatch<Action>): Promise<PaymentResult> =>
    dispatch(onPaymentResult(
      processStripePaymentIntentRequest(data, handleStripe3DS)(setGuestToken, setThankYouPage),
      paymentAuthorisation,
    ));

const executeAmazonPayOneOffPayment = (
  data: AmazonPayData,
  setGuestToken: (string) => void,
  setThankYouPage: (ThankYouPageStage) => void,
  paymentAuthorisation: PaymentAuthorisation,
) =>
  (dispatch: Dispatch<Action>): Promise<PaymentResult> =>
    dispatch(onPaymentResult(
      postOneOffAmazonPayExecutePaymentRequest(data)(setGuestToken, setThankYouPage),
      paymentAuthorisation,
    ));

function recurringPaymentAuthorisationHandler(
  dispatch: Dispatch<Action>,
  state: State,
  paymentAuthorisation: PaymentAuthorisation,
): Promise<PaymentResult> {
  const request = regularPaymentRequestFromAuthorisation(paymentAuthorisation, state);

  return dispatch(onPaymentResult(
    postRegularPaymentRequest(
      routes.recurringContribCreate,
      request,
      state.common.abParticipations,
      state.page.csrf,
      (token: string) => dispatch(setGuestAccountCreationToken(token)),
      (thankYouPageStage: ThankYouPageStage) => dispatch(setThankYouPageStage(thankYouPageStage)),
    ),
    paymentAuthorisation,
  ));
}

// Bizarrely, adding a type to this object means the type-checking on the
// paymentAuthorisationHandlers is no longer accurate.
// (Flow thinks it's OK when it's missing required properties).
const recurringPaymentAuthorisationHandlers = {
  // These are all the same because there's a single endpoint in
  // support-frontend which handles all requests to create a recurring payment
  PayPal: recurringPaymentAuthorisationHandler,
  Stripe: recurringPaymentAuthorisationHandler,
  DirectDebit: recurringPaymentAuthorisationHandler,
  ExistingCard: recurringPaymentAuthorisationHandler,
  ExistingDirectDebit: recurringPaymentAuthorisationHandler,
};

const error = { paymentStatus: 'failure', error: 'internal_error' };

const paymentAuthorisationHandlers: PaymentMatrix<(
  Dispatch<Action>,
  State,
  PaymentAuthorisation,
) => Promise<PaymentResult>> = {
  ONE_OFF: {
    PayPal: () => {
      // Executing a one-off PayPal payment happens on the backend in the /paypal/rest/return
      // endpoint, after PayPal redirects the browser back to our site.
      logException('Paypal one-off has no authorisation handler');
      return Promise.resolve(error);
    },
    Stripe: (
      dispatch: Dispatch<Action>,
      state: State,
      paymentAuthorisation: PaymentAuthorisation,
    ): Promise<PaymentResult> => {
      if (paymentAuthorisation.paymentMethod === Stripe) {
        if (paymentAuthorisation.token) {
          return dispatch(executeStripeOneOffPayment(
            stripeChargeDataFromCheckoutAuthorisation(paymentAuthorisation, state),
            (token: string) => dispatch(setGuestAccountCreationToken(token)),
            (thankYouPageStage: ThankYouPageStage) => dispatch(setThankYouPageStage(thankYouPageStage)),
            paymentAuthorisation,
          ));
        }

        if (paymentAuthorisation.paymentMethodId) {
          const { handle3DS } = state.page.form.stripeCardFormData;
          if (handle3DS) {
            const stripeData: CreateStripePaymentIntentRequest = {
              ...stripeChargeDataFromPaymentIntentAuthorisation(paymentAuthorisation, state),
              paymentMethodId: paymentAuthorisation.paymentMethodId,
            };
            return dispatch(makeCreateStripePaymentIntentRequest(
              stripeData,
              (token: string) => dispatch(setGuestAccountCreationToken(token)),
              (thankYouPageStage: ThankYouPageStage) => dispatch(setThankYouPageStage(thankYouPageStage)),
              handle3DS,
              paymentAuthorisation,
            ));
          }
          // It shouldn't be possible to get this far without the handle3DS having been set
          logException('Stripe 3DS handler unavailable');
          return Promise.resolve(error);
        }
        logException('Invalid payment authorisation: missing paymentMethodId or token for Stripe one-off contribution');
        return Promise.resolve(error);
      }
      logException(`Invalid payment authorisation: Tried to use the ${paymentAuthorisation.paymentMethod} handler with Stripe`);
      return Promise.resolve(error);
    },
    DirectDebit: () => {
      logInvalidCombination('ONE_OFF', DirectDebit);
      return Promise.resolve(error);
    },
    ExistingCard: () => {
      logInvalidCombination('ONE_OFF', ExistingCard);
      return Promise.resolve(error);
    },
    ExistingDirectDebit: () => {
      logInvalidCombination('ONE_OFF', ExistingDirectDebit);
      return Promise.resolve(error);
    },
    AmazonPay: (
      dispatch: Dispatch<Action>,
      state: State,
      paymentAuthorisation: PaymentAuthorisation,
    ): Promise<PaymentResult> => {
      if (paymentAuthorisation.paymentMethod === AmazonPay) {
        return dispatch(executeAmazonPayOneOffPayment(
          amazonPayDataFromAuthorisation(paymentAuthorisation, state),
          (token: string) => dispatch(setGuestAccountCreationToken(token)),
          (thankYouPageStage: ThankYouPageStage) => dispatch(setThankYouPageStage(thankYouPageStage)),
          paymentAuthorisation,
        ));
      }
      return Promise.resolve(error);

    },
    None: () => {
      logInvalidCombination('ONE_OFF', 'None');
      return Promise.resolve(error);
    },
  },
  ANNUAL: {
    ...recurringPaymentAuthorisationHandlers,
    AmazonPay: () => {
      logInvalidCombination('ANNUAL', AmazonPay);
      return Promise.resolve(error);
    },
    None: () => {
      logInvalidCombination('ANNUAL', 'None');
      return Promise.resolve(error);
    },
  },
  MONTHLY: {
    ...recurringPaymentAuthorisationHandlers,
    AmazonPay: () => {
      logInvalidCombination('MONTHLY', AmazonPay);
      return Promise.resolve(error);
    },
    None: () => {
      logInvalidCombination('MONTHLY', 'None');
      return Promise.resolve(error);
    },
  },
};

const onThirdPartyPaymentAuthorised = (paymentAuthorisation: PaymentAuthorisation) =>
  (dispatch: Function, getState: () => State): Promise<PaymentResult> => {
    const state = getState();
    return paymentAuthorisationHandlers[state.page.form.contributionType][state.page.form.paymentMethod](
      dispatch,
      state,
      paymentAuthorisation,
    );
  };


export {
  updateContributionTypeAndPaymentMethod,
  updatePaymentMethod,
  updateSelectedExistingPaymentMethod,
  updateFirstName,
  updateLastName,
  updateEmail,
  updateState,
  updateBillingCountry,
  updateUserFormData,
  setThirdPartyPaymentLibrary,
  setAmazonPayLoginObject,
  setAmazonPayPaymentsObject,
  setAmazonPayWalletWidgetReady,
  setAmazonPayHasAccessToken,
  setAmazonPayFatalError,
  setAmazonPayOrderReferenceId,
  setAmazonPayPaymentSelected,
  selectAmount,
  updateOtherAmount,
  paymentFailure,
  paymentWaiting,
  paymentSuccess,
  onThirdPartyPaymentAuthorised,
  setCheckoutFormHasBeenSubmitted,
  setGuestAccountCreationToken,
  setThankYouPageStage,
  setPasswordHasBeenSubmitted,
  setPasswordError,
  updatePassword,
  createOneOffPayPalPayment,
  setHasSeenDirectDebitThankYouCopy,
  checkIfEmailHasPassword,
  setFormIsValid,
  sendFormSubmitEventForPayPalRecurring,
  setPaymentRequestButtonPaymentMethod,
  setStripePaymentRequestObject,
  setStripePaymentRequestButtonClicked,
  setStripePaymentRequestButtonError,
  setStripeV3HasLoaded,
  setTickerGoalReached,
  setCreateStripePaymentMethod,
  setHandleStripe3DS,
  setStripeCardFormComplete,
  setSetupIntentClientSecret,
};
