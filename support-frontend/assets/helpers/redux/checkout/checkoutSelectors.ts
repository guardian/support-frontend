import { getOtherAmountErrors } from 'components/otherAmount/selectors';
import type { ContributionsState } from '../contributionsStore';
import { getContributionType } from './product/selectors/productType';

function getPaymentMethodErrors(
	state: ContributionsState,
): Record<string, string[]> {
	const { payment } = state.page.checkoutForm;

	switch (payment.paymentMethod.name) {
		case 'Stripe':
			return payment.stripe.showErrors ? payment.stripe.errors : {};

		case 'DirectDebit':
			return payment.directDebit.errors ?? {};

		case 'Sepa':
			return payment.sepa.errors;

		default:
			return {};
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

	if (contributionType === 'ONE_OFF') {
		return {
			otherAmount,
			email,
			...getPaymentMethodErrors(state),
		};
	}
	return {
		otherAmount,
		firstName,
		lastName,
		email,
		paymentMethod,
		...getPaymentMethodErrors(state),
	};
}

export function contributionsFormHasErrors(state: ContributionsState): boolean {
	const errorObject = getAllErrorsForContributions(state);

	return Object.values(errorObject).some((errorList) => errorList?.length);
}
