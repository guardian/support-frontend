// @flow

import type { Dispatch } from 'redux';
import type { Action } from 'pages/digital-subscription-checkout/digitalSubscriptionCheckoutActions';
import { getFormFields, setFormErrors } from 'pages/digital-subscription-checkout/digitalSubscriptionCheckoutActions';
import type { FormField as AddressFormField } from 'pages/paper-subscription-checkout/components-checkout/addressFieldsStore';
import {
  getFormErrors as getAddressFormErrors,
  setFormErrorsFor as setAddressFormErrorsFor,
} from 'pages/paper-subscription-checkout/components-checkout/addressFieldsStore';
import type {
  FormField,
  FormFields,
  State,
} from 'pages/digital-subscription-checkout/digitalSubscriptionCheckoutReducer';
import { getAddressFields } from 'pages/digital-subscription-checkout/digitalSubscriptionCheckoutReducer';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { formError, nonEmptyString, validate } from 'helpers/subscriptionsForms/validation';

function getErrors(fields: FormFields): FormError<FormField>[] {
  return validate([
    {
      rule: nonEmptyString(fields.firstName),
      error: formError('firstName', 'Please enter a value.'),
    },
    {
      rule: nonEmptyString(fields.lastName),
      error: formError('lastName', 'Please enter a value.'),
    },
  ]);
}

const formIsValid = (state: State): boolean => getErrors(getFormFields(state)).length === 0 &&
    getAddressFormErrors(getAddressFields(state)).length === 0;

function validateForm(dispatch: Dispatch<Action>, state: State) {
  type Error<T> = {
    errors: FormError<T>[],
    dispatcher: any => Action,
  }

  const allErrors: (Error<AddressFormField> | Error<FormField>)[] = [
    ({
      errors: getErrors(getFormFields(state)),
      dispatcher: setFormErrors,
    }: Error<FormField>),
    ({
      errors: getAddressFormErrors(getAddressFields(state)),
      dispatcher: setAddressFormErrorsFor('billing'),
    }: Error<AddressFormField>),
  ].filter(({ errors }) => errors.length > 0);

  const valid = allErrors.length === 0;

  if (!valid) {
    allErrors.forEach(({ errors, dispatcher }) => {
      dispatch(dispatcher(errors));
    });
  }
  return valid;
}

export { validateForm, formIsValid, getErrors };
