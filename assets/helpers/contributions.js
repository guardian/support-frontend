// @flow

// ----- Imports ----- //

import { roundDp } from 'helpers/utilities';

import type { Currency } from 'helpers/internationalisation/currency';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from './internationalisation/countryGroup';

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

const numbersInWords: {[number] : string} = {
  1: 'one',
  2: 'two',
  50: 'fifty',
  166: 'one hundred and sixty six',
  2000: 'two thousand',
};

const config: { [CountryGroupId]: Config } = {
  ANNUAL: {
    min: 50,
    minInWords: numbersInWords[50],
    max: 2000,
    maxInWords: numbersInWords[2000],
    default: 75,
  },
  MONTHLY: {
    min: 2,
    minInWords: numbersInWords[2],
    max: 166,
    maxInWords: numbersInWords[166],
    default: 10,
  },
  ONE_OFF: {
    min: 1,
    minInWords: numbersInWords[1],
    max: 2000,
    maxInWords: numbersInWords[2000],
    default: 50,
  },
};


// ----- Functions ----- //

function parse(input: ?string, contrib: Contrib): ParsedContrib {

  let error = null;
  const numericAmount = Number(input);

  if (input === undefined || input === null || input === '' || Number.isNaN(numericAmount)) {
    error = 'invalidEntry';
  } else if (numericAmount < config[contrib].min) {
    error = 'tooLittle';
  } else if (numericAmount > config[contrib].max) {
    error = 'tooMuch';
  }

  const amount = error ? config[contrib].default : roundDp(numericAmount);

  return { error, amount };

}

function circlesParse(input: string, contributionType: Contrib): ParsedAmount {

  const customAmount = Number(input);

  if (input === '' || Number.isNaN(customAmount)) {
    return { error: 'invalidEntry', customAmount: null };
  } else if (customAmount < config[contributionType].min) {
    return { error: 'tooLittle', customAmount };
  } else if (customAmount > config[contributionType].max) {
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
  currency: Currency,
  contributionType: Contrib,
): ?string {

  const minContrib = config[contributionType].min;
  const maxContrib = config[contributionType].max;

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

function getOneOffName(country: IsoCountry) {
  return country === 'US' ? 'One-time' : 'One-off';
}

function getOneOffSpokenName(country: IsoCountry) {
  return country === 'US' ? 'one time' : 'one off';
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
  country: IsoCountry,
) {

  if (contributionType === 'ONE_OFF') {
    return getOneOffSpokenName(country);
  } else if (contributionType === 'MONTHLY') {
    return 'monthly';
  }

  return 'annual';

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
};
