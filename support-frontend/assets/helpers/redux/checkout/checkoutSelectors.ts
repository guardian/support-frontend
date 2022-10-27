import { getOtherAmountErrors } from 'components/otherAmount/selectors';
import { recaptchaRequiredPaymentMethods } from 'helpers/forms/paymentMethods';
import { shouldCollectStateForContributions } from 'helpers/internationalisation/shouldCollectStateForContribs';
import type { ContributionsState } from '../contributionsStore';
import {
	hasPaymentRequestButtonBeenClicked,
	hasPaymentRequestInterfaceClosed,
} from './payment/paymentRequestButton/selectors';
import { getContributionType } from './product/selectors/productType';

type ErrorCollection = Partial<Record<string, string[]>>;

function errorCollectionHasErrors(errorCollection: ErrorCollection) {
	return Object.values(errorCollection).some((errorList) => errorList?.length);
}

function getPaymentMethodErrors(state: ContributionsState): ErrorCollection {
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

function getStateOrProvinceError(state: ContributionsState): ErrorCollection {
	const { countryGroupId } = state.common.internationalisation;

	if (shouldCollectStateForContributions(countryGroupId)) {
		return {
			contributionsState:
				state.page.checkoutForm.billingAddress.fields.errorObject.state,
		};
	}
	return {};
}

function getPersonalDetailsErrors(state: ContributionsState): ErrorCollection {
	const contributionType = getContributionType(state);

	const { firstName, lastName, email } =
		state.page.checkoutForm.personalDetails.errors ?? {};

	const stateOrProvinceErrors = getStateOrProvinceError(state);

	if (contributionType === 'ONE_OFF') {
		return {
			email,
			...stateOrProvinceErrors,
		};
	}
	return {
		firstName,
		lastName,
		email,
		...stateOrProvinceErrors,
	};
}

function getPaymentRequestButtonErrors(
	state: ContributionsState,
): ErrorCollection | null {
	const hasBeenClicked = hasPaymentRequestButtonBeenClicked(state);
	const hasBeenCompleted = hasPaymentRequestInterfaceClosed(state);

	const otherAmount = getOtherAmountErrors(state);

	if (hasBeenClicked && hasBeenCompleted) {
		const personalDetailsErrors = getPersonalDetailsErrors(state);

		if (errorCollectionHasErrors({ ...personalDetailsErrors, otherAmount })) {
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
	const robot_checkbox = getRecaptchaError(state);

	const nonPersonalDetailsErrors = {
		otherAmount,
		paymentMethod,
		...getPaymentMethodErrors(state),
		robot_checkbox,
	};

	return {
		...personalDetailsErrors,
		...nonPersonalDetailsErrors,
	};
}

export function contributionsFormHasErrors(state: ContributionsState): boolean {
	const errorObject = getAllErrorsForContributions(state);

	return errorCollectionHasErrors(errorObject);
}
