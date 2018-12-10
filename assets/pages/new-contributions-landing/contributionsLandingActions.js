// @flow

// ----- Imports ----- //

import type { ErrorReason } from 'helpers/errorReasons';
import { type ThirdPartyPaymentLibrary } from 'helpers/checkouts';
import {
  type Amount,
  logInvalidCombination,
  billingPeriodFromContrib,
  type ContributionType,
  type PaymentMethod,
  type PaymentMatrix, getAmount,
} from 'helpers/contributions';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import { getUserTypeFromIdentity } from 'helpers/identityApis';
import { type CaState, type UsState } from 'helpers/internationalisation/country';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { payPalRequestData } from 'helpers/paymentIntegrations/newPaymentFlow/payPalRecurringCheckout';
import type { RegularPaymentRequest } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import {
  type PaymentAuthorisation,
  regularPaymentFieldsFromAuthorisation,
  type PaymentResult,
  postRegularPaymentRequest,
} from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import type { StripeChargeData } from 'helpers/paymentIntegrations/newPaymentFlow/oneOffContributions';
import {
  type CreatePaypalPaymentData,
  type CreatePayPalPaymentResponse,
  postOneOffPayPalCreatePaymentRequest,
  postOneOffStripeExecutePaymentRequest,
} from 'helpers/paymentIntegrations/newPaymentFlow/oneOffContributions';
import { routes } from 'helpers/routes';
import * as storage from 'helpers/storage';
import {
  derivePaymentApiAcquisitionData,
  getOphanIds,
  getSupportAbTests,
} from 'helpers/tracking/acquisitions';
import { logException } from 'helpers/logger';
import trackConversion from 'helpers/tracking/conversions';
import { type UserTypeFromIdentityResponse } from 'helpers/identityApis';
import { getForm } from 'helpers/checkoutForm/checkoutForm';
import { onFormSubmit, type FormSubmitParameters } from 'helpers/checkoutForm/onFormSubmit';
import * as cookie from 'helpers/cookie';
import { setFormSubmissionDependentValue } from './checkoutFormIsSubmittableActions';
import {
  type State,
  type UserFormData,
  type ThankYouPageStage,
} from './contributionsLandingReducer';

