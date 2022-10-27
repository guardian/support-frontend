import type { StripeFormErrors } from 'helpers/redux/checkout/payment/stripe/state';
import type { ContributionsState } from 'helpers/redux/contributionsStore';

export type StripeCardFormDisplayErrors = StripeFormErrors & {
	recaptcha?: string[];
	zipCode?: string[];
};

export function getStripeCardFormErrors(state: ContributionsState): {
	errors: StripeCardFormDisplayErrors;
	showErrors: boolean;
} {
	const { errors, showErrors } = state.page.checkoutForm.payment.stripe;
	const recaptchaErrors = state.page.checkoutForm.recaptcha.errors;

	const shouldShowZipCode =
		state.common.internationalisation.countryId === 'US';

	if (shouldShowZipCode) {
		const zipCode =
			state.page.checkoutForm.billingAddress.fields.errorObject.postCode;
		return {
			errors: {
				...errors,
				zipCode,
			},
			showErrors,
		};
	}

	return {
		errors: {
			...errors,
			recaptcha: recaptchaErrors,
		},
		showErrors,
	};
}
