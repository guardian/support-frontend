// @flow
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { FormField, Stage, State } from 'pages/digital-subscription-checkout/digitalSubscriptionCheckoutReducer';
import type { Action as DDAction } from 'components/directDebit/directDebitActions';
import type { DigitalBillingPeriod } from 'helpers/billingPeriods';
import { showPayPal } from 'helpers/paymentIntegrations/payPalRecurringCheckout';
import type { Action as PayPalAction } from 'helpers/paymentIntegrations/payPalActions';
import { onPaymentAuthorised } from 'pages/digital-subscription-checkout/helpers/paymentProviders';
import type { Dispatch } from 'redux';
import { setFormSubmissionDependentValue } from 'pages/digital-subscription-checkout/checkoutFormIsSubmittableActions';
import { getFormFields } from './digitalSubscriptionCheckoutReducer';
import type { ErrorReason } from '../../helpers/errorReasons';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { PayPal } from 'helpers/paymentMethods';
import type { Action as AddressAction } from 'pages/paper-subscription-checkout/components-checkout/addressFieldsStore';

export type Action =
  | { type: 'SET_STAGE', stage: Stage }
  | { type: 'SET_FIRST_NAME', firstName: string }
  | { type: 'SET_LAST_NAME', lastName: string }
  | { type: 'SET_TELEPHONE', telephone: string }
  | { type: 'SET_BILLING_PERIOD', billingPeriod: DigitalBillingPeriod }
  | { type: 'SET_PAYMENT_METHOD', paymentMethod: PaymentMethod, country: IsoCountry }
  | { type: 'SET_FORM_ERRORS', errors: FormError<FormField>[] }
  | { type: 'SET_SUBMISSION_ERROR', error: ErrorReason }
  | { type: 'SET_FORM_SUBMITTED', formSubmitted: boolean }
  | AddressAction
  | PayPalAction
  | DDAction;


// ----- Action Creators ----- //

const setStage = (stage: Stage): Action => ({ type: 'SET_STAGE', stage });
const setFormErrors = (errors: Array<FormError<FormField>>): Action => ({ type: 'SET_FORM_ERRORS', errors });
const setSubmissionError = (error: ErrorReason): Action => ({ type: 'SET_SUBMISSION_ERROR', error });
const setFormSubmitted = (formSubmitted: boolean) => ({ type: 'SET_FORM_SUBMITTED', formSubmitted });

const formActionCreators = {
  setFirstName: (firstName: string): Function => (setFormSubmissionDependentValue(() => ({ type: 'SET_FIRST_NAME', firstName }))),
  setLastName: (lastName: string): Function => (setFormSubmissionDependentValue(() => ({ type: 'SET_LAST_NAME', lastName }))),
  setTelephone: (telephone: string): Action => ({ type: 'SET_TELEPHONE', telephone }),
  setBillingPeriod: (billingPeriod: DigitalBillingPeriod): Action => ({ type: 'SET_BILLING_PERIOD', billingPeriod }),
  setPaymentMethod: (paymentMethod: PaymentMethod) => (dispatch: Dispatch<Action>, getState: () => State) => {
    const state = getState();
    if (paymentMethod === PayPal && !state.page.checkout.payPalHasLoaded) {
      showPayPal(dispatch);
    }
    return dispatch({
      type: 'SET_PAYMENT_METHOD',
      paymentMethod,
      country: state.common.internationalisation.countryId,
    });
  },

  onPaymentAuthorised: (authorisation: PaymentAuthorisation) =>
    (dispatch: Dispatch<Action>, getState: () => State) => onPaymentAuthorised(authorisation, dispatch, getState()),
};

export type FormActionCreators = typeof formActionCreators;

export {
  setStage,
  setFormErrors,
  getFormFields,
  setSubmissionError,
  setFormSubmitted,
  formActionCreators,
};
