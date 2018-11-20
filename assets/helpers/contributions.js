// @flow

// ----- Imports ----- //

import { roundDp } from 'helpers/utilities';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { currencies, spokenCurrencies } from 'helpers/internationalisation/currency';
import type { Radio } from 'components/radioToggle/radioToggle';
import type { AnnualContributionsTestVariant } from 'helpers/abTests/abtestDefinitions';
import { logException } from 'helpers/logger';
import { getAnnualAmounts } from 'helpers/abTests/helpers/annualContributions';

// ----- Types ----- //

export type PaymentMethodMap<T> = {|
  Stripe: T,
  PayPal: T,
  DirectDebit: T,
  None: T,
|};

// This lets us create a union type from the object keys,
// avoiding the need to specify them separately and keep them in sync!
// https://flow.org/en/docs/types/utilities/#toc-keys
// We need to supply the type parameter, but we're only using the keys
// so it's irrelevant - so we supply null
export type PaymentMethod = $Keys<PaymentMethodMap<null>>;

export type RegularContributionTypeMap<T> = {|
  MONTHLY: T,
  ANNUAL: T,
|};

export type ContributionTypeMap<T> = {|
  ...RegularContributionTypeMap<T>,
  ONE_OFF: T,
|};

export type RegularContributionType = $Keys<RegularContributionTypeMap<null>>;
export type ContributionType = $Keys<ContributionTypeMap<null>>;

export type PaymentMatrix<T> = ContributionTypeMap<PaymentMethodMap<T>>;

export const logInvalidCombination = (contributionType: ContributionType, paymentMethod: PaymentMethod) => {
  logException(`Invalid combination of contribution type ${contributionType} and payment method ${paymentMethod}`);
};

export type ThirdPartyPaymentLibraries = {
  ONE_OFF: { Stripe: Object },
  MONTHLY: { Stripe: Object, PayPal: Object },
  ANNUAL: { Stripe: Object, PayPal: Object },
};

export type BillingPeriod = 'Monthly' | 'Annual';

export type Amount = { value: string, spoken: string, isDefault: boolean };

type ParseError = 'ParseError';
export type ValidationError = 'TooMuch' | 'TooLittle';
export type ContributionError = ParseError | ValidationError;

export type ParsedContribution = {|
  valid: true,
  amount: number,
|} | {|
  error: ParseError,
|};

type Config = {
  [ContributionType]: {
    min: number,
    minInWords: string,
    max: number,
    maxInWords: string,
    default: number,
  }
}


// ----- Setup ----- //

/* eslint-disable quote-props */
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
  '40': 'forty',
  '50': 'fifty',
  '75': 'seventy five',
  '100': 'one hundred',
  '166': 'one hundred and sixty six',
  '200': 'two hundred',
  '250': 'two hundred and fifty',
  '500': 'five hundred',
  '750': 'seven hundred and fifty',
  '2000': 'two thousand',
  '16000': 'sixteen thousand',
};
/* eslint-enable  quote-props */

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

