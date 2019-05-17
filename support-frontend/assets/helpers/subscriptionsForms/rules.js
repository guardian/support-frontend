// @flow

import { formError, nonEmptyString, notNull, validate } from './validation';
import type { FormField, FormFields } from './formFields';
import type { FormError } from './validation';

function applyCheckoutRules(fields: FormFields): FormError<FormField>[] {
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
      rule: notNull(fields.paymentMethod),
      error: formError('paymentMethod', 'Please select a payment method.'),
    },
  ]);
}

function applyDeliveryRules(fields: FormFields): FormError<FormField>[] {
  return validate([
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

export { applyCheckoutRules, applyDeliveryRules };
