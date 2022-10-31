import { shouldCollectStateForContributions } from 'helpers/internationalisation/shouldCollectStateForContribs';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import type { ErrorCollection } from './utils';

export function getStateOrProvinceError(
	state: ContributionsState,
): ErrorCollection {
	const { countryGroupId } = state.common.internationalisation;

	if (shouldCollectStateForContributions(countryGroupId)) {
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
		firstName,
		lastName,
		email,
		...stateOrProvinceErrors,
	};
}
