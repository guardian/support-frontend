import type { ContributionType } from 'helpers/contributions';
import type { ContributionsState } from '../contributionsStore';

export function getDefaultContributionType(
	state: ContributionsState,
): ContributionType {
	const { defaultContributionType } = state.common.amounts;
	return defaultContributionType;
}
