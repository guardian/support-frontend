import type { Dispatch } from 'redux';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
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

type Error<T> = {
	errors: Array<FormError<T>>;
	dispatchErrors: (dispatch: Dispatch) => void;
};
type AnyErrorType = Error<AddressFormField> | Error<FormField>;

function checkoutValidation(state: SubscriptionsState): AnyErrorType[] {
	const errors: AnyErrorType[] = [];

	const checkoutErrors = applyCheckoutRules(getFormFields(state));
	if (checkoutErrors.length > 0) {
		errors.push({
			errors: checkoutErrors,
			dispatchErrors: (dispatch) => dispatch(setFormErrors(checkoutErrors)),
		});
	}

	const billingAddressErrors = applyBillingAddressRules(
		state.page.checkoutForm.billingAddress.fields,
	);
	if (checkoutErrors.length > 0) {
		errors.push({
			errors: billingAddressErrors,
			dispatchErrors: (dispatch) =>
				dispatch(setBillingAddressFormErrors(billingAddressErrors)),
		});
	}

	return errors;
}

const shouldValidateBillingAddress = (fields: FormFields) =>
	!fields.billingAddressIsSame;

function withDeliveryValidation(state: SubscriptionsState): AnyErrorType[] {
	const errors: AnyErrorType[] = [];

	const formFields = getFormFields(state);

	const deliveryErrrors = applyDeliveryRules(formFields);
	if (deliveryErrrors.length > 0) {
		errors.push({
			errors: deliveryErrrors,
			dispatchErrors: (dispatch) => dispatch(setFormErrors(deliveryErrrors)),
		});
	}

	const deliveryAddressErrors = applyDeliveryAddressRules(
		getFulfilmentOption(state),
		state.page.checkoutForm.deliveryAddress.fields,
	);
	if (deliveryAddressErrors.length > 0) {
		errors.push({
			errors: deliveryAddressErrors,
			dispatchErrors: (dispatch) =>
				dispatch(setDeliveryAddressFormErrors(deliveryAddressErrors)),
		});
	}

	if (shouldValidateBillingAddress(formFields)) {
		const billingAddressErrors = applyBillingAddressRules(
			state.page.checkoutForm.billingAddress.fields,
		);
		if (billingAddressErrors.length > 0) {
			errors.push({
				errors: billingAddressErrors,
				dispatchErrors: (dispatch) =>
					dispatch(setBillingAddressFormErrors(billingAddressErrors)),
			});
		}
	}

	return errors;
}

function validateCheckoutForm(
	dispatch: Dispatch,
	state: SubscriptionsState,
): boolean {
	const allErrors = checkoutValidation(state);
	allErrors.forEach((e) => e.dispatchErrors(dispatch));
	return allErrors.length === 0;
}

function validateWithDeliveryForm(
	dispatch: Dispatch<Action>,
	state: SubscriptionsState,
): boolean {
	const allErrors = withDeliveryValidation(state);
	allErrors.forEach((e) => e.dispatchErrors(dispatch));
	return allErrors.length === 0;
}

const checkoutFormIsValid = (state: SubscriptionsState): boolean => {
	if (state.page.checkoutForm.product.productType === DigitalPack) {
		return checkoutValidation(state).length === 0;
	}
	return withDeliveryValidation(state).length === 0;
};

const withDeliveryFormIsValid = (state: SubscriptionsState): boolean =>
	withDeliveryValidation(state).length === 0;

export {
	validateWithDeliveryForm,
	validateCheckoutForm,
	checkoutFormIsValid,
	withDeliveryFormIsValid,
};
