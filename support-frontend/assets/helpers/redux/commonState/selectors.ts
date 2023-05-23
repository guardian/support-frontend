import type { ContributionType } from 'helpers/contributions';
import { config, getConfigAbTestMin } from 'helpers/contributions';
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
	const nudgeMinVariantA =
		state.common.abParticipations['nudgeMinAmountsTest'] === 'variantA';
	const nudgeMinVariantB =
		state.common.abParticipations['nudgeMinAmountsTest'] === 'variantB';
	const min =
		useLocalCurrency && localCurrencyCountry && contributionType === 'ONE_OFF'
			? localCurrencyCountry.config[contributionType].min
			: getConfigAbTestMin(countryGroupId, contributionType, {
					variantA: nudgeMinVariantA,
					variantB: nudgeMinVariantB,
			  });

	return min;
}

export function getMaximumContributionAmount(
	state: ContributionsState,
): number {
	const { countryGroupId, useLocalCurrency, localCurrencyCountry } =
		state.common.internationalisation;
	const contributionType = getContributionType(state);

	const { max } =
		useLocalCurrency && localCurrencyCountry && contributionType === 'ONE_OFF'
			? localCurrencyCountry.config[contributionType]
			: config[countryGroupId][contributionType];

	return max;
}

export function isUserInAbVariant(abTestName: string, variantName: string) {
	return function getAbTestStatus(state: ContributionsState): boolean {
		const participations = state.common.abParticipations;
		return participations[abTestName] === variantName;
	};
}
