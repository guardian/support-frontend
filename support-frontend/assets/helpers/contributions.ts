// ----- Imports ----- //
import type { ThirdPartyPaymentLibrary } from 'helpers/forms/checkouts';
import type {
	PaymentMethod,
	PaymentMethodMap,
} from 'helpers/forms/paymentMethods';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { Annual, Monthly } from 'helpers/productPrice/billingPeriods';
import { logException } from 'helpers/utilities/logger';
import { roundDp } from 'helpers/utilities/utilities';

// ----- Types ----- //
export type RegularContributionTypeMap<T> = {
	MONTHLY: T;
	ANNUAL: T;
};

export type ContributionTypeMap<T> = RegularContributionTypeMap<T> & {
	ONE_OFF: T;
};

export type RegularContributionType = keyof RegularContributionTypeMap<null>;
export type ContributionType = keyof ContributionTypeMap<null>;
export type PaymentMatrix<T> = ContributionTypeMap<PaymentMethodMap<T>>;

export const contributionTypeIsRecurring = (
	contributionType: ContributionType,
) => contributionType === 'MONTHLY' || contributionType === 'ANNUAL';

export const logInvalidCombination = (
	contributionType: ContributionType,
	paymentMethod: PaymentMethod,
) => {
	logException(
		`Invalid combination of contribution type ${contributionType} and payment method ${paymentMethod}`,
	);
};

// Legacy type, only used by stripe checkout. Can be cleaned up after stripe checkout fully removed
export type ThirdPartyPaymentLibraries = {
	ONE_OFF: {
		Stripe: ThirdPartyPaymentLibrary | null;
	};
	MONTHLY: {
		Stripe: ThirdPartyPaymentLibrary | null;
	};
	ANNUAL: {
		Stripe: ThirdPartyPaymentLibrary | null;
	};
};
export type AmountSelection = {
	amounts: number[];
	defaultAmount: number;
};
export type ContributionAmounts = {
	[type in ContributionType]: AmountSelection;
};
export type AmountsTestVariant = {
	name: string;
	amounts: ContributionAmounts;
};
export type AmountsTest = {
	name: string;
	isLive: boolean;
	variants: AmountsTestVariant[];
	seed: number;
};
export type ConfiguredRegionAmounts = {
	control: ContributionAmounts;
	test?: AmountsTest;
};
export type ConfiguredAmounts = Record<CountryGroupId, ConfiguredRegionAmounts>;
export type ContributionTypeSetting = {
	contributionType: ContributionType;
	isDefault?: boolean;
};
export type ContributionTypes = Record<
	CountryGroupId,
	ContributionTypeSetting[]
>;
type ParseError = 'ParseError';
export type ValidationError = 'TooMuch' | 'TooLittle';
export type ContributionError = ParseError | ValidationError;
export type ParsedContribution =
	| {
			valid: true;
			amount: number;
	  }
	| {
			error: ParseError;
	  };
export type Config = Record<
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

const getAmount = (
	selectedAmounts: SelectedAmounts,
	otherAmounts: OtherAmounts,
	contributionType: ContributionType,
) =>
	parseFloat(
		selectedAmounts[contributionType] === 'other'
			? otherAmounts[contributionType].amount
			: selectedAmounts[contributionType],
	);

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
};

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
			min: 10,
			minInWords: numbersInWords['10'],
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
			min: 5,
			minInWords: numbersInWords['5'],
			max: 166,
			maxInWords: numbersInWords['166'],
			default: 10,
		},
		ONE_OFF: defaultConfig.ONE_OFF,
	},
	NZDCountries: {
		ANNUAL: defaultConfig.ANNUAL,
		MONTHLY: {
			min: 10,
			minInWords: numbersInWords['10'],
			max: 200,
			maxInWords: numbersInWords['200'],
			default: 20,
		},
		ONE_OFF: defaultConfig.ONE_OFF,
	},
	Canada: {
		ANNUAL: defaultConfig.ANNUAL,
		MONTHLY: {
			min: 5,
			minInWords: numbersInWords['5'],
			max: 166,
			maxInWords: numbersInWords['166'],
			default: 10,
		},
		ONE_OFF: defaultConfig.ONE_OFF,
	},
};

// ----- Functions ----- //
function validateContribution(
	input: number,
	contributionType: ContributionType,
	countryGroupId: CountryGroupId,
): ValidationError | null | undefined {
	if (input < config[countryGroupId][contributionType].min) {
		return 'TooLittle';
	} else if (input > config[countryGroupId][contributionType].max) {
		return 'TooMuch';
	}

	return null;
}

function parseContribution(input: string): ParsedContribution {
	const amount = Number(input);

	if (input === '' || Number.isNaN(amount)) {
		return {
			error: 'ParseError',
		};
	}

	return {
		valid: true,
		amount: roundDp(amount),
	};
}

function getMinContribution(
	contributionType: ContributionType,
	countryGroupId: CountryGroupId,
): number {
	return config[countryGroupId][contributionType].min;
}

function toContributionType(
	s: string | null | undefined,
): ContributionType | null | undefined {
	if (s) {
		switch (s.toUpperCase()) {
			case 'ANNUAL':
				return 'ANNUAL';

			case 'MONTHLY':
				return 'MONTHLY';

			case 'ONE_OFF':
				return 'ONE_OFF';

			case 'SINGLE':
				return 'ONE_OFF';

			default:
				return null;
		}
	}

	return null;
}

