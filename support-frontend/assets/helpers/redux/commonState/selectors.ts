import type { ContributionType } from 'helpers/contributions';
import { config } from 'helpers/contributions';
import { getValidContributionTypesFromUrlOrElse } from 'helpers/forms/checkouts';
import { getContributionType } from '../checkout/product/selectors/productType';
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

export function getMinimumContributionAmount(
	state: ContributionsState,
): number {
	const { countryGroupId, useLocalCurrency, localCurrencyCountry } =
		state.common.internationalisation;
	const contributionType = getContributionType(state);

	const { min } =
		useLocalCurrency && localCurrencyCountry && contributionType === 'ONE_OFF'
			? localCurrencyCountry.config[contributionType]
			: config[countryGroupId][contributionType];

	return min;
}
