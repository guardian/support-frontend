import { recaptchaRequiredPaymentMethods } from 'helpers/forms/paymentMethods';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import type { ErrorCollection } from './utils';

export function getStripeFormErrors(
	state: ContributionsState,
): ErrorCollection {
	const { errors, showErrors } = state.page.checkoutForm.payment.stripe;
	const recaptchaErrors = getRecaptchaError(state);

	if (!showErrors) {
		return {};
	}
	return { ...errors, robot_checkbox: recaptchaErrors };
}

function getRecaptchaError(state: ContributionsState): string[] | undefined {
	const { paymentMethod } = state.page.checkoutForm.payment;

	if (recaptchaRequiredPaymentMethods.includes(paymentMethod.name)) {
		return state.page.checkoutForm.recaptcha.errors;
	}

	return;
}
