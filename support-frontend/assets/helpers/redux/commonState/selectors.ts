import type {
	AmountsTest,
	AmountsTests,
	ContributionType,
} from 'helpers/contributions';
import { config } from 'helpers/contributions';
import { getContributionType } from '../checkout/product/selectors/productType';
import type { ContributionsState } from '../contributionsStore';
import { useContributionsSelector } from '../storeHooks';

////////
const getSpecifiedRegionAmountsTest = (
	target: string,
	amounts: AmountsTests | undefined,
): AmountsTest | Record<string, never> => {
	if (!amounts) {
		return {};
	}
	const testArray = amounts.filter(
		(t) =>
			t.targeting.targetingType === 'Region' && t.targeting.region === target,
	);
	if (!testArray.length) {
		return {};
	}
	return testArray[0];
};
//////

export function getDefaultContributionType( ///HANDLE THIS
	state: ContributionsState,
): ContributionType {
	const { countryGroupId } = state.common.internationalisation;
	const { amounts } = useContributionsSelector(
		(state) => state.common.settings,
	);
	const contributionTypesForSpecificRegions = getSpecifiedRegionAmountsTest(
		countryGroupId,
		amounts,
	);

	// const contributionTypes = getValidContributionTypesFromUrlOrElse(
	// 	//HANDLE THIS
	// 	state.common.settings.amounts,
	// );
	// const contribTypesForLocale =
	// 	contributionTypesForSpecificRegions.variants[0].displayContributionType;

	const defaultContributionType =
		contributionTypesForSpecificRegions.variants[0].defaultContributionType;

	return defaultContributionType;
}

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
