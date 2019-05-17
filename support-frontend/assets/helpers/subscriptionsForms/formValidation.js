// @flow

import type { Dispatch } from 'redux';
import {
  type Action,
  setFormErrors,
} from 'helpers/subscriptionsForms/formActions';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import { getFormFields } from 'helpers/subscriptionsForms/formFields';
import type { FormField as AddressFormField } from 'components/subscriptionCheckouts/address/addressFieldsStore';
import {
  applyAddressRules,
  setFormErrorsFor as setAddressFormErrorsFor,
} from 'components/subscriptionCheckouts/address/addressFieldsStore';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import type {
  CheckoutState,
  WithDeliveryCheckoutState,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import {
  getBillingAddressFields,
  getDeliveryAddressFields,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { applyCheckoutRules, applyDeliveryRules } from './rules';

type Error<T> = {
  errors: FormError<T>[],
  errorAction: any => Action,
}

type AnyErrorType = Error<AddressFormField> | Error<FormField>;

function checkoutValidation(state: CheckoutState): AnyErrorType[] {
  return [
    ({
      errors: applyCheckoutRules(getFormFields(state)),
      errorAction: setFormErrors,
    }: Error<FormField>),
    ({
      errors: applyAddressRules(getBillingAddressFields(state)),
      errorAction: setAddressFormErrorsFor('billing'),
    }: Error<AddressFormField>),
  ];
}

function withDeliveryValidation(state: WithDeliveryCheckoutState): AnyErrorType[] {
  const formFields = getFormFields(state);
  return [
    ({
      errors: applyCheckoutRules(formFields),
      errorAction: setFormErrors,
    }: Error<FormField>),
    ({
      errors: applyDeliveryRules(formFields),
      errorAction: setFormErrors,
    }: Error<FormField>),
    ({
      errors: applyAddressRules(getDeliveryAddressFields(state)),
      errorAction: setAddressFormErrorsFor('delivery'),
    }: Error<AddressFormField>),
    ...(formFields.billingAddressIsSame ? [] : [
      ({
        errors: applyAddressRules(getBillingAddressFields(state)),
        errorAction: setAddressFormErrorsFor('billing'),
      }: Error<AddressFormField>)]
    ),
  ];
}

function dispatchErrors(
  dispatch: Dispatch<Action>,
  allErrors: AnyErrorType[],
) {
  allErrors.forEach(({ errors, errorAction }) => {
    dispatch(errorAction(errors));
  });
}

function validateCheckoutForm(
  dispatch: Dispatch<Action>,
  state: CheckoutState,
): boolean {
  const allErrors = checkoutValidation(state)
    .filter(({ errors }) => errors.length > 0);

  dispatchErrors(dispatch, allErrors);
  return allErrors.length === 0;
}

function validateWithDeliveryForm(
  dispatch: Dispatch<Action>,
  state: WithDeliveryCheckoutState,
): boolean {
  const allErrors = withDeliveryValidation(state)
    .filter(({ errors }) => errors.length > 0);

  dispatchErrors(dispatch, allErrors);
  return allErrors.length === 0;
}

const checkoutFormIsValid = (state: CheckoutState) =>
  checkoutValidation(state).length === 0;

const withDeliveryFormIsValid = (state: WithDeliveryCheckoutState) =>
  withDeliveryValidation(state).length === 0;

export {
  validateWithDeliveryForm,
  validateCheckoutForm,
  checkoutFormIsValid,
  withDeliveryFormIsValid,
};
