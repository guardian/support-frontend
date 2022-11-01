import type { StripeFormErrors } from 'helpers/redux/checkout/payment/stripe/state';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { getStripeFormErrors } from 'helpers/redux/selectors/formValidation/paymentValidation';

export type StripeCardFormDisplayErrors = StripeFormErrors & {
	recaptcha?: string[];
	zipCode?: string[];
};

export function getDisplayErrors(state: ContributionsState): {
	errors: StripeCardFormDisplayErrors;
	showErrors: boolean;
} {
	const { showErrors } = state.page.checkoutForm.payment.stripe;
	const recaptchaErrors = state.page.checkoutForm.recaptcha.errors;
	const formErrors = getStripeFormErrors(state);

	return {
		errors: {
			...formErrors,
			recaptcha: recaptchaErrors,
		},
		showErrors,
	};
}
