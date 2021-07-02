// @flow

import { formError, nonEmptyString, notNull, nonSillyCharacters, validate } from './validation';
import type { FormField, FormFields } from './formFields';
import type { FormError } from './validation';
import {
  checkOptionalEmail,
  checkEmail,
  checkGiftStartDate,
  requiresSignIn,
} from 'helpers/forms/formValidation';

const signInErrorMessage = (userType) => {
  switch(userType) {
    case 'current': return 'You already have a Guardian account. Please sign in or use another email address';
    default: return 'There was an unexpected error. Please refresh the page and try again';
  }
}

function applyCheckoutRules(fields: FormFields): FormError<FormField>[] {
  const { orderIsAGift, product, isSignedIn, userTypeFromIdentityResponse } = fields;

  const userFormFields = [
    {
      rule: nonEmptyString(fields.firstName),
      error: formError('firstName', 'Please enter a first name.'),
    },
    {
      rule: nonSillyCharacters(fields.firstName),
      error: formError('firstName', 'Please use only letters, numbers and punctuation.'),
    },
    {
      rule: nonEmptyString(fields.lastName),
      error: formError('lastName', 'Please enter a last name.'),
    },
    {
      rule: nonSillyCharacters(fields.lastName),
      error: formError('lastName', 'Please use only letters, numbers and punctuation.'),
    },
    {
      rule: nonSillyCharacters(fields.telephone),
      error: formError('telephone', 'Please use only letters, numbers and punctuation.'),
    },
    {
      rule: nonEmptyString(fields.email),
      error: formError('email', 'Please enter a valid email address.'),
    },
    {
      rule: requiresSignIn(userTypeFromIdentityResponse, isSignedIn),
      error: formError('email', signInErrorMessage(userTypeFromIdentityResponse)),
    },
    {
      rule: notNull(fields.paymentMethod),
      error: formError('paymentMethod', 'Please select a payment method.'),
    },
  ];
  const giftFormFields = product === 'DigitalPack' ?
    [
      {
        rule: nonEmptyString(fields.firstNameGiftRecipient),
        error: formError('firstNameGiftRecipient', 'Please enter the recipient\'s first name.'),
      },
      {
        rule: nonSillyCharacters(fields.firstNameGiftRecipient),
        error: formError('firstNameGiftRecipient', 'Please use only letters, numbers and punctuation.'),
      },
      {
        rule: nonEmptyString(fields.lastNameGiftRecipient),
        error: formError('lastNameGiftRecipient', 'Please enter the recipient\'s last name.'),
      },
      {
        rule: nonSillyCharacters(fields.lastNameGiftRecipient),
        error: formError('lastNameGiftRecipient', 'Please use only letters, numbers and punctuation.'),
      },
      {
        rule: checkEmail(fields.emailGiftRecipient) && nonSillyCharacters(fields.emailGiftRecipient),
        error: formError('emailGiftRecipient', 'Please use a valid email address for the recipient.'),
      },
      {
        rule: checkGiftStartDate(fields.giftDeliveryDate),
        error: formError('giftDeliveryDate', 'Please enter a valid delivery date for your gift.'),
      },
    ] :
    [
      {
        rule: nonEmptyString(fields.firstNameGiftRecipient),
        error: formError('firstNameGiftRecipient', 'Please enter the recipient\'s first name.'),
      },
      {
        rule: nonSillyCharacters(fields.firstNameGiftRecipient),
        error: formError('firstNameGiftRecipient', 'Please use only letters, numbers and punctuation.'),
      },
      {
        rule: nonEmptyString(fields.lastNameGiftRecipient),
        error: formError('lastNameGiftRecipient', 'Please enter the recipient\'s last name.'),
      },
      {
        rule: nonSillyCharacters(fields.lastNameGiftRecipient),
        error: formError('lastNameGiftRecipient', 'Please use only letters, numbers and punctuation.'),
      },
      {
        rule: checkOptionalEmail(fields.emailGiftRecipient) && nonSillyCharacters(fields.emailGiftRecipient),
        error: formError('emailGiftRecipient', 'Please use a valid email address for the recipient.'),
      },
    ];
  const formFieldsToCheck = orderIsAGift ?
    [...userFormFields, ...giftFormFields]
    : userFormFields;

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
