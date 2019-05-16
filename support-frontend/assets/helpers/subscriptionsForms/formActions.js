// @flow

import type { Option } from 'helpers/types/option';
import type { Title } from 'helpers/user/details';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { PayPal } from 'helpers/paymentMethods';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import type { ErrorReason } from 'helpers/errorReasons';
import type { FormField, Stage } from './formFields';
import type { BillingPeriod, DigitalBillingPeriod } from 'helpers/billingPeriods';
import { setFormSubmissionDependentValue } from 'pages/digital-subscription-checkout/checkoutFormIsSubmittableActions';
import * as storage from 'helpers/storage';
import { trackPaymentMethodSelected } from 'helpers/tracking/ophanComponentEventTracking';
import { showPayPal } from 'helpers/paymentIntegrations/payPalRecurringCheckout';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import { onPaymentAuthorised } from 'pages/digital-subscription-checkout/helpers/paymentProviders';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Action as DDAction } from 'components/directDebit/directDebitActions';
import type { Action as PayPalAction } from 'helpers/paymentIntegrations/payPalActions';
import type { Action as AddressAction } from 'components/subscriptionCheckouts/address/addressFieldsStore';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';

export type Action =
  | { type: 'SET_STAGE', stage: Stage }
  | { type: 'SET_TITLE', title: Option<Title> }
  | { type: 'SET_FIRST_NAME', firstName: string }
  | { type: 'SET_LAST_NAME', lastName: string }
  | { type: 'SET_TELEPHONE', telephone: string }
  | { type: 'SET_COUNTRY_CHANGED', country: IsoCountry }
  | { type: 'SET_START_DATE', startDate: string }
  | { type: 'SET_BILLING_PERIOD', billingPeriod: BillingPeriod }
  | { type: 'SET_PAYMENT_METHOD', paymentMethod: PaymentMethod }
  | { type: 'SET_FORM_ERRORS', errors: FormError<FormField>[] }
  | { type: 'SET_SUBMISSION_ERROR', error: ErrorReason }
  | { type: 'SET_FORM_SUBMITTED', formSubmitted: boolean }
  | { type: 'SET_BILLING_ADDRESS_IS_SAME', isSame: Option<boolean>}
  | AddressAction
  | PayPalAction
  | DDAction;


// ----- Action Creators ----- //

const setStage = (stage: Stage): Action => ({ type: 'SET_STAGE', stage });
const setFormErrors = (errors: Array<FormError<FormField>>): Action => ({ type: 'SET_FORM_ERRORS', errors });
const setSubmissionError = (error: ErrorReason): Action => ({ type: 'SET_SUBMISSION_ERROR', error });
const setFormSubmitted = (formSubmitted: boolean) => ({ type: 'SET_FORM_SUBMITTED', formSubmitted });

const formActionCreators = {
  setTitle: (title: string): Action => ({ type: 'SET_TITLE', title }),
  setFirstName: (firstName: string): Function => (setFormSubmissionDependentValue(() => ({ type: 'SET_FIRST_NAME', firstName }))),
  setLastName: (lastName: string): Function => (setFormSubmissionDependentValue(() => ({ type: 'SET_LAST_NAME', lastName }))),
  setTelephone: (telephone: string): Action => ({ type: 'SET_TELEPHONE', telephone }),
  setStartDate: (startDate: string): Action => ({ type: 'SET_START_DATE', startDate }),
  setBillingPeriod: (billingPeriod: DigitalBillingPeriod): Action => ({ type: 'SET_BILLING_PERIOD', billingPeriod }),
  setPaymentMethod: (paymentMethod: PaymentMethod) => (dispatch: Dispatch<Action>, getState: () => CheckoutState) => {
    const state = getState();
    storage.setSession('selectedPaymentMethod', paymentMethod);
    trackPaymentMethodSelected(paymentMethod);
    if (paymentMethod === PayPal && !state.page.checkout.payPalHasLoaded) {
      showPayPal(dispatch);
    }
    return dispatch({
      type: 'SET_PAYMENT_METHOD',
      paymentMethod,
      country: state.common.internationalisation.countryId,
    });
  },
  setBillingAddressIsSame: (isSame: boolean | null): Action => ({ type: 'SET_BILLING_ADDRESS_IS_SAME', isSame }),
  onPaymentAuthorised: (authorisation: PaymentAuthorisation) =>
    (dispatch: Dispatch<Action>, getState: () => CheckoutState) =>
      onPaymentAuthorised(authorisation, dispatch, getState()),
};


export type FormActionCreators = typeof formActionCreators;

export {
  setStage,
  setFormErrors,
  setSubmissionError,
  setFormSubmitted,
  formActionCreators,
};
