import type { ContributionType } from 'helpers/contributions';
import { config, contributionTypes } from 'helpers/contributions';
import { getDefaultContributionType } from 'helpers/redux/commonState/selectors';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import type { GuardianProduct } from '../state';

export function isContribution(
	product: GuardianProduct,
): product is ContributionType {
	return contributionTypes.includes(product);
}

export function getContributionType(
	state: ContributionsState,
): ContributionType {
	const { productType } = state.page.checkoutForm.product;
	if (isContribution(productType)) {
		return productType;
	}
	return getDefaultContributionType(state);
}

export function getMinimumContributionAmount(
	contributionType?: ContributionType,
) {
	return (state: ContributionsState): number => {
		const { countryGroupId } = state.common.internationalisation;
		const { min } =
			config[countryGroupId][contributionType ?? getContributionType(state)];

		return min;
	};
}

export function getMaximumContributionAmount(
	contributionType?: ContributionType,
) {
	return (state: ContributionsState): number => {
		const { countryGroupId } = state.common.internationalisation;
		const { max } =
			config[countryGroupId][contributionType ?? getContributionType(state)];

		return max;
	};
}
