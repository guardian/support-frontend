// @flow

// ----- Imports ----- //
import { type Contrib as ContributionType } from 'helpers/contributions';

// Copied from
// https://github.com/playframework/playframework/blob/38abd1ca6d17237950c82b1483057c5c39929cb4/framework/src/play/
// src/main/scala/play/api/data/validation/Validation.scala#L80
// but with minor modification (last * becomes +) to enforce at least one dot in domain.  This is
// for compatibility with Stripe
export const emailRegexPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function patternIsValid(value: string, pattern: RegExp): boolean {
  const regex = new RegExp(pattern);
  return regex.test(value);
}

export function emptyInputField(input: ?string): boolean {
  return input === undefined || input === null || input === '' || input.trim().length === 0;
}

export type UserFormFieldAttribute = {
  value: string,
  shouldValidate: boolean,
  isValid: boolean,
}

export function shouldShowError(field: UserFormFieldAttribute): boolean {
  return field.shouldValidate && !field.isValid;
}

export type formFieldIsValidParameters = {
  value: string,
  required: boolean,
  pattern: RegExp
}

export function formFieldIsValid(params: formFieldIsValidParameters): boolean {
  const emptyFieldError = params.required && emptyInputField(params.value);
  const patternMatchError = !patternIsValid(params.value, params.pattern);
  return !emptyFieldError && !patternMatchError;
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

function isButtonFocused(event: FocusEvent, buttonClassName: string): boolean {
  const { relatedTarget } = event;
  if (relatedTarget instanceof HTMLElement) {
    return relatedTarget.classList.contains(buttonClassName);
  }
  return false;
}

export const onFormFieldBlur = (setShouldValidate: () => void, buttonClassName: string) => (event: FocusEvent) => {
  // Don't update the Redux state if the focus event is on the payment button, as this
  // will cause a re-render and the click event on the button will be lost
  if (!isButtonFocused(event, buttonClassName)) {
    setShouldValidate();
  }
};
