// @flow

// ----- Imports ----- //

import { roundDp } from 'helpers/utilities';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';
import { spokenCurrencies } from 'helpers/internationalisation/currency';

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { Radio } from 'components/radioToggle/radioToggle';
import type { IsoCurrency } from 'helpers/internationalisation/currency';


// ----- Types ----- //

export type RegularContributionType = 'ANNUAL' | 'MONTHLY';
export type Contrib = RegularContributionType | 'ONE_OFF';

export type BillingPeriod = 'Monthly' | 'Annual';

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
      min: 5,
      minInWords: numbersInWords['5'],
      max: 166,
      maxInWords: numbersInWords['166'],
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
      min: 5,
      minInWords: numbersInWords['5'],
      max: 166,
      maxInWords: numbersInWords['166'],
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
  { value: '25', spoken: numbersInWords['25'] },
  { value: '50', spoken: numbersInWords['50'] },
  { value: '100', spoken: numbersInWords['100'] },
  { value: '250', spoken: numbersInWords['250'] },
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
    NZDCountries: [
      { value: '50', spoken: numbersInWords['50'] },
      { value: '100', spoken: numbersInWords['100'] },
      { value: '250', spoken: numbersInWords['250'] },
      { value: '500', spoken: numbersInWords['500'] },
    ],
    Canada: defaultOneOffAmount,
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
      { value: '10', spoken: numbersInWords['10'] },
      { value: '20', spoken: numbersInWords['20'] },
      { value: '50', spoken: numbersInWords['50'] },
    ],
    Canada: [
      { value: '5', spoken: numbersInWords['5'] },
      { value: '10', spoken: numbersInWords['10'] },
      { value: '20', spoken: numbersInWords['20'] },
    ],
  },
  ANNUAL: {
    GBPCountries: defaultAnnualAmount,
    UnitedStates: defaultAnnualAmount,
    AUDCountries: [
      { value: '50', spoken: numbersInWords['50'] },
      { value: '100', spoken: numbersInWords['100'] },
      { value: '250', spoken: numbersInWords['250'] },
      { value: '500', spoken: numbersInWords['500'] },
    ],
    EURCountries: defaultAnnualAmount,
    International: defaultAnnualAmount,
    NZDCountries: [
      { value: '50', spoken: numbersInWords['50'] },
      { value: '100', spoken: numbersInWords['100'] },
      { value: '250', spoken: numbersInWords['250'] },
      { value: '500', spoken: numbersInWords['500'] },
    ],
    Canada: defaultAnnualAmount,
  },
};


// ----- Functions ----- //

function validateContribution(
  input: number,
  contributionType: Contrib,
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

function getMinContribution(contributionType: Contrib, countryGroupId: CountryGroupId): number {
  return config[countryGroupId][contributionType].min;
}

function parseContrib(s: ?string, contrib: Contrib): Contrib {
  switch ((s || contrib).toUpperCase()) {
    case 'ANNUAL': return 'ANNUAL';
    case 'MONTHLY': return 'MONTHLY';
    case 'ONE_OFF': return 'ONE_OFF';
    default: return contrib;
  }
}

function parseRegularContributionType(s: string): RegularContributionType {

  if (s === 'ANNUAL') {
    return 'ANNUAL';
  }

  return 'MONTHLY';

}

function billingPeriodFromContrib(contrib: Contrib): BillingPeriod {
  switch (contrib) {
    case 'ANNUAL': return 'Annual';
    default: return 'Monthly';
  }
}

function errorMessage(
  error: ContributionError,
  contributionType: Contrib,
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

function getOneOffName(
  countryGroupId: CountryGroupId,
  oneOffSingleOneTimeTestVariant: 'control' | 'single' | 'once' | 'oneTime' | 'notintest',
  usOneOffSingleOneTimeTestVariant: 'control' | 'single' | 'once' | 'oneOff' | 'notintest',
) {
  let response = null;

  const variant = oneOffSingleOneTimeTestVariant === 'notintest' ? usOneOffSingleOneTimeTestVariant : oneOffSingleOneTimeTestVariant;

  switch (variant) {
    case 'single':
      response = 'Single';
      break;
    case 'once':
      response = 'Just once';
      break;
    case 'oneTime':
      response = 'One-time';
      break;
    case 'oneOff':
      response = 'One-off';
      break;
    case 'control':
    default:
      response = countryGroupId === 'UnitedStates' ? 'One-time' : 'One-off';
      break;
  }

  return response;
}

function getOneOffSpokenName(countryGroupId: CountryGroupId) {
  return countryGroupId === 'UnitedStates' ? 'one time' : 'one off';
}

function getContributionTypeClassName(contributionType: Contrib): string {

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
): string {

  if (contributionType === 'ONE_OFF') {
    return getOneOffSpokenName(countryGroupId);
  } else if (contributionType === 'MONTHLY') {
    return 'monthly';
  }

  return 'annual';

}

function getFrequency(contributionType: Contrib): string {

  if (contributionType === 'ONE_OFF') {
    return '';
  } else if (contributionType === 'MONTHLY') {
    return 'per month';
  }

  return 'a year';

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
  currencyId: IsoCurrency,
  spokenAmount: string,
): string {

  const spokenCurrency = spokenCurrencies[currencyId].plural;

  if (contributionType === 'ONE_OFF') {
    return `make a one-off contribution of ${spokenAmount} ${spokenCurrency}`;
  } else if (contributionType === 'MONTHLY') {
    return `contribute ${spokenAmount} ${spokenCurrency} per month`;
  }

  return `contribute ${spokenAmount} ${spokenCurrency} annually`;

}

function getContributionTypeRadios(
  countryGroupId: CountryGroupId,
  oneOffSingleOneTimeTestVariant: 'control' | 'single' | 'once' | 'oneTime' | 'notintest',
  usOneOffSingleOneTimeTestVariant: 'control' | 'single' | 'once' | 'oneOff' | 'notintest',
  annualTestVariant: 'control' | 'annual' | 'notintest',
) {

  const oneOff = {
    value: 'ONE_OFF',
    text: getOneOffName(countryGroupId, oneOffSingleOneTimeTestVariant, usOneOffSingleOneTimeTestVariant),
    accessibilityHint: `Make a ${getOneOffSpokenName(countryGroupId)} contribution`,
    id: 'qa-one-off-toggle',
  };
  const monthly = {
    value: 'MONTHLY',
    text: 'Monthly',
    accessibilityHint: 'Make a regular monthly contribution',
  };
  const annual = {
    value: 'ANNUAL',
    text: 'Annually',
    accessibilityHint: 'Make a regular annual contribution',
  };

  return annualTestVariant === 'annual' ? [oneOff, monthly, annual] : [monthly, oneOff];

}

function getContributionAmountRadios(
  contributionType: Contrib,
  currencyId: IsoCurrency,
  countryGroupId: CountryGroupId,
): Radio[] {

  return amounts[contributionType][countryGroupId].map(amount => ({
    value: amount.value,
    text: `${currencies[currencyId].glyph}${amount.value}`,
    accessibilityHint: getAmountA11yHint(contributionType, currencyId, amount.spoken),
  }));

}


// ----- Exports ----- //

export {
  config,
  parseContrib,
  validateContribution,
  parseContribution,
  getMinContribution,
  billingPeriodFromContrib,
  errorMessage,
  getOneOffName,
  getOneOffSpokenName,
  getContributionTypeClassName,
  getSpokenType,
  getFrequency,
  getCustomAmountA11yHint,
  getContributionTypeRadios,
  getContributionAmountRadios,
  parseRegularContributionType,
};
