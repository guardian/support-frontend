import type {
	ContributionType,
	RegularContributionType,
} from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { isRecurring } from './isContributionRecurring';

export type ThresholdAmounts = Record<RegularContributionType, number>;
export const upperBenefitsThresholds: Record<CountryGroupId, ThresholdAmounts> =
	{
		GBPCountries: {
			MONTHLY: 20,
			ANNUAL: 120,
		},
		UnitedStates: {
			MONTHLY: 20,
			ANNUAL: 120,
		},
		EURCountries: {
			MONTHLY: 20,
			ANNUAL: 120,
		},
		International: {
			MONTHLY: 22,
			ANNUAL: 150,
		},
		AUDCountries: {
			MONTHLY: 30,
			ANNUAL: 170,
		},
		NZDCountries: {
			MONTHLY: 30,
			ANNUAL: 170,
		},
		Canada: {
			MONTHLY: 22,
			ANNUAL: 150,
		},
	};

export const lowerBenefitsThresholds: Record<CountryGroupId, ThresholdAmounts> =
	{
		GBPCountries: {
			MONTHLY: 10,
			ANNUAL: 95,
		},
		UnitedStates: {
			MONTHLY: 13,
			ANNUAL: 120,
		},
		EURCountries: {
			MONTHLY: 10,
			ANNUAL: 95,
		},
		International: {
			MONTHLY: 13,
			ANNUAL: 120,
		},
		AUDCountries: {
			MONTHLY: 17,
			ANNUAL: 160,
		},
		NZDCountries: {
			MONTHLY: 17,
			ANNUAL: 160,
		},
		Canada: {
			MONTHLY: 13,
			ANNUAL: 120,
		},
	};

export function getLowerBenefitsThreshold(
	state: ContributionsState,
	regularContributionType?: RegularContributionType,
): number {
	const contributionType =
		regularContributionType ?? getContributionType(state);
	const contributionTypeThreshold =
		contributionType.toUpperCase() as keyof ThresholdAmounts;

	return lowerBenefitsThresholds[
		state.common.internationalisation.countryGroupId
	][contributionTypeThreshold];
}
export function getLowerBenefitsThresholds(
	state: ContributionsState,
): ThresholdAmounts {
	return {
		MONTHLY: getLowerBenefitsThreshold(state, 'MONTHLY'),
		ANNUAL: getLowerBenefitsThreshold(state, 'ANNUAL'),
	};
}

// This is a function overload that means if the caller has already determined that contributionType is recurring
// they do not have to handle an undefined return type from getThresholdPrice
// cf. https://www.typescriptlang.org/docs/handbook/2/functions.html#overload-signatures-and-the-implementation-signature

// Signatures
export function getThresholdPrice(
	contributionType: 'ONE_OFF',
	state: ContributionsState,
): undefined;
export function getThresholdPrice(
	contributionType: RegularContributionType,
	state: ContributionsState,
): number;
export function getThresholdPrice(
	contributionType: ContributionType,
	state: ContributionsState,
): number | undefined;
// Implementation
export function getThresholdPrice(
	contributionType: ContributionType,
	state: ContributionsState,
): number | undefined {
	if (isRecurring(contributionType)) {
		return getLowerBenefitsThreshold(state);
	}
}