export type Action =
  | { type: 'UPDATE_CONTRIBUTION_TYPE', contributionType: ContributionType }
  | { type: 'UPDATE_PAYMENT_METHOD', paymentMethod: PaymentMethod }
  | { type: 'UPDATE_FIRST_NAME', firstName: string }
  | { type: 'UPDATE_LAST_NAME', lastName: string }
  | { type: 'UPDATE_EMAIL', email: string }
  | { type: 'UPDATE_PASSWORD', password: string }
  | { type: 'UPDATE_STATE', state: UsState | CaState | null }
  | { type: 'UPDATE_USER_FORM_DATA', userFormData: UserFormData }
  | { type: 'UPDATE_PAYMENT_READY', thirdPartyPaymentLibraryByContrib: { [ContributionType]: { [PaymentMethod]: ThirdPartyPaymentLibrary } } }
  | { type: 'SELECT_AMOUNT', amount: Amount | 'other', contributionType: ContributionType }
  | { type: 'UPDATE_OTHER_AMOUNT', otherAmount: string }
  | { type: 'PAYMENT_RESULT', paymentResult: Promise<PaymentResult> }
  | { type: 'PAYMENT_FAILURE', paymentError: ErrorReason }
  | { type: 'PAYMENT_WAITING', isWaiting: boolean }
  | { type: 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED' }
  | { type: 'SET_PASSWORD_HAS_BEEN_SUBMITTED' }
  | { type: 'SET_PASSWORD_ERROR', passwordError: boolean }
  | { type: 'SET_GUEST_ACCOUNT_CREATION_TOKEN', guestAccountCreationToken: string }
  | { type: 'SET_FORM_IS_SUBMITTABLE', formIsSubmittable: boolean }
  | { type: 'SET_THANK_YOU_PAGE_STAGE', thankYouPageStage: ThankYouPageStage }
  | { type: 'SET_PAYMENT_REQUEST', paymentRequest: Object }
  | { type: 'SET_CAN_MAKE_APPLE_PAY_PAYMENT', canMakeApplePayPayment: boolean }
  | { type: 'SET_STRIPE_PAYMENT_REQUEST_BUTTON_CLICKED' }
  | { type: 'SET_PAYPAL_HAS_LOADED' }
  | { type: 'SET_HAS_SEEN_DIRECT_DEBIT_THANK_YOU_COPY' }
  | { type: 'PAYMENT_SUCCESS' }
  | { type: 'SET_USER_TYPE_FROM_IDENTITY_RESPONSE', userTypeFromIdentityResponse: UserTypeFromIdentityResponse }
  | { type: 'SET_FORM_IS_VALID', isValid: boolean };

const setFormIsValid = (isValid: boolean): Action => ({ type: 'SET_FORM_IS_VALID', isValid });

// Do not export this, as we only want it to be called via updateContributionTypeAndPaymentMethod
const updateContributionType = (contributionType: ContributionType): ((Function) => void) =>
  (dispatch: Function): void => {
    dispatch(setFormSubmissionDependentValue(() => ({ type: 'UPDATE_CONTRIBUTION_TYPE', contributionType })));
  };

const updatePaymentMethod = (paymentMethod: PaymentMethod): Action => {
  // PayPal one-off redirects away from the site before hitting the thank you page
  // so we need to store the payment method in the storage so that it is available on the
  // thank you page in all scenarios.
  storage.setSession('paymentMethod', paymentMethod);
  return ({ type: 'UPDATE_PAYMENT_METHOD', paymentMethod });
};

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

const setCanMakeApplePayPayment = (canMakeApplePayPayment: boolean): Action => ({ type: 'SET_CAN_MAKE_APPLE_PAY_PAYMENT', canMakeApplePayPayment });

const setPaymentRequest = (paymentRequest: Object): Action => ({ type: 'SET_PAYMENT_REQUEST', paymentRequest });

const setStripePaymentRequestButtonClicked = (): Action => ({ type: 'SET_STRIPE_PAYMENT_REQUEST_BUTTON_CLICKED' });

const updateUserFormData = (userFormData: UserFormData): ((Function) => void) =>
  (dispatch: Function): void => {
    dispatch(setFormSubmissionDependentValue(() => ({ type: 'UPDATE_USER_FORM_DATA', userFormData })));
  };

const updateState = (state: UsState | CaState | null): ((Function) => void) =>
  (dispatch: Function): void => {
    dispatch(setFormSubmissionDependentValue(() => ({ type: 'UPDATE_STATE', state })));
  };

const selectAmount = (amount: Amount | 'other', contributionType: ContributionType): ((Function) => void) =>
  (dispatch: Function): void => {
    dispatch(setFormSubmissionDependentValue(() => ({ type: 'SELECT_AMOUNT', amount, contributionType })));
  };

const setCheckoutFormHasBeenSubmitted = (): Action => ({ type: 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED' });

const setPasswordHasBeenSubmitted = (): Action => ({ type: 'SET_PASSWORD_HAS_BEEN_SUBMITTED' });

const setPasswordError = (passwordError: boolean): Action => ({ type: 'SET_PASSWORD_ERROR', passwordError });

const updateOtherAmount = (otherAmount: string): ((Function) => void) =>
  (dispatch: Function): void => {
    dispatch(setFormSubmissionDependentValue(() => ({ type: 'UPDATE_OTHER_AMOUNT', otherAmount })));
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

const setPayPalHasLoaded = (): Action => ({ type: 'SET_PAYPAL_HAS_LOADED' });

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
      storage.setSession('contributionType', contributionType);
      storage.setSession('paymentMethod', paymentMethodToSelect);
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

const stripeChargeDataFromAuthorisation = (
  authorisation: PaymentAuthorisation,
  state: State,
): StripeChargeData => ({
  paymentData: {
    currency: state.common.internationalisation.currencyId,
    amount: getAmount(
      state.page.form.selectedAmounts,
      state.page.form.formData.otherAmounts,
      state.page.form.contributionType,
    ),
    token: authorisation.paymentMethod === 'Stripe' ? authorisation.token : '',
    email: state.page.form.formData.email || '',
  },
  acquisitionData: derivePaymentApiAcquisitionData(
    state.common.referrerAcquisitionData,
    state.common.abParticipations,
    state.common.optimizeExperiments,
  ),
});

const regularPaymentRequestFromAuthorisation = (
  authorisation: PaymentAuthorisation,
  state: State,
): RegularPaymentRequest => ({
  firstName: state.page.form.formData.firstName || '',
  lastName: state.page.form.formData.lastName || '',
  country: state.common.internationalisation.countryId,
  state: state.page.form.formData.state,
  email: state.page.form.formData.email || '',
  contribution: {
    amount: getAmount(
      state.page.form.selectedAmounts,
      state.page.form.formData.otherAmounts,
      state.page.form.contributionType,
    ),
    currency: state.common.internationalisation.currencyId,
    billingPeriod: state.page.form.contributionType === 'MONTHLY' ? 'Monthly' : 'Annual',
  },
  paymentFields: regularPaymentFieldsFromAuthorisation(authorisation),
  ophanIds: getOphanIds(),
  referrerAcquisitionData: state.common.referrerAcquisitionData,
  supportAbTests: getSupportAbTests(state.common.abParticipations, state.common.optimizeExperiments),
});

// A PaymentResult represents the end state of the checkout process,
// standardised across payment methods & contribution types.
// This will execute at the end of every checkout, with the exception
// of PayPal one-off where this happens on the backend after the user is redirected to our site.
const onPaymentResult = (paymentResult: Promise<PaymentResult>) =>
  (dispatch: Dispatch<Action>, getState: () => State): void => {
    paymentResult.then((result) => {
      const state = getState();

      switch (result.paymentStatus) {
        case 'success':
          trackConversion(state.common.abParticipations, '/contribute/thankyou');
          dispatch(paymentSuccess());
          break;

        case 'failure':
        default:
          dispatch(paymentFailure(result.error));
          dispatch(paymentWaiting(false));

      }
    });
  };

const onCreateOneOffPayPalPaymentResponse =
  (paymentResult: Promise<CreatePayPalPaymentResponse>) =>
    (dispatch: Dispatch<Action>, getState: () => State): void => {
      paymentResult.then((result: CreatePayPalPaymentResponse) => {
        const state = getState();

        const acquisitionData = derivePaymentApiAcquisitionData(
          state.common.referrerAcquisitionData,
          state.common.abParticipations,
          state.common.optimizeExperiments,
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

const executeStripeOneOffPayment = (data: StripeChargeData) =>
  (dispatch: Dispatch<Action>): void => {
    dispatch(onPaymentResult(postOneOffStripeExecutePaymentRequest(data)));
  };

// This is the recurring PayPal equivalent of the "Create a payment" Step 1 described above.
// It happens when the user clicks the recurring PayPal button,
// before the PayPal popup in which they authorise the payment appears.
// It should probably be called createOneOffPayPalPayment but it's called setupPayment
// on the backend so pending a far-reaching rename, I'll keep the terminology consistent with the backend.
const setupRecurringPayPalPayment = (
  resolve: string => void,
  reject: Error => void,
  currency: IsoCurrency,
  csrf: Csrf,
  contributionType: ContributionType,
) =>
  (dispatch: Function, getState: () => State): void => {
    const state = getState();
    const csrfToken = csrf.token;
    const amount = getAmount(
      state.page.form.selectedAmounts,
      state.page.form.formData.otherAmounts,
      state.page.form.contributionType,
    );
    const billingPeriod = billingPeriodFromContrib(contributionType);
    storage.setSession('paymentMethod', 'PayPal');
    const requestBody = {
      amount,
      billingPeriod,
      currency,
    };

    fetch(routes.payPalSetupPayment, payPalRequestData(requestBody, csrfToken || ''))
      .then(response => (response.ok ? response.json() : null))
      .then((token: { token: string } | null) => {
        if (token) {
          resolve(token.token);
        } else {
          logException('PayPal token came back blank');
        }
      }).catch((err: Error) => {
        logException(err.message);
        reject(err);
      });
  };

function recurringPaymentAuthorisationHandler(
  dispatch: Dispatch<Action>,
  state: State,
  paymentAuthorisation: PaymentAuthorisation,
): void {
  const request = regularPaymentRequestFromAuthorisation(paymentAuthorisation, state);

  dispatch(onPaymentResult(postRegularPaymentRequest(
    request,
    state.common.abParticipations,
    state.page.csrf,
    (token: string) => dispatch(setGuestAccountCreationToken(token)),
    (thankYouPageStage: ThankYouPageStage) => dispatch(setThankYouPageStage(thankYouPageStage)),
  )));
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
};

const paymentAuthorisationHandlers: PaymentMatrix<(Dispatch<Action>, State, PaymentAuthorisation) => void> = {
  ONE_OFF: {
    PayPal: () => {
      // Executing a one-off PayPal payment happens on the backend in the /paypal/rest/return
      // endpoint, after PayPal redirects the browser back to our site.
      logException('Paypal one-off has no authorisation handler');
    },
    Stripe: (dispatch: Dispatch<Action>, state: State, paymentAuthorisation: PaymentAuthorisation): void => {
      dispatch(executeStripeOneOffPayment(stripeChargeDataFromAuthorisation(paymentAuthorisation, state)));
    },
    DirectDebit: () => {
      logInvalidCombination('ONE_OFF', 'DirectDebit');
    },
    None: () => {
      logInvalidCombination('ONE_OFF', 'None');
    },
  },
  ANNUAL: {
    ...recurringPaymentAuthorisationHandlers,
    None: () => {
      logInvalidCombination('ANNUAL', 'None');
    },
  },
  MONTHLY: {
    ...recurringPaymentAuthorisationHandlers,
    None: () => {
      logInvalidCombination('MONTHLY', 'None');
    },
  },
};

const onThirdPartyPaymentAuthorised = (paymentAuthorisation: PaymentAuthorisation) =>
  (dispatch: Function, getState: () => State): void => {
    const state = getState();
    paymentAuthorisationHandlers[state.page.form.contributionType][state.page.form.paymentMethod](
      dispatch,
      state,
      paymentAuthorisation,
    );
  };

const onStripePaymentRequestApiPaymentAuthorised = (paymentAuthorisation: PaymentAuthorisation) =>
  (dispatch: Function, getState: () => State): void => {
    const state = getState();
    paymentAuthorisationHandlers.ONE_OFF.Stripe(
      dispatch,
      state,
      paymentAuthorisation,
    );
  };

export {
  updateContributionTypeAndPaymentMethod,
  updatePaymentMethod,
  updateFirstName,
  updateLastName,
  updateEmail,
  updateState,
  updateUserFormData,
  setThirdPartyPaymentLibrary,
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
  setPayPalHasLoaded,
  setupRecurringPayPalPayment,
  setHasSeenDirectDebitThankYouCopy,
  checkIfEmailHasPassword,
  setFormIsValid,
  sendFormSubmitEventForPayPalRecurring,
  setCanMakeApplePayPayment,
  setPaymentRequest,
  onStripePaymentRequestApiPaymentAuthorised,
  setStripePaymentRequestButtonClicked,
};
