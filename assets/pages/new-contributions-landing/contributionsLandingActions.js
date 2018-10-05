// @flow

// ----- Imports ----- //

import { type PaymentHandler, type PaymentMethod } from 'helpers/checkouts';
import { type Amount, type Contrib } from 'helpers/contributions';
import { type CaState, type UsState } from 'helpers/internationalisation/country';
import type { RegularPaymentRequest } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import {
  type PaymentAuthorisation,
  regularPaymentFieldsFromAuthorisation,
  type PaymentResult,
  PaymentSuccess,
  postRegularPaymentRequest,
} from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import type { StripeChargeData } from 'helpers/paymentIntegrations/newPaymentFlow/oneOffContributions';
import {
  type CreatePaypalPaymentData,
  type CreatePayPalPaymentResponse,
  postOneOffPayPalCreatePaymentRequest,
  postOneOffStripeExecutePaymentRequest,
} from 'helpers/paymentIntegrations/newPaymentFlow/oneOffContributions';
import {
  derivePaymentApiAcquisitionData,
  getOphanIds,
  getSupportAbTests,
} from 'helpers/tracking/acquisitions';
import trackConversion from 'helpers/tracking/conversions';
import * as cookie from 'helpers/cookie';
import { type State, type UserFormData, type ThankYouPageStage } from './contributionsLandingReducer';