const config: { [CountryGroupId]: Config } = {
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
    ANNUAL: defaultConfig.ANNUAL,
    MONTHLY: {
      min: 2,
      minInWords: numbersInWords['2'],
      max: 166,
      maxInWords: numbersInWords['166'],
      default: 15,
    },
    ONE_OFF: defaultConfig.ONE_OFF,
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

const defaultOneOffAmount = [
  { value: '25', spoken: numbersInWords['25'], isDefault: false },
  { value: '50', spoken: numbersInWords['50'], isDefault: true },
  { value: '100', spoken: numbersInWords['100'], isDefault: false },
  { value: '250', spoken: numbersInWords['250'], isDefault: false },
];

const defaultMonthlyAmount = [
  { value: '7', spoken: numbersInWords['7'], isDefault: false },
  { value: '15', spoken: numbersInWords['15'], isDefault: true },
  { value: '30', spoken: numbersInWords['30'], isDefault: false },
];

const amounts = (annualTestVariant: string) => ({
  ONE_OFF: {
    GBPCountries: defaultOneOffAmount,
    UnitedStates: defaultOneOffAmount,
    EURCountries: defaultOneOffAmount,
    AUDCountries: [
      { value: '50', spoken: numbersInWords['50'], isDefault: false },
      { value: '100', spoken: numbersInWords['100'], isDefault: true },
      { value: '250', spoken: numbersInWords['250'], isDefault: false },
      { value: '500', spoken: numbersInWords['500'], isDefault: false },
    ],
    International: defaultOneOffAmount,
    NZDCountries: [
      { value: '50', spoken: numbersInWords['50'], isDefault: false },
      { value: '100', spoken: numbersInWords['100'], isDefault: true },
      { value: '250', spoken: numbersInWords['250'], isDefault: false },
      { value: '500', spoken: numbersInWords['500'], isDefault: false },
    ],
    Canada: defaultOneOffAmount,
  },
  MONTHLY: {
    UnitedStates: defaultMonthlyAmount,
    AUDCountries: [
      { value: '10', spoken: numbersInWords['10'], isDefault: false },
      { value: '20', spoken: numbersInWords['20'], isDefault: true },
      { value: '40', spoken: numbersInWords['40'], isDefault: false },
    ],
    GBPCountries: [
      { value: '2', spoken: numbersInWords['2'], isDefault: false },
      { value: '5', spoken: numbersInWords['5'], isDefault: true },
      { value: '10', spoken: numbersInWords['10'], isDefault: false },
    ],
    EURCountries: [
      { value: '6', spoken: numbersInWords['6'], isDefault: false },
      { value: '10', spoken: numbersInWords['10'], isDefault: true },
      { value: '20', spoken: numbersInWords['20'], isDefault: false },
    ],
    International: [
      { value: '5', spoken: numbersInWords['5'], isDefault: false },
      { value: '10', spoken: numbersInWords['10'], isDefault: true },
      { value: '20', spoken: numbersInWords['20'], isDefault: false },
    ],
    NZDCountries: [
      { value: '10', spoken: numbersInWords['10'], isDefault: false },
      { value: '20', spoken: numbersInWords['20'], isDefault: true },
      { value: '50', spoken: numbersInWords['50'], isDefault: false },
    ],
    Canada: [
      { value: '5', spoken: numbersInWords['5'], isDefault: false },
      { value: '10', spoken: numbersInWords['10'], isDefault: true },
      { value: '20', spoken: numbersInWords['20'], isDefault: false },
    ],
  },
  ANNUAL: getAnnualAmounts(annualTestVariant),
});


// ----- Functions ----- //

function validateContribution(
  input: number,
  contributionType: ContributionType,
  countryGroupId: CountryGroupId,
): ?ValidationError {

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
    return { error: 'ParseError' };
  }

  return { valid: true, amount: roundDp(amount) };

}

function getMinContribution(contributionType: ContributionType, countryGroupId: CountryGroupId): number {
  return config[countryGroupId][contributionType].min;
}

function toContributionTypeOrElse(s: ?string, fallback: ContributionType): ContributionType {
  switch ((s || fallback).toUpperCase()) {
    case 'ANNUAL': return 'ANNUAL';
    case 'MONTHLY': return 'MONTHLY';
    case 'ONE_OFF': return 'ONE_OFF';
    default: return fallback;
  }
}

function parseRegularContributionType(s: string): RegularContributionType {

  if (s === 'ANNUAL') {
    return 'ANNUAL';
  }

  return 'MONTHLY';

}

function billingPeriodFromContrib(contrib: ContributionType): BillingPeriod {
  switch (contrib) {
    case 'ANNUAL': return 'Annual';
    default: return 'Monthly';
  }
}

function errorMessage(
  error: ContributionError,
  contributionType: ContributionType,
  countryGroupId: CountryGroupId,
): ?string {

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

function getContributionTypeClassName(contributionType: ContributionType): string {

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
    return 'a month';
  }

  return 'a year';

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

  return `Enter an amount of ${config[countryGroupId][contributionType].minInWords}
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
  contributionType: ContributionType,
  currencyId: IsoCurrency,
  countryGroupId: CountryGroupId,
  annualTestVariant: AnnualContributionsTestVariant,
): Radio[] {

  return amounts(annualTestVariant)[contributionType][countryGroupId].map(amount => ({
    value: amount.value,
    text: `${currencies[currencyId].glyph}${amount.value}`,
    accessibilityHint: getAmountA11yHint(contributionType, currencyId, amount.spoken),
  }));

}


// ----- Exports ----- //

export {
  config,
  amounts,
  toContributionTypeOrElse,
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
};
