// @flow

import { formError, nonEmptyString, notNull, validate } from './validation';
import type { FormField, FormFields } from './formFields';
import type { FormError } from './validation';

function applyCheckoutRules(fields: FormFields): FormError<FormField>[] {
  const { orderIsAGift } = fields;
  const userFormFields = [
    {
      rule: nonEmptyString(fields.firstName),
      error: formError('firstName', 'Please enter a first name.'),
    },
    {
      rule: nonEmptyString(fields.lastName),
      error: formError('lastName', 'Please enter a last name.'),
    },
    {
      rule: notNull(fields.paymentMethod),
      error: formError('paymentMethod', 'Please select a payment method.'),
    },
  ];
  const giftFormFields = [
    {
      rule: nonEmptyString(fields.firstNameGiftRecipient),
      error: formError('firstNameGiftRecipient', 'Please enter the recipient\'s first name.'),
    },
    {
      rule: nonEmptyString(fields.lastNameGiftRecipient),
      error: formError('lastNameGiftRecipient', 'Please enter the recipient\'s last name.'),
    },
  ];
  const creditCardFields = [
    {
      rule: notNull(fields.creditCardNumber),
      error: formError('creditCardNumber', 'Please enter a credit card number.'),
    },
    {
      rule: nonEmptyString(fields.expiryDate),
      error: formError('expiryDate', 'Please enter an expiry date.'),
    },
    {
      rule: notNull(fields.cvc),
      error: formError('cvc', 'Please enter a CVC.'),
    },
  ];
  const formFieldsToCheck = orderIsAGift ?
    [...userFormFields, ...giftFormFields, ...creditCardFields]
    : [...userFormFields, ...creditCardFields];

  return validate(formFieldsToCheck);
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
  ]).concat(applyCheckoutRules(fields));
}

export { applyCheckoutRules, applyDeliveryRules };
