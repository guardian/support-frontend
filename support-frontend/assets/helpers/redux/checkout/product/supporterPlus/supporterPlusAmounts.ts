import type { ContributionAmounts } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

type SupporterPlusAmounts = Record<CountryGroupId, ContributionAmounts>;
export const SUPPORTER_PLUS_AMOUNTS: SupporterPlusAmounts = {
	GBPCountries: {
		ONE_OFF: {
			amounts: [30, 60, 120, 240],
			defaultAmount: 60,
		},
		MONTHLY: {
			amounts: [5, 10, 15, 20],
			defaultAmount: 10,
		},
		ANNUAL: {
			amounts: [60, 95, 240, 480],
			defaultAmount: 95,
		},
	},
	UnitedStates: {
		ONE_OFF: {
			amounts: [25, 50, 100, 250],
			defaultAmount: 50,
		},
		MONTHLY: {
			amounts: [7, 13, 30],
			defaultAmount: 13,
		},
		ANNUAL: {
			amounts: [50, 120, 199, 500],
			defaultAmount: 120,
		},
	},
	Canada: {
		ONE_OFF: {
			amounts: [25, 50, 100, 250],
			defaultAmount: 50,
		},
		MONTHLY: {
			amounts: [5, 13, 22],
			defaultAmount: 13,
		},
		ANNUAL: {
			amounts: [60, 120, 219, 500],
			defaultAmount: 120,
		},
	},
	EURCountries: {
		ONE_OFF: {
			amounts: [25, 50, 100, 250],
			defaultAmount: 50,
		},
		MONTHLY: {
			amounts: [8, 10, 18, 22],
			defaultAmount: 10,
		},
		ANNUAL: {
			amounts: [50, 95, 250, 500],
			defaultAmount: 95,
		},
	},
	NZDCountries: {
		ONE_OFF: {
			amounts: [50, 100, 250, 500],
			defaultAmount: 100,
		},
		MONTHLY: {
			amounts: [10, 17, 50],
			defaultAmount: 17,
		},
		ANNUAL: {
			amounts: [75, 160, 235, 500],
			defaultAmount: 160,
		},
	},
	International: {
		ONE_OFF: {
			amounts: [50, 100, 250, 500],
			defaultAmount: 100,
		},
		MONTHLY: {
			amounts: [5, 13, 20, 50],
			defaultAmount: 13,
		},
		ANNUAL: {
			amounts: [60, 120, 199, 500],
			defaultAmount: 120,
		},
	},
	AUDCountries: {
		ONE_OFF: {
			amounts: [60, 100, 250, 500],
			defaultAmount: 100,
		},
		MONTHLY: {
			amounts: [10, 17, 30, 40],
			defaultAmount: 17,
		},
		ANNUAL: {
			amounts: [75, 160, 300, 500],
			defaultAmount: 160,
		},
	},
};
