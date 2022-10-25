import type { StripeFormErrors } from 'helpers/redux/checkout/payment/stripe/state';
import type { ContributionsState } from 'helpers/redux/contributionsStore';

export type StripeCardFormDisplayErrors = StripeFormErrors & {
	zipCode?: string[];
};

export function getStripeCardFormErrors(state: ContributionsState): {
	errors: StripeCardFormDisplayErrors;
	showErrors: boolean;
} {
	const { errors, showErrors } = state.page.checkoutForm.payment.stripe;

	const shouldShowZipCode =
		state.common.internationalisation.countryId === 'US';

	if (shouldShowZipCode) {
		// TODO: get zipcode errors from the address slice
		return { errors, showErrors };
	}

	return { errors, showErrors };
}
