import { shouldCollectStateForContributions } from 'helpers/internationalisation/shouldCollectStateForContribs';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { getBillingCountryAndState } from 'pages/supporter-plus-landing/setup/legacyActionCreators';
import type { ErrorCollection } from './utils';

export function getStateOrProvinceError(
	state: ContributionsState,
): ErrorCollection {
	const contributionType = getContributionType(state);
	const billingCountry = getBillingCountryAndState(state).billingCountry;
	if (shouldCollectStateForContributions(billingCountry, contributionType)) {
		return {
			state: state.page.checkoutForm.billingAddress.fields.errorObject?.state,
		};
	}
	return {};
}

function getZipCodeErrors(state: ContributionsState): ErrorCollection {
	const { internationalisation } = state.common;
	const { paymentMethod } = state.page.checkoutForm.payment;
	const shouldShowZipCode = internationalisation.countryId === 'US';
	const isApplePayGooglePay =
		paymentMethod.name === 'Stripe' &&
		(paymentMethod.stripePaymentMethod === 'StripeApplePay' ||
			paymentMethod.stripePaymentMethod === 'StripePaymentRequestButton');

	if (shouldShowZipCode && !isApplePayGooglePay) {
		const zipCode =
			state.page.checkoutForm.billingAddress.fields.errorObject?.postCode;
		return {
			zipCode,
		};
	}
	return {};
}

export function getPersonalDetailsErrors(
	state: ContributionsState,
): ErrorCollection {
	const contributionType = getContributionType(state);

	const { firstName, lastName, email } =
		state.page.checkoutForm.personalDetails.errors ?? {};

	const stateOrProvinceErrors = getStateOrProvinceError(state);
	const zipCodeErrors = getZipCodeErrors(state);

	if (contributionType === 'ONE_OFF') {
		return {
			email,
			...stateOrProvinceErrors,
			...zipCodeErrors,
		};
	}
	return {
		email,
		firstName,
		lastName,
		...stateOrProvinceErrors,
		...zipCodeErrors,
	};
}
