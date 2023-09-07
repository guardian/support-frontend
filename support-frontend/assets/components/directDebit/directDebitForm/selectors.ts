import type { DirectDebitState } from 'helpers/redux/checkout/payment/directDebit/state';
import type { ContributionsState } from 'helpers/redux/contributionsStore';

export type DirectDebitFormDisplayErrors = DirectDebitState['errors'] & {
	recaptcha?: string[];
};

export function getDirectDebitFormErrors(
	state: ContributionsState,
): DirectDebitFormDisplayErrors {
	const recaptchaErrors = state.page.checkoutForm.recaptcha.errors;
	const formErrors = state.page.checkoutForm.payment.directDebit.errors;

	return {
		...formErrors,
		recaptcha: recaptchaErrors,
	};
}
