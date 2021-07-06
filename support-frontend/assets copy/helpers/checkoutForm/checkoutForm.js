// @flow
export type UserFormFieldAttribute = {
  id: string,
  value: string,
}

export function formFieldIsValid(id: string) {
  const element = document.getElementById(id);
  if (element && element instanceof HTMLInputElement) {
    return element.validity.valid;
  }
  return false;
}

export function shouldShowError(field: UserFormFieldAttribute, checkoutFormHasBeenSubmitted: boolean): boolean {
  return checkoutFormHasBeenSubmitted && !formFieldIsValid(field.id);
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

const getInvalidReason = (validityState: ValidityState) => {
  if (validityState.valueMissing) {
    return '-value-missing';
  } else if (validityState.patternMismatch) {
    return '-pattern-mismatch';
  }
  return '';
};

export const invalidReason = (form: Object | null): string => {
  try {
    let invalidReasonString = '';
    if (form instanceof HTMLFormElement) {
      [...form.elements].forEach((element) => {
        if ((element instanceof HTMLInputElement || element instanceof HTMLSelectElement)
          && !element.checkValidity()) {
          invalidReasonString += `-${element.id}${getInvalidReason(element.validity)}`;
        }
      });
    } else {
      invalidReasonString = 'form-not-instance-of-html-element';
    }
    return invalidReasonString;
  } catch (e) {
    return e;
  }
};

export const formElementIsValid = (formElement: Object | null) => {
  if (formElement && formElement instanceof HTMLFormElement) {
    return formElement.checkValidity();
  }
  return false;
};

export const formIsValid = (formClassName: string) => formElementIsValid(getForm(formClassName));
