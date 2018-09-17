// @flow

// ----- Imports ----- //

import { type PaymentMethod, type PaymentHandler } from 'helpers/checkouts';
import { type Amount, type Contrib } from 'helpers/contributions';
import { type UsState, type CaState } from 'helpers/internationalisation/country';
import { type Token, type PaymentFields, type PaymentResult, PaymentSuccess, postOneOffStripeRequest, postRegularStripeRequest } from 'helpers/paymentIntegrations/readerRevenueApis';
import { derivePaymentApiAcquisitionData, getSupportAbTests, getOphanIds } from 'helpers/tracking/acquisitions';
import trackConversion from 'helpers/tracking/conversions';
import { type State } from './contributionsLandingReducer';

export type FieldName = 'otherAmount' | 'email' | 'lastName' | 'firstName';

export type Action =
  | { type: 'UPDATE_CONTRIBUTION_TYPE', contributionType: Contrib }
  | { type: 'UPDATE_PAYMENT_METHOD', paymentMethod: PaymentMethod }
  | { type: 'UPDATE_FIRST_NAME', firstName: string }
  | { type: 'UPDATE_LAST_NAME', lastName: string }
  | { type: 'UPDATE_EMAIL', email: string }
  | { type: 'UPDATE_STATE', state: UsState | CaState | null }
  | { type: 'UPDATE_PAYMENT_READY', paymentReady: boolean, paymentHandler: ?{ [PaymentMethod]: PaymentHandler } }
  | { type: 'UPDATE_BLURRED', field: FieldName }
  | { type: 'SELECT_AMOUNT', amount: Amount | 'other', contributionType: Contrib }
  | { type: 'UPDATE_OTHER_AMOUNT', otherAmount: string }
  | { type: 'PAYMENT_RESULT', paymentResult: Promise<PaymentResult> }
  | { type: 'PAYMENT_FAILURE', error: string }
  | { type: 'PAYMENT_WAITING', isWaiting: boolean }
  | { type: 'PAYMENT_SUCCESS' };

const updateContributionType = (contributionType: Contrib): Action =>
  ({ type: 'UPDATE_CONTRIBUTION_TYPE', contributionType });

const updatePaymentMethod = (paymentMethod: PaymentMethod): Action =>
  ({ type: 'UPDATE_PAYMENT_METHOD', paymentMethod });

const updateFirstName = (firstName: string): Action => ({ type: 'UPDATE_FIRST_NAME', firstName });

const updateLastName = (lastName: string): Action => ({ type: 'UPDATE_LAST_NAME', lastName });

const updateEmail = (email: string): Action => ({ type: 'UPDATE_EMAIL', email });

const updateState = (state: UsState | CaState | null): Action => ({ type: 'UPDATE_STATE', state });

const updateBlurred = (field: FieldName): Action => ({ type: 'UPDATE_BLURRED', field });

const selectAmount = (amount: Amount | 'other', contributionType: Contrib): Action =>
  ({
    type: 'SELECT_AMOUNT', amount, contributionType,
  });

const updateOtherAmount = (otherAmount: string): Action => ({ type: 'UPDATE_OTHER_AMOUNT', otherAmount });

const paymentSuccess = (): Action => ({ type: 'PAYMENT_SUCCESS' });

const paymentWaiting = (isWaiting: boolean): Action => ({ type: 'PAYMENT_WAITING', isWaiting });

const paymentFailure = (error: string): Action => ({ type: 'PAYMENT_FAILURE', error });

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

const sendData = (data: PaymentFields) =>
  (dispatch: Dispatch<Action>, getState: () => State): void => {
    const state = getState();

    switch (state.page.form.paymentMethod) {
      case 'Stripe':
        switch (state.page.form.contributionType) {
          case 'ONE_OFF':
            dispatch(onPaymentResult(postOneOffStripeRequest(data)));
            return;

          default:
            dispatch(onPaymentResult(postRegularStripeRequest(data, state.common.abParticipations, state.page.csrf)));
            return;
        }

      case 'PayPal':
        // TODO
        dispatch(onPaymentResult(Promise.resolve(PaymentSuccess)));
        return;

      case 'DirectDebit':
      default:
        // TODO
        dispatch(onPaymentResult(Promise.resolve(PaymentSuccess)));

    }
  };

const getAmount = (state: State) =>
  parseFloat(state.page.form.selectedAmounts[state.page.form.contributionType] === 'other'
    ? state.page.form.formData.otherAmount
    : state.page.form.selectedAmounts[state.page.form.contributionType].value);

const makeOneOffPaymentData: (Token, State) => PaymentFields = (token, state) => ({
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

const makeRegularPaymentData: (Token, State) => PaymentFields = (token, state) => ({
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
    paymentFields: token.paymentMethod === 'Stripe'
      ? { stripeToken: token.token }
      : { baid: '' },
    ophanIds: getOphanIds(),
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    supportAbTests: getSupportAbTests(state.common.abParticipations, state.common.optimizeExperiments),
  },
});

const onThirdPartyPaymentDone = (token: Token) =>
  (dispatch: Dispatch<Action>, getState: () => State): void => {
    const state = getState();

    switch (state.page.form.contributionType) {
      case 'ONE_OFF':
        dispatch(sendData(makeOneOffPaymentData(token, state)));
        return;

      default:
        dispatch(sendData(makeRegularPaymentData(token, state)));

    }
  };

export {
  updateContributionType,
  updatePaymentMethod,
  updateFirstName,
  updateLastName,
  updateEmail,
  updateState,
  updateBlurred,
  isPaymentReady,
  selectAmount,
  updateOtherAmount,
  paymentFailure,
  paymentWaiting,
  paymentSuccess,
  onThirdPartyPaymentDone,
};