function generateContributionTypes(
	contributionTypes: ContributionTypeSetting[],
): ContributionTypes {
	return {
		GBPCountries: contributionTypes,
		UnitedStates: contributionTypes,
		AUDCountries: contributionTypes,
		EURCountries: contributionTypes,
		NZDCountries: contributionTypes,
		Canada: contributionTypes,
		International: contributionTypes,
	};
}

function parseRegularContributionType(s: string): RegularContributionType {
	if (s === 'ANNUAL') {
		return 'ANNUAL';
	}

	return 'MONTHLY';
}

function billingPeriodFromContrib(
	contributionType: ContributionType,
): BillingPeriod {
	switch (contributionType) {
		case 'ANNUAL':
			return Annual;

		default:
			return Monthly;
	}
}

function errorMessage(
	error: ContributionError,
	contributionType: ContributionType,
	countryGroupId: CountryGroupId,
): string | null | undefined {
	const minContrib = config[countryGroupId][contributionType].min;
	const maxContrib = config[countryGroupId][contributionType].max;
	const currency = currencies[countryGroups[countryGroupId].currency];

	switch (error) {
		case 'TooLittle':
			return `Please enter at least ${currency.glyph}${minContrib}`;

		case 'TooMuch':
			return `${currency.glyph}${maxContrib} is the maximum we can accept`;

		case 'ParseError':
			return 'Please enter a numeric amount';

		default:
			return null;
	}
}

function getContributionTypeClassName(
	contributionType: ContributionType,
): string {
	if (contributionType === 'ONE_OFF') {
		return 'one-off';
	} else if (contributionType === 'ANNUAL') {
		return 'annual';
	}

	return 'monthly';
}

function getSpokenType(contributionType: ContributionType): string {
	if (contributionType === 'ONE_OFF') {
		return 'single';
	} else if (contributionType === 'ANNUAL') {
		return 'annual';
	}

	return 'monthly';
}

function getFrequency(contributionType: ContributionType): string {
	if (contributionType === 'ONE_OFF') {
		return '';
	} else if (contributionType === 'MONTHLY') {
		return 'per month';
	}

	return 'per year';
}

function getCustomAmountA11yHint(
	contributionType: ContributionType,
	countryGroupId: CountryGroupId,
): string {
	const isoCurrency = countryGroups[countryGroupId].currency;
	let spokenCurrency = spokenCurrencies[isoCurrency].plural;

	if (contributionType === 'ONE_OFF') {
		spokenCurrency = spokenCurrencies[isoCurrency].singular;
	}

	return `Enter an amount of ${
		config[countryGroupId][contributionType].minInWords
	}
    ${spokenCurrency} or more for your
    ${getSpokenType(contributionType)} contribution.`;
}

function getAmountA11yHint(
	contributionType: ContributionType,
	currencyId: IsoCurrency,
	spokenAmount: string,
): string {
	const spokenCurrency = spokenCurrencies[currencyId].plural;

	if (contributionType === 'ONE_OFF') {
		return `make a single contribution of ${spokenAmount} ${spokenCurrency}`;
	} else if (contributionType === 'MONTHLY') {
		return `contribute ${spokenAmount} ${spokenCurrency} a month`;
	}

	return `contribute ${spokenAmount} ${spokenCurrency} annually`;
}

type Radio = {
	id?: string;
	value: string;
	text: string;
	accessibilityHint?: string | null | undefined;
};
const contributionTypeRadios = [
	{
		value: 'ONE_OFF',
		text: 'Single',
		accessibilityHint: 'Make a single contribution',
		id: 'qa-one-off-toggle',
	},
	{
		value: 'MONTHLY',
		text: 'Monthly',
		accessibilityHint: 'Make a regular monthly contribution',
	},
	{
		value: 'ANNUAL',
		text: 'Annually',
		accessibilityHint: 'Make a regular annual contribution',
	},
];

function getContributionAmountRadios(
	amounts: number[],
	contributionType: ContributionType,
	currencyId: IsoCurrency,
): Radio[] {
	return amounts.map((amount) => ({
		value: amount.toString(),
		text: `${currencies[currencyId].glyph}${amount}`,
		accessibilityHint: getAmountA11yHint(
			contributionType,
			currencyId,
			numbersInWords[amount],
		),
	}));
}

const contributionTypeAvailable = (
	contributionType: ContributionType,
	countryGroupId: CountryGroupId,
	contributionTypes: ContributionTypes,
): boolean =>
	contributionTypes[countryGroupId].some(
		(settings) => settings.contributionType === contributionType,
	);

// ----- Exports ----- //
export {
	config,
	toContributionType,
	generateContributionTypes,
	validateContribution,
	parseContribution,
	getMinContribution,
	billingPeriodFromContrib,
	errorMessage,
	getContributionTypeClassName,
	getSpokenType,
	getFrequency,
	getCustomAmountA11yHint,
	contributionTypeRadios,
	getContributionAmountRadios,
	parseRegularContributionType,
	getAmount,
	contributionTypeAvailable,
};
