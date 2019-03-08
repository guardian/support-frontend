// @flow

import type { Option } from 'helpers/types/option';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Dispatch } from 'redux';
import type { Action } from 'pages/digital-subscription-checkout/digitalSubscriptionCheckoutActions';
import { getFormFields, setFormErrors } from 'pages/digital-subscription-checkout/digitalSubscriptionCheckoutActions';
import type {
  FormField,
  FormFields,
  State,
} from 'pages/digital-subscription-checkout/digitalSubscriptionCheckoutReducer';
import type { FormError } from 'helpers/subscriptionsForms/validation';

import { formError, nonEmptyString, notNull, validate } from 'helpers/subscriptionsForms/validation';



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

const formIsValid = (state: State): boolean => {
  const errors = getErrors(getFormFields(state));
  return errors.length === 0;
};

function validateForm(dispatch: Dispatch<Action>, state: State) {
  const errors = getErrors(getFormFields(state));
  const valid = errors.length === 0;
  if (!valid) {
    dispatch(setFormErrors(errors));
  }
  return valid;
}

export { validateForm, formIsValid, getErrors };
