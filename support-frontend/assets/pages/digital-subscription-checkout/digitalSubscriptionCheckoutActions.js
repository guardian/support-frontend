// @flow
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import { getFormFields } from './digitalSubscriptionCheckoutReducer';
import { postRegularPaymentRequest } from '../../helpers/paymentIntegrations/readerRevenueApis';
import trackConversion from '../../helpers/tracking/conversions';
import type { ErrorReason } from '../../helpers/errorReasons';

// Action Types
const PAYMENT_WAITING = 'PAYMENT_WAITING';
const PAYMENT_SUCCESS = 'PAYMENT_SUCCESS';
const PAYMENT_FAILURE = 'PAYMENT_FAILURE';
const SET_GUEST_ACCOUNT_CREATION_TOKEN = 'SET_GUEST_ACCOUNT_CREATION_TOKEN';
const SET_THANK_YOU_PAGE_STAGE = 'SET_THANK_YOU_PAGE_STAGE';


export type Action =
  | { type: PAYMENT_SUCCESS }
  | { type: PAYMENT_WAITING, isWaiting: boolean }
  | { type: PAYMENT_FAILURE, paymentError: ErrorReason }


export const paymentSuccess = (): Action => ({ type: PAYMENT_SUCCESS });

export const paymentWaiting = (isWaiting: boolean): Action => ({ type: PAYMENT_WAITING, isWaiting });

export const paymentFailure = (paymentError: ErrorReason): Action => ({ type: PAYMENT_FAILURE, paymentError });

export const setGuestAccountCreationToken = (guestAccountCreationToken: string): Action =>
  ({ type: SET_GUEST_ACCOUNT_CREATION_TOKEN, guestAccountCreationToken });

export const setThankYouPageStage = (thankYouPageStage: ThankYouPageStage): Action =>
  ({ type: SET_THANK_YOU_PAGE_STAGE, thankYouPageStage });

export const setPayPalHasLoaded = (): Action => ({ type: 'SET_PAYPAL_HAS_LOADED' });

// A PaymentResult represents the end state of the checkout process,
// standardised across payment methods & contribution types.
// This will execute at the end of every checkout, with the exception
// of PayPal one-off where this happens on the backend after the user is redirected to our site.
const onPaymentResult = (paymentResult: Promise<PaymentResult>) =>
  (dispatch: Dispatch<Action>, getState: () => State): Promise<PaymentResult> =>
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
      return result;
    });


function recurringPaymentAuthorisationHandler(
  dispatch: Dispatch<Action>,
  state: State,
  // paymentAuthorisation: PaymentAuthorisation,
): Promise<PaymentResult> {
  // const request = regularPaymentRequestFromAuthorisation(paymentAuthorisation, state);
  const request = getFormFields(state);

  return dispatch(onPaymentResult(postRegularPaymentRequest(
    // routes.recurringContribCreate,
    'digital-subscription-creation-route',
    request,
    state.common.abParticipations,
    state.page.csrf,
    (token: string) => dispatch(setGuestAccountCreationToken(token)),
    (thankYouPageStage: ThankYouPageStage) => dispatch(setThankYouPageStage(thankYouPageStage)),
  )));
}


export const onThirdPartyPaymentAuthorised = (paymentAuthorisation: PaymentAuthorisation) =>
  (dispatch: Function, getState: () => State): Promise<PaymentResult> => {
    const state = getState();
    return recurringPaymentAuthorisationHandler(
      dispatch,
      state,
      paymentAuthorisation,
    );
  };


export const onPaymentAuthorisation = (paymentAuthorisation: PaymentAuthorisation) => {
  return (dispatch) => {
    dispatch(paymentWaiting(true));
    dispatch(onThirdPartyPaymentAuthorised(paymentAuthorisation));
  };
};
