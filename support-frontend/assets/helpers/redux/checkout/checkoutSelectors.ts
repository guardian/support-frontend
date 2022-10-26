import { getOtherAmountErrors } from 'components/otherAmount/selectors';
import { recaptchaRequiredPaymentMethods } from 'helpers/forms/paymentMethods';
import type { ContributionsState } from '../contributionsStore';
import { getContributionType } from './product/selectors/productType';

function getPaymentMethodErrors(
	state: ContributionsState,
): Record<string, string[]> {
	const { payment } = state.page.checkoutForm;

	switch (payment.paymentMethod.name) {
		case 'Stripe':
			return payment.stripe.showErrors ? payment.stripe.errors : {};

		// TODO: implement this once we have a new DD form
		// case 'DirectDebit':
		// 	return payment.directDebit.errors ?? {};

		case 'Sepa':
			return payment.sepa.errors;

		default:
			return {};
	}
}

function getRecaptchaError(state: ContributionsState): string[] | undefined {
	const { paymentMethod } = state.page.checkoutForm.payment;

	if (recaptchaRequiredPaymentMethods.includes(paymentMethod.name)) {
		return state.page.checkoutForm.recaptcha.errors;
	}
}

export function getAllErrorsForContributions(
	state: ContributionsState,
): Partial<Record<string, string[]>> {
	const contributionType = getContributionType(state);

	const { firstName, lastName, email } =
		state.page.checkoutForm.personalDetails.errors ?? {};

	const otherAmount = getOtherAmountErrors(state);
	const paymentMethod = state.page.checkoutForm.payment.paymentMethod.errors;
	const robot_checkbox = getRecaptchaError(state);

	const nonPersonalDetailsErrors = {
		otherAmount,
		paymentMethod,
		...getPaymentMethodErrors(state),
		robot_checkbox,
	};

	if (contributionType === 'ONE_OFF') {
		return {
			email,
			...nonPersonalDetailsErrors,
		};
	}
	return {
		firstName,
		lastName,
		email,
		...nonPersonalDetailsErrors,
	};
}

export function contributionsFormHasErrors(state: ContributionsState): boolean {
	const errorObject = getAllErrorsForContributions(state);

	return Object.values(errorObject).some((errorList) => errorList?.length);
}
