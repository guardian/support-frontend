import { recaptchaRequiredPaymentMethods } from 'helpers/forms/paymentMethods';
import {
	hasPaymentRequestButtonBeenClicked,
	hasPaymentRequestInterfaceClosed,
	hasPaymentRequestPaymentFailed,
} from 'helpers/redux/checkout/payment/paymentRequestButton/selectors';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { getOtherAmountErrors } from 'helpers/redux/selectors/formValidation/otherAmountValidation';
import type { ErrorCollection } from './utils';

export function getStripeFormErrors(
	state: ContributionsState,
): ErrorCollection {
	const { errors, showErrors } = state.page.checkoutForm.payment.stripe;
	const shouldShowZipCode =
		state.common.internationalisation.countryId === 'US';

	if (!showErrors) return {};

	if (shouldShowZipCode) {
		const zipCode =
			state.page.checkoutForm.billingAddress.fields.errorObject?.postCode;
		return {
			...errors,
			zipCode,
		};
	}
	return errors;
}

export function getPaymentMethodErrors(
	state: ContributionsState,
): ErrorCollection {
	const { payment } = state.page.checkoutForm;

	switch (payment.paymentMethod.name) {
		case 'Stripe':
			return getStripeFormErrors(state);

		// TODO: implement this once we have a new DD form
		// case 'DirectDebit':
		// 	return payment.directDebit.errors ?? {};

		case 'Sepa':
			return payment.sepa.errors;

		default:
			return {};
	}
}

export function getRecaptchaError(
	state: ContributionsState,
): string[] | undefined {
	const { paymentMethod } = state.page.checkoutForm.payment;

	if (recaptchaRequiredPaymentMethods.includes(paymentMethod.name)) {
		return state.page.checkoutForm.recaptcha.errors;
	}
}

export function getPaymentRequestButtonErrors(
	state: ContributionsState,
): ErrorCollection | null {
	const hasBeenClicked = hasPaymentRequestButtonBeenClicked(state);
	const hasBeenCompleted = hasPaymentRequestInterfaceClosed(state);

	const otherAmount = getOtherAmountErrors(state);

	if (hasBeenClicked && hasBeenCompleted) {
		const hasFailed = hasPaymentRequestPaymentFailed(state);

		// Either the payment itself has failed, or the personal details on the user's Apple/Google Pay account failed validation-
		// eg. they signed up with an emoji in their name
		// We can't meaningfully recover from this, so the best option is to try another payment method
		if (hasFailed) {
			return {
				maincontent: [
					'Sorry, something went wrong. Please try another payment method',
				],
			};
		}
	}

	if (hasBeenClicked) {
		return { otherAmount };
	}

	return null;
}
