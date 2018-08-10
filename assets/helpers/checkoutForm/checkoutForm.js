// @flow

// ----- Imports ----- //


// Copied from
// https://github.com/playframework/playframework/blob/38abd1ca6d17237950c82b1483057c5c39929cb4/framework/src/play/
// src/main/scala/play/api/data/validation/Validation.scala#L80
// but with minor modification (last * becomes +) to enforce at least one dot in domain.  This is
// for compatibility with Stripe
export const emailRegexPattern = '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$';

export function patternIsValid(value: string, pattern: string) {
  const regex = new RegExp(pattern);
  return regex.test(value);
}

export function emptyInputField(input: ?string): boolean {
  return input === undefined || input === null || input === '' || input.trim().length === 0;
}

export type UserFormFieldAttribute = {
  value: string,
  shouldValidate: boolean,
  setShouldValidate: () => void,
  setValue: (string) => void,
  isValid: boolean,
}

export const defaultUserFormFieldAttribute = {
  value: '',
  shouldValidate: false,
  setShouldValidate: () => {},
  setValue: () => {},
  showError: false,
};


export function shouldShowError(field: UserFormFieldAttribute) {
  return field.shouldValidate && field.isValid;
}

export function formFieldError(value: string, required: boolean, pattern: ?string) {
  const emptyFieldError = required && emptyInputField(value);
  const patternMatchError = pattern && !patternIsValid(value, pattern);
  return emptyFieldError || !!patternMatchError;
}
