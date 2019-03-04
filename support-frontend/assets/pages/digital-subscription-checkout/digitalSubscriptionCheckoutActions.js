// @flow
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { FormField, Stage, State } from 'pages/digital-subscription-checkout/digitalSubscriptionCheckoutReducer';
import type { Action as DDAction } from 'components/directDebit/directDebitActions';
import type { DigitalBillingPeriod } from 'helpers/billingPeriods';
import { showPayPal } from 'pages/digital-subscription-checkout/helpers/payPal';
import { fromString } from 'helpers/internationalisation/country';
import { onPaymentAuthorised } from 'pages/digital-subscription-checkout/helpers/paymentProviders';
import { setCountry } from 'helpers/page/commonActions';
import type { Dispatch } from 'redux';
import type { Action as CommonAction } from 'helpers/page/commonActions';
import { setFormSubmissionDependentValue } from 'pages/digital-subscription-checkout/checkoutFormIsSubmittableActions';
import type { PaymentMethod } from './digitalSubscriptionCheckoutReducer';
import { getFormFields } from './digitalSubscriptionCheckoutReducer';
import type { ErrorReason } from '../../helpers/errorReasons';


export type Action =
  | { type: 'SET_STAGE', stage: Stage }
  | { type: 'SET_FIRST_NAME', firstName: string }
  | { type: 'SET_LAST_NAME', lastName: string }
  | { type: 'SET_ADDRESS_LINE_1', addressLine1: string }
  | { type: 'SET_ADDRESS_LINE_2', addressLine2: string }
  | { type: 'SET_TOWN_CITY', townCity: string }
  | { type: 'SET_COUNTY', county: string }
  | { type: 'SET_COUNTRY', country: string }
  | { type: 'SET_POSTCODE', postcode: string }
  | { type: 'SET_TELEPHONE', telephone: string }
  | { type: 'SET_STATE_PROVINCE', stateProvince: string, country: IsoCountry }
  | { type: 'SET_BILLING_PERIOD', billingPeriod: DigitalBillingPeriod }
  | { type: 'SET_PAYMENT_METHOD', paymentMethod: PaymentMethod, country: IsoCountry }
  | { type: 'SET_COUNTRY_CHANGED', country: IsoCountry }
  | { type: 'SET_FORM_ERRORS', errors: FormError<FormField>[] }
  | { type: 'SET_SUBMISSION_ERROR', error: ErrorReason }
  | { type: 'SET_FORM_SUBMITTED', formSubmitted: boolean }
  | { type: 'SET_PAYPAL_HAS_LOADED' }
  | DDAction;


// ----- Action Creators ----- //

const setStage = (stage: Stage): Action => ({ type: 'SET_STAGE', stage });
const setFormErrors = (errors: Array<FormError<FormField>>): Action => ({ type: 'SET_FORM_ERRORS', errors });
const setSubmissionError = (error: ErrorReason): Action => ({ type: 'SET_SUBMISSION_ERROR', error });
const setFormSubmitted = (formSubmitted: boolean) => ({ type: 'SET_FORM_SUBMITTED', formSubmitted });
const setPayPalHasLoaded = (): Action => ({ type: 'SET_PAYPAL_HAS_LOADED' });

const formActionCreators = {
  setFirstName: (firstName: string): Function => (setFormSubmissionDependentValue(() => ({ type: 'SET_FIRST_NAME', firstName }))),
  setLastName: (lastName: string): Function => (setFormSubmissionDependentValue(() => ({ type: 'SET_LAST_NAME', lastName }))),
  setTelephone: (telephone: string): Action => ({ type: 'SET_TELEPHONE', telephone }),
  setBillingCountry: (countryRaw: string) => (dispatch: Dispatch<Action | CommonAction>) => {
    const country = fromString(countryRaw);
    if (country) {
      dispatch(setCountry(country));
      dispatch({
        type: 'SET_COUNTRY_CHANGED',
        country,
      });
    }
  },
  setStateProvince: (stateProvince: string) =>
    (dispatch: Dispatch<Action>, getState: () => State) => dispatch({
      type: 'SET_STATE_PROVINCE',
      stateProvince,
      country: getState().common.internationalisation.countryId,
    }),
  setAddressLine1: (addressLine1: string): Function => (setFormSubmissionDependentValue(() => ({ type: 'SET_ADDRESS_LINE_1', addressLine1 }))),
  setAddressLine2: (addressLine2: string): Action => ({ type: 'SET_ADDRESS_LINE_2', addressLine2 }),
  setTownCity: (townCity: string): Function => (setFormSubmissionDependentValue(() => ({ type: 'SET_TOWN_CITY', townCity }))),
  setCountry: (country: string): Action => ({ type: 'SET_COUNTRY', country }),
  setCounty: (county: string): Action => ({ type: 'SET_COUNTY', county }),
  setPostcode: (postcode: string): Function => (setFormSubmissionDependentValue(() => ({ type: 'SET_POSTCODE', postcode }))),
  setBillingPeriod: (billingPeriod: DigitalBillingPeriod): Action => ({ type: 'SET_BILLING_PERIOD', billingPeriod }),
  setPaymentMethod: (paymentMethod: PaymentMethod) => (dispatch: Dispatch<Action>, getState: () => State) => {
    if (paymentMethod === 'PayPal') {
      showPayPal(dispatch);
    }
    return dispatch({
      type: 'SET_PAYMENT_METHOD',
      paymentMethod,
      country: getState().common.internationalisation.countryId,
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
  setPayPalHasLoaded,
  formActionCreators,
};
