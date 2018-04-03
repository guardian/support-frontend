// @flow

// ----- Imports ----- //

import { roundDp } from 'helpers/utilities';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';
import { spokenCurrencies } from 'helpers/internationalisation/currency';

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { Radio } from 'components/radioToggle/radioToggle';
import type { Currency } from 'helpers/internationalisation/currency';

// ----- Types ----- //

export type Contrib = 'ANNUAL' | 'MONTHLY' | 'ONE_OFF';

export type BillingPeriod = 'Monthly' | 'Annual';

export type ContribError =
  | 'tooLittle'
  | 'tooMuch'
  | 'invalidEntry';

export type Amount = {
  value: string,
  userDefined: boolean,
};

export type Amounts = {
  annual: Amount,
  monthly: Amount,
  oneOff: Amount,
};

export type ParsedContrib = {
  amount: number,
  error: ?ContribError,
};

export type ParsedAmount = {
  error: ?ContribError,
  customAmount: ?number,
};

type Config = {
  [Contrib]: {
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
  '250': 'two hundred and fifty',
  '500': 'five hundred',
  '2000': 'two thousand',
};
/* eslint-enable  quote-props */

const defaultConfig: Config = {
  ANNUAL: {
    min: 50,
    minInWords: numbersInWords['50'],
    max: 2000,
    maxInWords: numbersInWords['2000'],
    default: 75,
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
      max: 166,
      maxInWords: numbersInWords['166'],
      default: 20,
    },
    ONE_OFF: defaultConfig.ONE_OFF,
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
  { value: '25', spoken: numbersInWords['25'] },
  { value: '50', spoken: numbersInWords['50'] },
  { value: '100', spoken: numbersInWords['100'] },
  { value: '250', spoken: numbersInWords['250'] },
];

const defaultMonthlyAmount = [
  { value: '7', spoken: numbersInWords['7'] },
  { value: '15', spoken: numbersInWords['15'] },
  { value: '30', spoken: numbersInWords['30'] },
];

const defaultAnnualAmount = [
  { value: '50', spoken: numbersInWords['50'] },
  { value: '75', spoken: numbersInWords['75'] },
  { value: '100', spoken: numbersInWords['100'] },
];

const amounts = {
  ONE_OFF: {
    GBPCountries: defaultOneOffAmount,
    UnitedStates: defaultOneOffAmount,
    EURCountries: defaultOneOffAmount,
    AUDCountries: [
      { value: '50', spoken: numbersInWords['50'] },
      { value: '100', spoken: numbersInWords['100'] },
      { value: '250', spoken: numbersInWords['250'] },
      { value: '500', spoken: numbersInWords['500'] },
    ],
    International: defaultOneOffAmount,
    NZDCountries: defaultOneOffAmount,
  },
  MONTHLY: {
    UnitedStates: defaultMonthlyAmount,
    AUDCountries: [
      { value: '10', spoken: numbersInWords['10'] },
      { value: '20', spoken: numbersInWords['20'] },
      { value: '40', spoken: numbersInWords['40'] },
    ],
    GBPCountries: [
      { value: '2', spoken: numbersInWords['2'] },
      { value: '5', spoken: numbersInWords['5'] },
      { value: '10', spoken: numbersInWords['10'] },
    ],
    EURCountries: [
      { value: '6', spoken: numbersInWords['6'] },
      { value: '10', spoken: numbersInWords['10'] },
      { value: '20', spoken: numbersInWords['20'] },
    ],
    International: [
      { value: '5', spoken: numbersInWords['5'] },
      { value: '10', spoken: numbersInWords['10'] },
      { value: '20', spoken: numbersInWords['20'] },
    ],
    NZDCountries: [
      { value: '5', spoken: numbersInWords['5'] },
      { value: '10', spoken: numbersInWords['10'] },
      { value: '20', spoken: numbersInWords['20'] },
    ],
  },
  ANNUAL: {
    GBPCountries: defaultAnnualAmount,
    UnitedStates: defaultAnnualAmount,
    AUDCountries: defaultAnnualAmount,
    EURCountries: defaultAnnualAmount,
    International: defaultAnnualAmount,
    NZDCountries: defaultAnnualAmount,
  },
};

// ----- Functions ----- //

function parse(input: ?string, contrib: Contrib, countryGroupId: CountryGroupId): ParsedContrib {

  let error = null;
  const numericAmount = Number(input);

  if (input === undefined || input === null || input === '' || Number.isNaN(numericAmount)) {
    error = 'invalidEntry';
  } else if (numericAmount < config[countryGroupId][contrib].min) {
    error = 'tooLittle';
  } else if (numericAmount > config[countryGroupId][contrib].max) {
    error = 'tooMuch';
  }

  const amount = error ? config[countryGroupId][contrib].default : roundDp(numericAmount);

  return { error, amount };

}

function circlesParse(
  input: string,
  contributionType: Contrib,
  countryGroupId: CountryGroupId,
): ParsedAmount {

  const customAmount = Number(input);

  if (input === '' || Number.isNaN(customAmount)) {
    return { error: 'invalidEntry', customAmount: null };
  } else if (customAmount < config[countryGroupId][contributionType].min) {
    return { error: 'tooLittle', customAmount };
  } else if (customAmount > config[countryGroupId][contributionType].max) {
    return { error: 'tooMuch', customAmount };
  }

  return { error: null, customAmount };

}

function parseContrib(s: ?string, contrib: Contrib): Contrib {
  switch ((s || contrib).toUpperCase()) {
    case 'ANNUAL': return 'ANNUAL';
    case 'MONTHLY': return 'MONTHLY';
    case 'ONE_OFF': return 'ONE_OFF';
    default: return contrib;
  }
}

function billingPeriodFromContrib(contrib: Contrib): BillingPeriod {
  switch (contrib) {
    case 'ANNUAL': return 'Annual';
    default: return 'Monthly';
  }
}

function errorMessage(
  error: ContribError,
  contributionType: Contrib,
  countryGroupId: CountryGroupId,
): ?string {

  const minContrib = config[countryGroupId][contributionType].min;
  const maxContrib = config[countryGroupId][contributionType].max;
  const currency = currencies[countryGroups[countryGroupId].currency];

  switch (error) {
    case 'tooLittle':
      return `Please enter at least ${currency.glyph}${minContrib}`;
    case 'tooMuch':
      return `${currency.glyph}${maxContrib} is the maximum we can accept`;
    case 'invalidEntry':
      return 'Please enter a numeric amount';
    default:
      return null;
  }

}

function getContribKey(contrib: Contrib): string {

  switch (contrib) {
    case 'ANNUAL': return 'annual';
    case 'MONTHLY': return 'monthly';
    default: return 'oneOff';
  }

}

function getOneOffName(countryGroupId: CountryGroupId) {
  return countryGroupId === 'UnitedStates' ? 'One-time' : 'One-off';
}

function getOneOffSpokenName(countryGroupId: CountryGroupId) {
  return countryGroupId === 'UnitedStates' ? 'one time' : 'one off';
}

function getContributionTypeClassName(contributionType: Contrib) {

  if (contributionType === 'ONE_OFF') {
    return 'one-off';
  } else if (contributionType === 'MONTHLY') {
    return 'monthly';
  }

  return 'annual';

}

function getSpokenType(
  contributionType: Contrib,
  countryGroupId: CountryGroupId,
) {

  if (contributionType === 'ONE_OFF') {
    return getOneOffSpokenName(countryGroupId);
  } else if (contributionType === 'MONTHLY') {
    return 'monthly';
  }

  return 'annual';

}

/* ------- contributionAmounts functions -----*/

function getA11yHint(
  contributionType: Contrib,
  currency: Currency,
  spokenAmount: string,
): string {

  const spokenCurrency = spokenCurrencies[currency.iso].plural;

  if (contributionType === 'ONE_OFF') {
    return `make a one-off contribution of ${spokenAmount} ${spokenCurrency}`;
  } else if (contributionType === 'MONTHLY') {
    return `contribute ${spokenAmount} ${spokenCurrency} per month`;
  }

  return `contribute ${spokenAmount} ${spokenCurrency} annually`;

}

function getCustomAmountA11yHint(
  contributionType: Contrib,
  countryGroupId: CountryGroupId,
): string {

  const isoCurrency = countryGroups[countryGroupId].currency;
  let spokenCurrency = spokenCurrencies[isoCurrency].plural;

  if (contributionType === 'ONE_OFF') {
    spokenCurrency = spokenCurrencies[isoCurrency].singular;
  }

  return `Enter an amount of ${config[countryGroupId][contributionType].minInWords}
    ${spokenCurrency} or more for your 
    ${getSpokenType(contributionType, countryGroupId)} contribution.`;

}

function getAmountA11yHint(
  contributionType: Contrib,
  currency: Currency,
  spokenAmount: string,
): string {

  const spokenCurrency = spokenCurrencies[currency.iso].plural;

  if (contributionType === 'ONE_OFF') {
    return `make a one-off contribution of ${spokenAmount} ${spokenCurrency}`;
  } else if (contributionType === 'MONTHLY') {
    return `contribute ${spokenAmount} ${spokenCurrency} per month`;
  }

  return `contribute ${spokenAmount} ${spokenCurrency} annually`;

}


function getContributionTypeRadios(countryGroupId: CountryGroupId) {

  return [
    {
      value: 'MONTHLY',
      text: 'Monthly',
      accessibilityHint: 'Make a regular monthly contribution',
    },
    {
      value: 'ONE_OFF',
      text: getOneOffName(countryGroupId),
      accessibilityHint: `Make a ${getOneOffSpokenName(countryGroupId)} contribution`,
      id: 'qa-one-off-toggle',
    },
  ];

}


function getContributionAmountRadios(
  contributionType: Contrib,
  currency: Currency,
  countryGroupId: CountryGroupId,
): Radio[] {

  return amounts[contributionType][countryGroupId].map(amount => ({
    value: amount.value,
    text: `${currency.glyph}${amount.value}`,
    accessibilityHint: getAmountA11yHint(contributionType, currency, amount.spoken),
  }));

}


function getContributionAmounts(
  contributionType: Contrib,
  currency: Currency,
  countryGroupId: CountryGroupId,
): Radio[] {

  return amounts[contributionType][countryGroupId].map(amount => ({
    value: amount.value,
    text: `${currency.glyph}${amount.value}`,
    accessibilityHint: getA11yHint(contributionType, currency, amount.spoken),
  }));
}


/* ------ getContributionsType Functions -----*/

function getClassName(contributionType: Contrib) {

  if (contributionType === 'ONE_OFF') {
    return 'one-off';
  } else if (contributionType === 'MONTHLY') {
    return 'monthly';
  }

  return 'annual';

}

function getContributionTypes(countryGroupId: CountryGroupId) {

  return [
    {
      value: 'MONTHLY',
      text: 'Monthly',
      accessibilityHint: 'Make a regular monthly contribution',
    },
    {
      value: 'ONE_OFF',
      text: getOneOffName(countryGroupId),
      accessibilityHint: `Make a ${getOneOffSpokenName(countryGroupId)} contribution`,
    },
  ];

}

// ----- Exports ----- //

export {
  config,
  parse,
  parseContrib,
  circlesParse,
  billingPeriodFromContrib,
  errorMessage,
  getContribKey,
  getOneOffName,
  getOneOffSpokenName,
  getContributionTypeClassName,
  getSpokenType,
  getContributionAmounts,
  getClassName,
  getContributionTypes,
  getCustomAmountA11yHint,
  getContributionTypeRadios,
  getContributionAmountRadios,
};
