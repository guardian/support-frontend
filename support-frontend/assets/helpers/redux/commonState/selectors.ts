import { config } from 'helpers/contributions';
import { getContributionType } from '../checkout/product/selectors/productType';
import type { ContributionsState } from '../contributionsStore';

export function getMinimumContributionAmount(
	state: ContributionsState,
): number {
	const { countryGroupId } = state.common.internationalisation;
	const contributionType = getContributionType(state);
	const { min } = config[countryGroupId][contributionType];

	return min;
}

export function getMaximumContributionAmount(
	state: ContributionsState,
): number {
	const { countryGroupId } = state.common.internationalisation;
	const contributionType = getContributionType(state);

	const { max } = config[countryGroupId][contributionType];

	return max;
}

export function isUserInAbVariant(abTestName: string, variantName: string) {
	return function getAbTestStatus(state: ContributionsState): boolean {
		const participations = state.common.abParticipations;
		return participations[abTestName] === variantName;
	};
}