export type Action =
  | { type: 'UPDATE_CONTRIBUTION_TYPE', contributionType: Contrib, paymentMethodToSelect: PaymentMethod }
  | { type: 'UPDATE_PAYMENT_METHOD', paymentMethod: PaymentMethod }
  | { type: 'UPDATE_FIRST_NAME', firstName: string }
  | { type: 'UPDATE_LAST_NAME', lastName: string }
  | { type: 'UPDATE_EMAIL', email: string }
  | { type: 'UPDATE_PASSWORD', password: string }
  | { type: 'UPDATE_STATE', state: UsState | CaState | null }
  | { type: 'UPDATE_USER_FORM_DATA', userFormData: UserFormData }
  | { type: 'UPDATE_PAYMENT_READY', paymentReady: boolean, paymentHandler: ?{ [PaymentMethod]: PaymentHandler } }
  | { type: 'SELECT_AMOUNT', amount: Amount | 'other', contributionType: Contrib }
  | { type: 'UPDATE_OTHER_AMOUNT', otherAmount: string }
  | { type: 'PAYMENT_RESULT', paymentResult: Promise<PaymentResult> }
  | { type: 'PAYMENT_FAILURE', error: string }
  | { type: 'PAYMENT_WAITING', isWaiting: boolean }
  | { type: 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED' }
  | { type: 'SET_PASSWORD_HAS_BEEN_SUBMITTED' }
  | { type: 'SET_GUEST_ACCOUNT_CREATION_TOKEN', guestAccountCreationToken: string }
  | { type: 'SET_THANK_YOU_PAGE_STAGE', thankYouPageStage: ThankYouPageStage }
  | { type: 'PAYMENT_SUCCESS' };

const updateContributionType = (contributionType: Contrib, paymentMethodToSelect: PaymentMethod): Action =>
  ({ type: 'UPDATE_CONTRIBUTION_TYPE', contributionType, paymentMethodToSelect });

const updatePaymentMethod = (paymentMethod: PaymentMethod): Action =>
  ({ type: 'UPDATE_PAYMENT_METHOD', paymentMethod });

const updateFirstName = (firstName: string): Action => ({ type: 'UPDATE_FIRST_NAME', firstName });

const updateLastName = (lastName: string): Action => ({ type: 'UPDATE_LAST_NAME', lastName });

const updateEmail = (email: string): Action => ({ type: 'UPDATE_EMAIL', email });

const updatePassword = (password: string): Action => ({ type: 'UPDATE_PASSWORD', password });

const updateUserFormData = (userFormData: UserFormData): Action => ({ type: 'UPDATE_USER_FORM_DATA', userFormData });

const updateState = (state: UsState | CaState | null): Action => ({ type: 'UPDATE_STATE', state });

const selectAmount = (amount: Amount | 'other', contributionType: Contrib): Action =>
  ({
    type: 'SELECT_AMOUNT', amount, contributionType,
  });

const setCheckoutFormHasBeenSubmitted = (): Action => ({ type: 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED' });

const setPasswordHasBeenSubmitted = (): Action => ({ type: 'SET_PASSWORD_HAS_BEEN_SUBMITTED' });


const updateOtherAmount = (otherAmount: string): Action => ({ type: 'UPDATE_OTHER_AMOUNT', otherAmount });

const paymentSuccess = (): Action => ({ type: 'PAYMENT_SUCCESS' });

const paymentWaiting = (isWaiting: boolean): Action => ({ type: 'PAYMENT_WAITING', isWaiting });

const paymentFailure = (error: string): Action => ({ type: 'PAYMENT_FAILURE', error });

const setGuestAccountCreationToken = (guestAccountCreationToken: string): Action =>
  ({ type: 'SET_GUEST_ACCOUNT_CREATION_TOKEN', guestAccountCreationToken });

const setThankYouPageStage = (thankYouPageStage: ThankYouPageStage): Action =>
  ({ type: 'SET_THANK_YOU_PAGE_STAGE', thankYouPageStage });

const isPaymentReady = (paymentReady: boolean, paymentHandler: ?{ [PaymentMethod]: PaymentHandler }): Action =>
  ({ type: 'UPDATE_PAYMENT_READY', paymentReady, paymentHandler: paymentHandler || null });


const getAmount = (state: State) =>
  parseFloat(state.page.form.selectedAmounts[state.page.form.contributionType] === 'other'
    ? state.page.form.formData.otherAmounts[state.page.form.contributionType].amount
    : state.page.form.selectedAmounts[state.page.form.contributionType].value);

const stripeChargeDataFromAuthorisation = (
  authorisation: PaymentAuthorisation,
  state: State,
): StripeChargeData => ({
  paymentData: {
    currency: state.common.internationalisation.currencyId,
    amount: getAmount(state),
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
    amount: getAmount(state),
    currency: state.common.internationalisation.currencyId,
    billingPeriod: state.page.form.contributionType === 'MONTHLY' ? 'Monthly' : 'Annual',
  },
  paymentFields: regularPaymentFieldsFromAuthorisation(authorisation),
  ophanIds: getOphanIds(),
  referrerAcquisitionData: state.common.referrerAcquisitionData,
  supportAbTests: getSupportAbTests(state.common.abParticipations, state.common.optimizeExperiments),
});

const onPaymentResult = (paymentResult: Promise<PaymentResult>) =>
  (dispatch: Dispatch<Action>, getState: () => State): void => {
    paymentResult.then((result) => {
      const state = getState();

      switch (result.paymentStatus) {
        case 'success':
          trackConversion(state.common.abParticipations, '/contribute/thankyou.new');
          dispatch(paymentSuccess());
          break;

        default:
          dispatch(paymentFailure(result.error));
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
        }

        // For PayPal create payment errors, the Payment API passes through the
        // error from PayPal's API which we don't want to expose to the user.
        dispatch(paymentFailure('There was an error with your payment'));
      });
    };

const createOneOffPayPalPayment = (data: CreatePaypalPaymentData) =>
  (dispatch: Dispatch<Action>): void => {
    dispatch(onCreateOneOffPayPalPaymentResponse(postOneOffPayPalCreatePaymentRequest(data)));
  };

const setupRegularPayment = (data: RegularPaymentRequest) =>
  (dispatch: Dispatch<Action>, getState: () => State): void => {
    const state = getState();

    switch (state.page.form.paymentMethod) {
      case 'Stripe':
      case 'DirectDebit':
        dispatch(onPaymentResult(postRegularPaymentRequest(
          data,
          state.common.abParticipations,
          state.page.csrf,
          (token: string) => dispatch(setGuestAccountCreationToken(token)),
          (thankYouPageStage: ThankYouPageStage) => dispatch(setThankYouPageStage(thankYouPageStage)),
        )));
        return;

      case 'PayPal':
        // TODO
        dispatch(onPaymentResult(Promise.resolve(PaymentSuccess)));
        return;

      case 'None':
      default:
        dispatch(paymentFailure('No payment method selected'));
    }
  };

const executeStripeOneOffPayment = (data: StripeChargeData) =>
  (dispatch: Dispatch<Action>): void => {
    dispatch(onPaymentResult(postOneOffStripeExecutePaymentRequest(data)));
  };

const onThirdPartyPaymentAuthorised = (paymentAuthorisation: PaymentAuthorisation) =>
  (dispatch: Dispatch<Action>, getState: () => State): void => {
    const state = getState();

    switch (state.page.form.contributionType) {
      case 'ONE_OFF':
        // Why no mention of PayPal?
        // Executing a one-off PayPal payment happens on the backend in the /paypal/rest/return
        // endpoint, after PayPal redirects the browser back to our site.
        if (state.page.form.paymentMethod === 'Stripe') {
          dispatch(executeStripeOneOffPayment(stripeChargeDataFromAuthorisation(paymentAuthorisation, state)));
        }
        return;

      case 'ANNUAL':
      case 'MONTHLY':
        dispatch(setupRegularPayment(regularPaymentRequestFromAuthorisation(paymentAuthorisation, state)));
        return;

      default:
        dispatch(paymentFailure(`Invalid contribute type ${state.page.form.contributionType}`));
    }
  };


export {
  updateContributionType,
  updatePaymentMethod,
  updateFirstName,
  updateLastName,
  updateEmail,
  updateState,
  updateUserFormData,
  isPaymentReady,
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
  updatePassword,
  createOneOffPayPalPayment,
};
