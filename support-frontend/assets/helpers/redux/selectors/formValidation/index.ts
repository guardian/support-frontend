import { getOtherAmountErrors } from 'helpers/redux/selectors/formValidation/otherAmountValidation';
import type { ContributionsState } from '../../contributionsStore';
import {
	getPaymentMethodErrors,
	getPaymentRequestButtonErrors,
} from './paymentValidation';
import {
	getPersonalDetailsErrors,
	getUserCanTakeOutContribution,
} from './personalDetailsValidation';
import type { ErrorCollection } from './utils';
import { errorCollectionHasErrors } from './utils';

export function getAllErrorsForContributions(
	state: ContributionsState,
): ErrorCollection {
	// The payment request button- Apple/Google Pay- has a different validation pattern- we validate any custom amount,
	// then check the user details returned from Stripe against our schema.
	// Thus if the user is paying with the PRB we need to bail out early and not try to validate input fields they won't use.
	const prbErrors = getPaymentRequestButtonErrors(state);

	if (prbErrors) {
		return prbErrors;
	}

	const personalDetailsErrors = getPersonalDetailsErrors(state);

	const otherAmount = getOtherAmountErrors(state);
	const paymentMethod = state.page.checkoutForm.payment.paymentMethod.errors;

	const paymentErrors = {
		paymentMethod,
		...getPaymentMethodErrors(state),
	};

	return {
		otherAmount,
		...personalDetailsErrors,
		...paymentErrors,
	};
}

export function contributionsFormHasErrors(state: ContributionsState): boolean {
	const errorObject = getAllErrorsForContributions(state);
	const userCanTakeOutContribution = getUserCanTakeOutContribution(state);

	return errorCollectionHasErrors(errorObject) || !userCanTakeOutContribution;
}
