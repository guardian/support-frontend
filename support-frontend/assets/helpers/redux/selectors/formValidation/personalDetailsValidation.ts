import { fromCountry } from 'helpers/internationalisation/countryGroup';
import { shouldCollectStateForContributions } from 'helpers/internationalisation/shouldCollectStateForContribs';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { getBillingCountryAndState } from 'pages/supporter-plus-landing/setup/legacyActionCreators';
import type { ErrorCollection } from './utils';

export function getStateOrProvinceError(
	state: ContributionsState,
): ErrorCollection {
	const contributionType = getContributionType(state);
	const billingCountryGroup = fromCountry(
		getBillingCountryAndState(
			state,
			state.page.checkoutForm.payment.paymentMethod.name,
			state.page.checkoutForm.payment.paymentMethod.stripePaymentMethod,
		).billingCountry,
	);
	if (
		billingCountryGroup != null &&
		shouldCollectStateForContributions(billingCountryGroup, contributionType)
	) {
		return {
			state: state.page.checkoutForm.billingAddress.fields.errorObject?.state,
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

	if (contributionType === 'ONE_OFF') {
		return {
			email,
			...stateOrProvinceErrors,
		};
	}
	return {
		email,
		firstName,
		lastName,
		...stateOrProvinceErrors,
	};
}
