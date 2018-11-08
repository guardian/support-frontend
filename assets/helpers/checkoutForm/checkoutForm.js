// @flow

// ----- Imports ----- //
import { type Contrib as ContributionType } from 'helpers/contributions';
import type { Contrib, PaymentMethod } from 'helpers/contributions';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import { canContributeWithoutSigningIn } from 'helpers/identityApis';
import { trackCheckoutSubmitAttempt } from 'helpers/tracking/ophanComponentEventTracking';

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


export const onFormSubmit = (
  paymentMethod: PaymentMethod,
  contributionType: Contrib,
  form: Object | null,
  isSignedIn: boolean,
  userTypeFromIdentityResponse: UserTypeFromIdentityResponse,
  setFormIsValid: boolean => void,
  setCheckoutFormHasBeenSubmitted: () => void,
  handlePayment?: () => void,
) => {
  const componentId = `${paymentMethod}-${contributionType}-submit`;
  const formIsValid = formElementIsValid(form);
  const userType = isSignedIn ? 'signed-in' : userTypeFromIdentityResponse;
  const canContribute =
    canContributeWithoutSigningIn(contributionType, isSignedIn, userTypeFromIdentityResponse)
    || isSignedIn;
  if (formIsValid) {
    setFormIsValid(true);
    if (canContribute) {
      if (handlePayment) {
        handlePayment();
      }
      trackCheckoutSubmitAttempt(componentId, `allowed-for-user-type-${userType}`);
    } else {
      trackCheckoutSubmitAttempt(componentId, `blocked-because-user-type-is-${userType}`);
    }
  } else {
    setFormIsValid(false);
    trackCheckoutSubmitAttempt(componentId, `blocked-because-form-not-valid${invalidReason(form)}`);
  }
  setCheckoutFormHasBeenSubmitted();
};

export const formIsValid = (formClassName: string) => formElementIsValid(getForm(formClassName));

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

