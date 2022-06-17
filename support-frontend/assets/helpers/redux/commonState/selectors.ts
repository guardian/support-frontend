import type { ContributionType } from 'helpers/contributions';
import { getValidContributionTypesFromUrlOrElse } from 'helpers/forms/checkouts';
import type { ContributionsState } from '../contributionsStore';

export function getDefaultContributionType(
	state: ContributionsState,
): ContributionType {
	const { countryGroupId } = state.common.internationalisation;
	const contributionTypes = getValidContributionTypesFromUrlOrElse(
		state.common.settings.contributionTypes,
	);
	const contribTypesForLocale = contributionTypes[countryGroupId];
	const defaultContributionType =
		contribTypesForLocale.find((contribType) => contribType.isDefault) ??
		contribTypesForLocale[0];

	return defaultContributionType.contributionType;
}
