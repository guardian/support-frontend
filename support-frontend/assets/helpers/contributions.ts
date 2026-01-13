// ----- Imports ----- //
import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';

// ----- Types ----- //
export const contributionTypes = ['ONE_OFF', 'MONTHLY', 'ANNUAL'];

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

export interface AmountsVariant {
	variantName: string;
	defaultContributionType: ContributionType;
	displayContributionType: ContributionType[];
	amountsCardData: AmountsCardData;
}

export type AmountsTestTargeting =
	| { targetingType: 'Region'; region: CountryGroupId }
	| { targetingType: 'Country'; countries: IsoCountry[] };

export interface AmountsTest {
	testName: string;
	liveTestName?: string;
	isLive: boolean;
	targeting: AmountsTestTargeting;
	order: number;
	seed: number;
	variants: AmountsVariant[];
}

export type AmountsTests = AmountsTest[];

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
		minInWords: string;
		max: number;
		maxInWords: string;
		default: number; // TODO - remove this field once old payment flow has gone
	}
>;

export type OtherAmounts = Record<
	ContributionType,
	{
		amount: string | null;
	}
>;

export type SelectedAmounts = Record<ContributionType, number | 'other'>;

// ----- Setup ----- //

const numbersInWords = {
	'1': 'one',
	'2': 'two',
	'5': 'five',
	'6': 'six',
	'7': 'seven',
	'10': 'ten',
	'15': 'fifteen',
	'20': 'twenty',
	'25': 'twenty five',
	'30': 'thirty',
	'35': 'thirty five',
	'40': 'forty',
	'50': 'fifty',
	'75': 'seventy five',
	'100': 'one hundred',
	'125': 'one hundred and twenty five',
	'166': 'one hundred and sixty six',
	'200': 'two hundred',
	'250': 'two hundred and fifty',
	'275': 'two hundred and seventy five',
	'500': 'five hundred',
	'750': 'seven hundred and fifty',
	'800': 'eight hundred',
	'2000': 'two thousand',
	'10000': 'ten thousand',
	'16000': 'sixteen thousand',
} as const;

const defaultConfig: Config = {
	ANNUAL: {
		min: 10,
		minInWords: numbersInWords['10'],
		max: 2000,
		maxInWords: numbersInWords['2000'],
		default: 50,
	},
	MONTHLY: {
		min: 2,
		minInWords: numbersInWords['2'],
		max: 166,
		maxInWords: numbersInWords['166'],
		default: 5,
	},
	ONE_OFF: {
		min: 1,
		minInWords: numbersInWords['1'],
		max: 2000,
		maxInWords: numbersInWords['2000'],
		default: 50,
	},
};

const config: Record<CountryGroupId, Config> = {
	GBPCountries: defaultConfig,
	AUDCountries: {
		ANNUAL: defaultConfig.ANNUAL,
		MONTHLY: {
			min: 2,
			minInWords: numbersInWords['2'],
			max: 200,
			maxInWords: numbersInWords['200'],
			default: 20,
		},
		ONE_OFF: {
			min: 1,
			minInWords: numbersInWords['1'],
			max: 16000,
			maxInWords: numbersInWords['16000'],
			default: 50,
		},
	},
	EURCountries: {
		ANNUAL: defaultConfig.ANNUAL,
		MONTHLY: {
			min: 2,
			minInWords: numbersInWords['2'],
			max: 166,
			maxInWords: numbersInWords['166'],
			default: 10,
		},
		ONE_OFF: defaultConfig.ONE_OFF,
	},
	UnitedStates: {
		ANNUAL: {
			...defaultConfig.ANNUAL,
			max: 10000,
			maxInWords: numbersInWords['10000'],
		},
		MONTHLY: {
			min: 2,
			minInWords: numbersInWords['2'],
			max: 800,
			maxInWords: numbersInWords['800'],
			default: 15,
		},
		ONE_OFF: {
			...defaultConfig.ONE_OFF,
			max: 10000,
			maxInWords: numbersInWords['10000'],
		},
	},
	International: {
		ANNUAL: defaultConfig.ANNUAL,
		MONTHLY: {
			min: 2,
			minInWords: numbersInWords['2'],
			max: 166,
			maxInWords: numbersInWords['166'],
			default: 10,
		},
		ONE_OFF: defaultConfig.ONE_OFF,
	},
	NZDCountries: {
		ANNUAL: defaultConfig.ANNUAL,
		MONTHLY: {
			min: 2,
			minInWords: numbersInWords['2'],
			max: 200,
			maxInWords: numbersInWords['200'],
			default: 20,
		},
		ONE_OFF: defaultConfig.ONE_OFF,
	},
	Canada: {
		ANNUAL: defaultConfig.ANNUAL,
		MONTHLY: {
			min: 2,
			minInWords: numbersInWords['2'],
			max: 166,
			maxInWords: numbersInWords['166'],
			default: 10,
		},
		ONE_OFF: defaultConfig.ONE_OFF,
	},
};

const contributionsOnlyAmountsTestName = 'VAT_COMPLIANCE';

const isContributionsOnlyCountry = (
	amountsVariant: SelectedAmountsVariant,
): boolean => {
	const { testName } = amountsVariant;
	return testName === contributionsOnlyAmountsTestName;
};

// ----- Exports ----- //
export { config, contributionsOnlyAmountsTestName, isContributionsOnlyCountry };
