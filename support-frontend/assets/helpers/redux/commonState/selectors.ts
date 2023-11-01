import type { ContributionType } from 'helpers/contributions';
import { config } from 'helpers/contributions';
// eslint-disable-next-line import/no-cycle -- these are quite tricky to unpick so we should come back to this
import { getContributionType } from '../checkout/product/selectors/productType';
import type { ContributionsState } from '../contributionsStore';

export function getDefaultContributionType(
	state: ContributionsState,
): ContributionType {
	const { defaultContributionType } = state.common.amounts;
	return defaultContributionType;
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

export function isUserInAbVariant(abTestName: string, variantName: string) {
	return function getAbTestStatus(state: ContributionsState): boolean {
		const participations = state.common.abParticipations;
		return participations[abTestName] === variantName;
	};
}
