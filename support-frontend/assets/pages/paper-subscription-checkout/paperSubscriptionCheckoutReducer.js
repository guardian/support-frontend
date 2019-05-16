// @flow

// ----- Imports ----- //

import { type Dispatch } from 'redux';
import { formError, type FormError, nonEmptyString, notNull, validate } from 'helpers/subscriptionsForms/validation';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import { buildRegularPaymentRequest, onPaymentAuthorised, showPaymentMethod } from './helpers/paymentProviders';
import {
  type FormField as AddressFormField,
  getFormErrors as getAddressFormErrors,
  setFormErrorsFor as setAddressFormErrorsFor,
} from 'components/subscriptionCheckouts/address/addressFieldsStore';

import { finalPrice as paperFinalPrice } from 'helpers/productPrice/paperProductPrices';
import type { FormField, FormFields } from 'helpers/subscriptionsForms/formFields';
import { getFormFields } from 'helpers/subscriptionsForms/formFields';
import { type Action, setFormErrors } from 'helpers/subscriptionsForms/formActions';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import {
  getBillingAddressFields,
  getDeliveryAddressFields,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';

// ----- Functions ----- //

function getErrors(fields: FormFields): FormError<FormField>[] {
  return validate([
    {
      rule: nonEmptyString(fields.firstName),
      error: formError('firstName', 'Please enter a first name.'),
    },
    {
      rule: nonEmptyString(fields.lastName),
      error: formError('lastName', 'Please enter a last name.'),
    },
    {
      rule: notNull(fields.startDate),
      error: formError('startDate', 'Please select a start date'),
    },
    {
      rule: notNull(fields.billingAddressIsSame),
      error: formError(
        'billingAddressIsSame',
        'Please indicate whether the billing address is the same as the delivery address',
      ),
    },
    {
      rule: notNull(fields.paymentMethod),
      error: formError('paymentMethod', 'Please select a payment method.'),
    },
  ]);
}

function submitForm(dispatch: Dispatch<Action>, state: WithDeliveryCheckoutState) {

  type Error<T> = {
    errors: FormError<T>[],
    dispatcher: any => Action,
  }

  const formFields: FormFields = getFormFields(state);

  const allErrors: (Error<AddressFormField> | Error<FormField>)[] = [
    ({
      errors: getErrors(formFields),
      dispatcher: setFormErrors,
    }: Error<FormField>),
    ({
      errors: getAddressFormErrors(getDeliveryAddressFields(state)),
      dispatcher: setAddressFormErrorsFor('delivery'),
    }: Error<AddressFormField>),
  ].filter(({ errors }) => errors.length > 0);

  if (!formFields.billingAddressIsSame) {
    allErrors.push(({
      errors: getAddressFormErrors(getBillingAddressFields(state)),
      dispatcher: setAddressFormErrorsFor('billing'),
    }: Error<AddressFormField>));
  }

  if (allErrors.length > 0) {
    allErrors.forEach(({ errors, dispatcher }) => {
      dispatch(dispatcher(errors));
    });
  } else {
    const testUser = state.page.checkout.isTestUser;

    const { price, currency } = paperFinalPrice(
      state.page.checkout.productPrices,
      state.page.checkout.fulfilmentOption,
      state.page.checkout.productOption,
    );

    const onAuthorised = (pa: PaymentAuthorisation) =>
      onPaymentAuthorised(
        dispatch,
        buildRegularPaymentRequest(state, pa),
        state.page.csrf,
        state.common.abParticipations,
      );

    const { paymentMethod, email } = state.page.checkout;

    showPaymentMethod(dispatch, onAuthorised, testUser, price, currency, paymentMethod, email);
  }
}

// ----- Export ----- //

export {
  submitForm,
};
