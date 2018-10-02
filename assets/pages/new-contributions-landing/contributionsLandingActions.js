// @flow

// ----- Imports ----- //

import { type PaymentMethod, type PaymentHandler } from 'helpers/checkouts';
import { type Amount, type Contrib } from 'helpers/contributions';
import { type UsState, type CaState } from 'helpers/internationalisation/country';
import {
  type PaymentAuthorisation,
  type PaymentFields,
  type PaymentResult,
  type PaymentDetails,
  type StripeOneOffPaymentFields,
  PaymentSuccess,
  postRegularPaymentRequest,
} from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import {
  postOneOffStripeExecutePaymentRequest,
  postOneOffPayPalCreatePaymentRequest,
  type PaymentApiResponse,
  type PayPalApiError,
  type PayPalPaymentSuccess,
  type CreatePaypalPaymentData,
} from 'helpers/paymentIntegrations/newPaymentFlow/oneOffContributions';
import { derivePaymentApiAcquisitionData, getSupportAbTests, getOphanIds } from 'helpers/tracking/acquisitions';
import trackConversion from 'helpers/tracking/conversions';
import { type State, type UserFormData } from './contributionsLandingReducer';

export type Action =
  | { type: 'UPDATE_CONTRIBUTION_TYPE', contributionType: Contrib, paymentMethodToSelect: PaymentMethod }
  | { type: 'UPDATE_PAYMENT_METHOD', paymentMethod: PaymentMethod }
  | { type: 'UPDATE_FIRST_NAME', firstName: string }
  | { type: 'UPDATE_LAST_NAME', lastName: string }
  | { type: 'UPDATE_EMAIL', email: string }
  | { type: 'UPDATE_STATE', state: UsState | CaState | null }
  | { type: 'UPDATE_USER_FORM_DATA', userFormData: UserFormData }
  | { type: 'UPDATE_PAYMENT_READY', paymentReady: boolean, paymentHandler: ?{ [PaymentMethod]: PaymentHandler } }
  | { type: 'SELECT_AMOUNT', amount: Amount | 'other', contributionType: Contrib }
  | { type: 'UPDATE_OTHER_AMOUNT', otherAmount: string }
  | { type: 'PAYMENT_RESULT', paymentResult: Promise<PaymentResult> }
  | { type: 'PAYMENT_FAILURE', error: string }
  | { type: 'PAYMENT_WAITING', isWaiting: boolean }
  | { type: 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED' }
  | { type: 'SET_GUEST_ACCOUNT_CREATION_TOKEN', guestAccountCreationToken: string }
  | { type: 'PAYMENT_SUCCESS' };

const updateContributionType = (contributionType: Contrib, paymentMethodToSelect: PaymentMethod): Action =>
  ({ type: 'UPDATE_CONTRIBUTION_TYPE', contributionType, paymentMethodToSelect });

const updatePaymentMethod = (paymentMethod: PaymentMethod): Action =>
  ({ type: 'UPDATE_PAYMENT_METHOD', paymentMethod });

const updateFirstName = (firstName: string): Action => ({ type: 'UPDATE_FIRST_NAME', firstName });

const updateLastName = (lastName: string): Action => ({ type: 'UPDATE_LAST_NAME', lastName });

const updateEmail = (email: string): Action => ({ type: 'UPDATE_EMAIL', email });

const updateUserFormData = (userFormData: UserFormData): Action => ({ type: 'UPDATE_USER_FORM_DATA', userFormData });

const updateState = (state: UsState | CaState | null): Action => ({ type: 'UPDATE_STATE', state });

const selectAmount = (amount: Amount | 'other', contributionType: Contrib): Action =>
  ({
    type: 'SELECT_AMOUNT', amount, contributionType,
  });

const setCheckoutFormHasBeenSubmitted = (): Action => ({ type: 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED' });

const updateOtherAmount = (otherAmount: string): Action => ({ type: 'UPDATE_OTHER_AMOUNT', otherAmount });

const paymentSuccess = (): Action => ({ type: 'PAYMENT_SUCCESS' });

const paymentWaiting = (isWaiting: boolean): Action => ({ type: 'PAYMENT_WAITING', isWaiting });

const paymentFailure = (error: string): Action => ({ type: 'PAYMENT_FAILURE', error });

const setGuestAccountCreationToken = (guestAccountCreationToken: string): Action =>
  ({ type: 'SET_GUEST_ACCOUNT_CREATION_TOKEN', guestAccountCreationToken });

const isPaymentReady = (paymentReady: boolean, paymentHandler: ?{ [PaymentMethod]: PaymentHandler }): Action =>
  ({ type: 'UPDATE_PAYMENT_READY', paymentReady, paymentHandler: paymentHandler || null });

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

const setupRegularPayment = (data: PaymentFields) =>
  (dispatch: Dispatch<Action>, getState: () => State): void => {
    const state = getState();

    switch (state.page.form.paymentMethod) {
      case 'Stripe':
      case 'DirectDebit':
        dispatch(onPaymentResult(postRegularPaymentRequest(
          data,
          state.common.abParticipations,
          state.page.csrf,
          token => dispatch(setGuestAccountCreationToken(token)),
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

const executeStripeOneOffPayment = (data: StripeOneOffPaymentFields) =>
  (dispatch: Dispatch<Action>): void => {
    dispatch(onPaymentResult(postOneOffStripeExecutePaymentRequest(data)));
  };

const handleCreateOneOffPayPalPaymentResponse =
  (paymentResult: Promise<PaymentApiResponse<PayPalApiError, PayPalPaymentSuccess>>) =>
    (dispatch: Dispatch<Action>, getState: () => State): void => {
      paymentResult.then((result) => {
        const state = getState();
        if (result.type === 'success') {
          trackConversion(state.common.abParticipations, '/contribute/thankyou.new');
          window.location.href = result.data.approvalUrl;
        }
        // TODO: handle error
        // dispatch(paymentFailure('No payment method selected'));
      });
    };

const createOneOffPayPalPayment = (data: CreatePaypalPaymentData) =>
  (dispatch: Dispatch<Action>): void => {
    dispatch(handleCreateOneOffPayPalPaymentResponse(postOneOffPayPalCreatePaymentRequest(data)));
  };

const getAmount = (state: State) =>
  parseFloat(state.page.form.selectedAmounts[state.page.form.contributionType] === 'other'
    ? state.page.form.formData.otherAmounts[state.page.form.contributionType].amount
    : state.page.form.selectedAmounts[state.page.form.contributionType].value);

const makeStripeOneOffPaymentData = (token: PaymentAuthorisation, state: State): StripeOneOffPaymentFields => ({
  contributionType: 'oneoff',
  fields: {
    paymentData: {
      currency: state.common.internationalisation.currencyId,
      amount: getAmount(state),
      token: token.paymentMethod === 'Stripe' ? token.token : '',
      email: state.page.form.formData.email || '',
    },
    acquisitionData: derivePaymentApiAcquisitionData(
      state.common.referrerAcquisitionData,
      state.common.abParticipations,
      state.common.optimizeExperiments,
    ),
  },
});

function paymentDetailsFromAuthorisation(authorisation: PaymentAuthorisation): PaymentDetails {
  switch (authorisation.paymentMethod) {
    case 'Stripe': return { stripeToken: authorisation.token };
    case 'PayPal': return { baid: authorisation.token };
    case 'DirectDebit': return {
      accountHolderName: authorisation.accountHolderName,
      sortCode: authorisation.sortCode,
      accountNumber: authorisation.accountNumber,
    };
    // TODO: what is a sane way to handle such cases?
    default: throw new Error('If Flow works, this cannot happen');
  }
}

const makeRegularPaymentData = (authorisation: PaymentAuthorisation, state: State): PaymentFields => ({
  contributionType: 'regular',
  fields: {
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
    paymentFields: paymentDetailsFromAuthorisation(authorisation),
    ophanIds: getOphanIds(),
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    supportAbTests: getSupportAbTests(state.common.abParticipations, state.common.optimizeExperiments),
  },
});

const onThirdPartyPaymentAuthorised = (paymentAuthorisation: PaymentAuthorisation) =>
  (dispatch: Dispatch<Action>, getState: () => State): void => {
    const state = getState();

    switch (state.page.form.contributionType) {
      case 'ONE_OFF':
        // Why no mention of PayPal?
        // Executing a one-off PayPal payment happens on the backend in the /paypal/rest/return
        // endpoint, after PayPal redirects the browser back to our site.
        if (state.page.form.paymentMethod === 'Stripe') {
          dispatch(executeStripeOneOffPayment(makeStripeOneOffPaymentData(paymentAuthorisation, state)));
        }
        return;

      case 'ANNUAL':
      case 'MONTHLY':
        dispatch(setupRegularPayment(makeRegularPaymentData(paymentAuthorisation, state)));
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
  createOneOffPayPalPayment,
};
