// @flow

// ----- Imports ----- //

import { type Dispatch } from 'redux';
import { formError, type FormError, nonEmptyString, notNull, validate } from 'helpers/subscriptionsForms/validation';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import {
  buildRegularPaymentRequest,
  onPaymentAuthorised,
  showPaymentMethod,
} from 'pages/weekly-subscription-checkout/helpers/paymentProviders';
import {
  type FormField as AddressFormField,
  applyAddressRules as getAddressFormErrors,
  getFormFields as getAddressFormFields,
  setFormErrorsFor as setAddressFormErrorsFor,
} from 'components/subscriptionCheckouts/address/addressFieldsStore';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import { setFormErrors } from 'helpers/subscriptionsForms/formActions';
import type { FormField, FormFields } from 'helpers/subscriptionsForms/formFields';
import { getFormFields } from 'helpers/subscriptionsForms/formFields';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { getBillingAddress, getDeliveryAddress } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';


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
      errors: getAddressFormErrors(getAddressFormFields(getDeliveryAddress(state))),
      dispatcher: setAddressFormErrorsFor('delivery'),
    }: Error<AddressFormField>),
  ].filter(({ errors }) => errors.length > 0);

  if (!formFields.billingAddressIsSame) {
    allErrors.push(({
      errors: getAddressFormErrors(getAddressFormFields(getBillingAddress(state))),
      dispatcher: setAddressFormErrorsFor('billing'),
    }: Error<AddressFormField>));
  }

  if (allErrors.length > 0) {
    allErrors.forEach(({ errors, dispatcher }) => {
      dispatch(dispatcher(errors));
    });
  } else {
    const testUser = state.page.checkout.isTestUser;

    const { price, currency } = { price: 99.99, currency: 'GBP' };

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
