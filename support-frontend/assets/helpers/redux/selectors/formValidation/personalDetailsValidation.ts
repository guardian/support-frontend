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
			state.page.checkoutForm.payment.paymentMethod.name,
			state,
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

export function getUserCanTakeOutContribution(
	state: ContributionsState,
): boolean {
	const contributionType = getContributionType(state);
	if (contributionType === 'ONE_OFF') {
		return true;
	}

	const userIsRecurringContributor =
		state.page.user.isRecurringContributorError ?? false;
	return !userIsRecurringContributor;
}
