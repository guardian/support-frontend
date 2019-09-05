// @flow

import type { Option } from 'helpers/types/option';
import type { Title } from 'helpers/user/details';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { PayPal } from 'helpers/paymentMethods';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import type { ErrorReason } from 'helpers/errorReasons';
import type { FormField, Stage } from './formFields';
import type { BillingPeriod } from 'helpers/billingPeriods';
import * as storage from 'helpers/storage';
import {
  trackPaymentMethodSelected,
  trackThankYouPageLoaded,
} from 'helpers/tracking/behaviour';
import { showPayPal } from 'helpers/paymentIntegrations/payPalRecurringCheckout';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Action as DDAction } from 'components/directDebit/directDebitActions';
import type { Action as PayPalAction } from 'helpers/paymentIntegrations/payPalActions';
import type { Action as AddressAction } from 'components/subscriptionCheckouts/address/addressFieldsStore';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { onPaymentAuthorised } from 'helpers/subscriptionsForms/submit';
import { setFormSubmissionDependentValue } from 'helpers/subscriptionsForms/checkoutFormIsSubmittableActions';
import type { SubscriptionProduct } from 'helpers/subscriptions';

export type Action =
  | { type: 'SET_STAGE', stage: Stage }
  | { type: 'SET_TITLE', title: Option<Title> }
  | { type: 'SET_FIRST_NAME', firstName: string }
  | { type: 'SET_LAST_NAME', lastName: string }
  | { type: 'SET_TELEPHONE', telephone: string }
  | { type: 'SET_TITLE_GIFT', titleGiftRecipient: Option<Title> }
  | { type: 'SET_FIRST_NAME_GIFT', firstNameGiftRecipient: string }
  | { type: 'SET_LAST_NAME_GIFT', lastNameGiftRecipient: string }
  | { type: 'SET_EMAIL_GIFT', emailGiftRecipient: string }
  | { type: 'SET_COUNTRY_CHANGED', country: IsoCountry }
  | { type: 'SET_START_DATE', startDate: string }
  | { type: 'SET_BILLING_PERIOD', billingPeriod: BillingPeriod }
  | { type: 'SET_PAYMENT_METHOD', paymentMethod: PaymentMethod }
  | { type: 'SET_FORM_ERRORS', errors: FormError<FormField>[] }
  | { type: 'SET_SUBMISSION_ERROR', error: ErrorReason }
  | { type: 'SET_FORM_SUBMITTED', formSubmitted: boolean }
  | { type: 'SET_BILLING_ADDRESS_IS_SAME', isSame: Option<boolean> }
  | { type: 'SET_ORDER_IS_GIFT', orderIsAGift: Option<boolean>}
  | { type: 'SET_STRIPE_TOKEN', stripeToken: Option<string> }
  | AddressAction
  | PayPalAction
  | DDAction;

// ----- Action Creators ----- //

const setStage = (
  stage: Stage,
  product: SubscriptionProduct,
  paymentMethod: ?PaymentMethod,
): Action => {
  if (stage === 'thankyou' || stage === 'thankyou-pending') {
    trackThankYouPageLoaded(product, paymentMethod);
  }
  return { type: 'SET_STAGE', stage };
};
const setFormErrors = (errors: Array<FormError<FormField>>): Action => ({
  type: 'SET_FORM_ERRORS',
  errors,
});
const setSubmissionError = (error: ErrorReason): Action => ({
  type: 'SET_SUBMISSION_ERROR',
  error,
});
const setFormSubmitted = (formSubmitted: boolean) => ({
  type: 'SET_FORM_SUBMITTED',
  formSubmitted,
});

const formActionCreators = {
  setTitle: (title: string): Action => ({ type: 'SET_TITLE', title }),
  setFirstName: (firstName: string): Function => (setFormSubmissionDependentValue(() => ({ type: 'SET_FIRST_NAME', firstName }))),
  setLastName: (lastName: string): Function => (setFormSubmissionDependentValue(() => ({ type: 'SET_LAST_NAME', lastName }))),
  setTelephone: (telephone: string): Action => ({ type: 'SET_TELEPHONE', telephone }),
  setTitleGift: (titleGiftRecipient: string): Action => ({ type: 'SET_TITLE_GIFT', titleGiftRecipient }),
  setFirstNameGift: (firstNameGiftRecipient: string): Function => (setFormSubmissionDependentValue(() => ({ type: 'SET_FIRST_NAME_GIFT', firstNameGiftRecipient }))),
  setLastNameGift: (lastNameGiftRecipient: string): Function => (setFormSubmissionDependentValue(() => ({ type: 'SET_LAST_NAME_GIFT', lastNameGiftRecipient }))),
  setEmailGift: (emailGiftRecipient: string): Action => ({ type: 'SET_EMAIL_GIFT', emailGiftRecipient }),
  setStartDate: (startDate: string): Action => ({ type: 'SET_START_DATE', startDate }),
  setBillingPeriod: (billingPeriod: BillingPeriod): Action => ({ type: 'SET_BILLING_PERIOD', billingPeriod }),
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
  setBillingAddressIsSame: (isSame: boolean | null): Action => ({
    type: 'SET_BILLING_ADDRESS_IS_SAME',
    isSame,
  }),
  onPaymentAuthorised: (authorisation: PaymentAuthorisation) =>
    (dispatch: Dispatch<Action>, getState: () => CheckoutState) => {
      const state = getState();
      onPaymentAuthorised(
        authorisation,
        dispatch,
        state,
      );
    },
  setGiftStatus: (orderIsAGift: boolean | null): Action => ({
    type: 'SET_ORDER_IS_GIFT',
    orderIsAGift,
  }),
  setStripeToken: (stripeToken: Option<string>): Action => ({
    type: 'SET_STRIPE_TOKEN',
    stripeToken,
  }),
};

export type FormActionCreators = typeof formActionCreators;

export {
  setStage,
  setFormErrors,
  setSubmissionError,
  setFormSubmitted,
  formActionCreators,
};
