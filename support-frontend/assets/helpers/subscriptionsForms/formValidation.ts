import type { Dispatch } from 'redux';
import {
	setBillingAddressFormErrors,
	setDeliveryAddressFormErrors,
} from 'helpers/redux/checkout/address/actions';
import type { AddressFormField } from 'helpers/redux/checkout/address/state';
import {
	applyBillingAddressRules,
	applyDeliveryAddressRules,
} from 'helpers/redux/checkout/address/validation';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import { setFormErrors } from 'helpers/subscriptionsForms/formActions';
import type {
	FormField,
	FormFields,
} from 'helpers/subscriptionsForms/formFields';
import { getFormFields } from 'helpers/subscriptionsForms/formFields';
import { getFulfilmentOption } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { applyCheckoutRules, applyDeliveryRules } from './rules';

// ---- Types ---- //

type Error<T> = {
	errors: Array<FormError<T>>;
	dispatchErrors: (dispatch: Dispatch) => void;
};
type AnyErrorType = Error<AddressFormField> | Error<FormField>;

// ---- Validation ---- //

export function validateCheckoutForm(
	dispatch: Dispatch,
	state: SubscriptionsState,
): boolean {
	const allErrors = checkoutValidation(state);
	dispatchAllErrors(dispatch, allErrors);
	return allErrors.length === 0;
}

export function validateWithDeliveryForm(
	dispatch: Dispatch<Action>,
	state: SubscriptionsState,
): boolean {
	const allErrors = withDeliveryValidation(state);
	dispatchAllErrors(dispatch, allErrors);
	return allErrors.length === 0;
}

export function withDeliveryFormIsValid(state: SubscriptionsState): boolean {
	return withDeliveryValidation(state).length === 0;
}

// ---- Helpers ---- //

function checkoutValidation(state: SubscriptionsState): AnyErrorType[] {
	const checkoutErrors = applyCheckoutRules(getFormFields(state));
	const checkoutErrorsList = getErrorList({
		errors: checkoutErrors,
		dispatchErrors: (dispatch) => dispatch(setFormErrors(checkoutErrors)),
	});

	const billingAddressErrors = applyBillingAddressRules(
		state.page.checkoutForm.billingAddress.fields,
	);
	const billingAddressErrorsList = getErrorList({
		errors: billingAddressErrors,
		dispatchErrors: (dispatch) =>
			dispatch(setBillingAddressFormErrors(billingAddressErrors)),
	});

	return [...checkoutErrorsList, ...billingAddressErrorsList];
}

function withDeliveryValidation(state: SubscriptionsState): AnyErrorType[] {
	const formFields = getFormFields(state);

	const deliveryErrors = applyDeliveryRules(formFields);
	const deliveryErrorsList = getErrorList({
		errors: deliveryErrors,
		dispatchErrors: (dispatch) => dispatch(setFormErrors(deliveryErrors)),
	});

	const deliveryAddressErrors = applyDeliveryAddressRules(
		getFulfilmentOption(state),
		state.page.checkoutForm.deliveryAddress.fields,
	);
	const deliveryAddressErrorsList = getErrorList({
		errors: deliveryAddressErrors,
		dispatchErrors: (dispatch) =>
			dispatch(setDeliveryAddressFormErrors(deliveryAddressErrors)),
	});

	if (shouldValidateBillingAddress(formFields)) {
		const billingAddressErrors = applyBillingAddressRules(
			state.page.checkoutForm.billingAddress.fields,
		);
		const billingAddressErrorsList = getErrorList({
			errors: billingAddressErrors,
			dispatchErrors: (dispatch) =>
				dispatch(setBillingAddressFormErrors(billingAddressErrors)),
		});

		return [
			...deliveryErrorsList,
			...deliveryAddressErrorsList,
			...billingAddressErrorsList,
		];
	}

	return [...deliveryErrorsList, ...deliveryAddressErrorsList];
}

function shouldValidateBillingAddress(fields: FormFields) {
	return !fields.billingAddressIsSame;
}

function dispatchAllErrors(dispatch: Dispatch, allErrors: AnyErrorType[]) {
	allErrors.forEach((e) => e.dispatchErrors(dispatch));
}

function getErrorList(error: AnyErrorType) {
	return error.errors.length > 0 ? [error] : [];
}
