import type { RegularContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

export const checkoutTopUpUpperThresholdsByCountryGroup: Record<
	CountryGroupId,
	Record<RegularContributionType, number>
> = {
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
