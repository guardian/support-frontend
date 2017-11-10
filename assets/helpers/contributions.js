// @flow

// ----- Imports ----- //

import { roundDp } from 'helpers/utilities';

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

type Config = {
  [Contrib]: {
    min: number,
    max: number,
    default: number,
  }
}


// ----- Setup ----- //

const config: Config = {
  ANNUAL: {
    min: 50,
    max: 2000,
    default: 75,
  },
  MONTHLY: {
    min: 5,
    max: 166,
    default: 10,
  },
  ONE_OFF: {
    min: 1,
    max: 2000,
    default: 50,
  },
};


// ----- Functions ----- //

export function parse(input: ?string, contrib: Contrib): ParsedContrib {

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

export function parseContrib(s: ?string, contrib: Contrib): Contrib {
  switch ((s || contrib).toUpperCase()) {
    case 'ANNUAL': return 'ANNUAL';
    case 'MONTHLY': return 'MONTHLY';
    case 'ONE_OFF': return 'ONE_OFF';
    default: return contrib;
  }
}

export function billingPeriodFromContrib(contrib: Contrib): BillingPeriod {
  switch (contrib) {
    case 'ANNUAL': return 'Annual';
    default: return 'Monthly';
  }
}

export function errorMessage(
  error: ContribError,
  currency: Currency,
  contributionType: Contrib,
): string {

  const minContrib = config[contributionType].min;
  const maxContrib = config[contributionType].max;

  switch (error) {
    case 'tooLittle':
      return `Please enter at least ${currency.glyph}${minContrib}`;
    case 'tooMuch':
      return `We are presently only able to accept contributions of
        ${currency.glyph}${maxContrib} or less`;
    case 'invalidEntry':
    default:
      return 'Please enter a numeric amount';
  }

}
