// @flow

// ----- Imports ----- //
import { type Contrib as ContributionType } from 'helpers/contributions';

// Copied from
// https://github.com/playframework/playframework/blob/master/framework/src/play/
// src/main/scala/play/api/data/validation/Validation.scala#L81
// but with minor modification (last * becomes +) to enforce at least one dot in domain.  This is
// for compatibility with Stripe
export const emailRegexPattern = '^[a-zA-Z0-9\\.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$';

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

export const formIsValid = (formClassName: string) => {
  const form = document.querySelector(`.${formClassName}`);
  if (form && form instanceof HTMLFormElement) {
    return form.checkValidity();
  }
  return false;
};

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

