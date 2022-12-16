import type {
	ContributionType,
	RegularContributionType,
} from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { isRecurring } from './isContributionRecurring';

export const benefitsThresholdsByCountryGroup: Record<
	CountryGroupId,
	Record<RegularContributionType, number>
> = {
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

// This is a function overload that means if the caller has already determined that contributionType is recurring
// they do not have to handle an undefined return type from getThresholdPrice
// cf. https://www.typescriptlang.org/docs/handbook/2/functions.html#overload-signatures-and-the-implementation-signature

// Signatures
export function getThresholdPrice(
	countryGroupId: CountryGroupId,
	contributionType: 'ONE_OFF',
): undefined;
export function getThresholdPrice(
	countryGroupId: CountryGroupId,
	contributionType: RegularContributionType,
): number;
export function getThresholdPrice(
	countryGroupId: CountryGroupId,
	contributionType: ContributionType,
): number | undefined;
// Implementation
export function getThresholdPrice(
	countryGroupId: CountryGroupId,
	contributionType: ContributionType,
): number | undefined {
	if (isRecurring(contributionType)) {
		const countryGroupThresholds =
			benefitsThresholdsByCountryGroup[countryGroupId];
		const threshold = countryGroupThresholds[contributionType];
		return threshold;
	}
}
