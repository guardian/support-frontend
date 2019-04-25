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

function isPostcodeOptional(country: Option<IsoCountry>): boolean {
  return country !== 'GB' && country !== 'AU' && country !== 'US' && country !== 'CA';
}

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
    {
      rule: nonEmptyString(fields.address.fields.lineOne),
      error: formError('addressLine1', 'Please enter a value'),
    },
    {
      rule: nonEmptyString(fields.address.fields.city),
      error: formError('townCity', 'Please enter a value'),
    },
    {
      rule: isPostcodeOptional(fields.address.fields.country) || nonEmptyString(fields.postcode),
      error: formError('postcode', 'Please enter a value'),
    },
    {
      rule: notNull(fields.address.fields.country),
      error: formError('country', 'Please select a country.'),
    },
    {
      rule: fields.address.fields.country === 'US' || fields.address.fields.country === 'CA' || fields.address.fields.country === 'AU' ? notNull(fields.address.fields.stateProvince) : true,
      error: formError(
        'stateProvince',
        fields.address.fields.country === 'CA' ? 'Please select a province/territory.' : 'Please select a state.',
      ),
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

export { isPostcodeOptional, validateForm, formIsValid, getErrors };
