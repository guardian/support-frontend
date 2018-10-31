// @flow

// ----- Imports ----- //
import { type Contrib as ContributionType } from 'helpers/contributions';
import type { Contrib } from 'helpers/contributions';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import { canContributeWithoutSigningIn } from 'helpers/identityApis';

// Copied from
// https://github.com/playframework/playframework/blob/38abd1ca6d17237950c82b1483057c5c39929cb4/framework/src/play/
// src/main/scala/play/api/data/validation/Validation.scala#L80
// but with minor modification (last * becomes +) to enforce at least one dot in domain.  This is
// for compatibility with Stripe
export const emailRegexPattern = '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$';

export function patternIsValid(value: string, pattern: string): boolean {
  const regex = new RegExp(pattern);
  return regex.test(value);
}

export function emptyInputField(input: ?string): boolean {
  return input === undefined || input === null || input === '' || input.trim().length === 0;
}

export type UserFormFieldAttribute = {
  id: string,
  value: string,
  shouldValidate: boolean,
}

export function formFieldIsValid(id: string) {
  const element = document.getElementById(id);
  if (element && element instanceof HTMLInputElement) {
    return element.validity.valid;
  }
  return false;
}

export function shouldShowError(field: UserFormFieldAttribute): boolean {
  return field.shouldValidate && !formFieldIsValid(field.id);
}

export const formInputs = (formClassName: string): Array<HTMLInputElement> => {
  const form = document.querySelector(`.${formClassName}`);
  if (form) {
    return [...form.getElementsByTagName('input')];
  }
  return [];
};

export const getForm: string => Object | null =
  (formName: string) => document.querySelector(`.${formName}`);

// Takes either a form element, or the HTML class of the form
export const formElementIsValid = (formElement: Object | null) => {
  if (formElement && formElement instanceof HTMLFormElement) {
    return formElement.checkValidity();
  }
  return false;
};

export const formIsValid = (formName: string) => formElementIsValid(getForm(formName));

export function checkoutFormShouldSubmit(
  contributionType: Contrib,
  isSignedIn: boolean,
  userTypeFromIdentityResponse: UserTypeFromIdentityResponse,
  form: Object | null,
) {
  return formElementIsValid(form)
    && canContributeWithoutSigningIn(contributionType, isSignedIn, userTypeFromIdentityResponse);
}

export function getTitle(contributionType: ContributionType): string {

  switch (contributionType) {
    case 'ANNUAL':
      return 'Make an annual';
    case 'MONTHLY':
      return 'Make a monthly';
    case 'ONE_OFF':
    default:
      return 'Make a single';
  }
}

