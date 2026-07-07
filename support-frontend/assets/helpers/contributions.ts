// ----- Imports ----- //
import { contributionsOnlyCountries } from '@modules/internationalisation/contributionsOnlyCountries';
import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';

// ----- Types ----- //
type RegularContributionTypeMap<T> = {
	MONTHLY: T;
	ANNUAL: T;
};

type ContributionTypeMap<T> = RegularContributionTypeMap<T> & {
	ONE_OFF: T;
};

export type ContributionType = keyof ContributionTypeMap<null>;

export interface AmountValuesObject {
	amounts: number[];
	defaultAmount: number;
	hideChooseYourAmount: boolean;
}

type AmountsCardData = Record<ContributionType, AmountValuesObject>;

interface AmountsVariant {
	variantName: string;
	defaultContributionType: ContributionType;
	displayContributionType: ContributionType[];
	amountsCardData: AmountsCardData;
}
export interface SelectedAmountsVariant extends AmountsVariant {
	testName: string;
}

type ContributionTypeSetting = {
	contributionType: ContributionType;
	isDefault?: boolean;
};

export type ContributionTypes = Record<
	CountryGroupId,
	ContributionTypeSetting[]
>;

type Config = Record<
	ContributionType,
	{
		min: number;
		max: number;
	}
>;

const defaultConfig: Config = {
	ANNUAL: {
		min: 10,
		max: 2000,
	},
	MONTHLY: {
		min: 2,
		max: 166,
	},
	ONE_OFF: {
		min: 1,
		max: 2000,
	},
};

const config: Record<CountryGroupId, Config> = {
	GBPCountries: defaultConfig,
	AUDCountries: {
		ANNUAL: defaultConfig.ANNUAL,
		MONTHLY: {
			min: 2,
			max: 200,
		},
		ONE_OFF: {
			min: 1,
			max: 25000,
		},
	},
	EURCountries: {
		ANNUAL: defaultConfig.ANNUAL,
		MONTHLY: {
			min: 2,
			max: 166,
		},
		ONE_OFF: defaultConfig.ONE_OFF,
	},
	UnitedStates: {
		ANNUAL: {
			...defaultConfig.ANNUAL,
			max: 10000,
		},
		MONTHLY: {
			min: 2,
			max: 800,
		},
		ONE_OFF: {
			...defaultConfig.ONE_OFF,
			max: 10000,
		},
	},
	International: {
		ANNUAL: defaultConfig.ANNUAL,
		MONTHLY: {
			min: 2,
			max: 166,
		},
		ONE_OFF: defaultConfig.ONE_OFF,
	},
	NZDCountries: {
		ANNUAL: defaultConfig.ANNUAL,
		MONTHLY: {
			min: 2,
			max: 200,
		},
		ONE_OFF: defaultConfig.ONE_OFF,
	},
	Canada: {
		ANNUAL: defaultConfig.ANNUAL,
		MONTHLY: {
			min: 2,
			max: 166,
		},
		ONE_OFF: defaultConfig.ONE_OFF,
	},
};

const contributionsOnlyCountriesAmountsConfig = {
	defaultContributionType: 'MONTHLY',
	displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
	amountsCardData: {
		ONE_OFF: {
			amounts: [1, 2, 5, 10],
			defaultAmount: 2,
			hideChooseYourAmount: true,
		},
		MONTHLY: {
			amounts: [2, 3, 5, 7, 9, 12],
			defaultAmount: 5,
			hideChooseYourAmount: true,
		},
		ANNUAL: {
			amounts: [10, 15, 20, 30],
			defaultAmount: 15,
			hideChooseYourAmount: true,
		},
	},
};

const countries = new Set(contributionsOnlyCountries);

const isContributionsOnlyCountry = (countryId: IsoCountry): boolean =>
	countries.has(countryId);

// ----- Exports ----- //
export {
	config,
	isContributionsOnlyCountry,
	contributionsOnlyCountriesAmountsConfig,
};
