// @flow

// ----- Imports ----- //

import { config as contributionConfig } from 'helpers/contributions';

import type { Contrib as ContributionType } from 'helpers/contributions';
import type { Radio } from 'components/radioToggle/radioToggle';
import type { Currency } from 'helpers/internationalisation/currency';
import type { IsoCountry } from 'helpers/internationalisation/country';

import { getSpokenType } from './contributionTypes';


// ----- Setup ----- //

const spokenCurrencies = {
  GBP: {
    singular: 'pound',
    plural: 'pounds',
  },
  USD: {
    singular: 'dollar',
    plural: 'dollars',
  },
};

const amounts = {
  ONE_OFF: {
    GBP: [
      { value: '25', spoken: 'twenty five' },
      { value: '50', spoken: 'fifty' },
      { value: '100', spoken: 'one hundred' },
      { value: '250', spoken: 'two hundred and fifty' },
    ],
    USD: [
      { value: '25', spoken: 'twenty five' },
      { value: '50', spoken: 'fifty' },
      { value: '100', spoken: 'one hundred' },
      { value: '250', spoken: 'two hundred and fifty' },
    ],
  },
  MONTHLY: {
    GBP: [
      { value: '5', spoken: 'five' },
      { value: '10', spoken: 'ten' },
      { value: '20', spoken: 'twenty' },
    ],
    USD: [
      { value: '5', spoken: 'five' },
      { value: '10', spoken: 'ten' },
      { value: '20', spoken: 'twenty' },
    ],
  },
  ANNUAL: {
    GBP: [
      { value: '50', spoken: 'fifty' },
      { value: '75', spoken: 'seventy five' },
      { value: '100', spoken: 'one hundred' },
    ],
    USD: [
      { value: '50', spoken: 'fifty' },
      { value: '75', spoken: 'seventy five' },
      { value: '100', spoken: 'one hundred' },
    ],
  },
};


// ----- Functions ----- //

function getA11yHint(
  contributionType: ContributionType,
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
  contributionType: ContributionType,
  country: IsoCountry,
  currency: Currency,
): string {

  let spokenCurrency = spokenCurrencies[currency.iso].plural;

  if (contributionType === 'ONE_OFF') {
    spokenCurrency = spokenCurrencies[currency.iso].singular;
  }

  return `Enter an amount of ${contributionConfig[contributionType].spokenMin} 
    ${spokenCurrency} or more for your 
    ${getSpokenType(contributionType, country)} contribution.`;

}

function getContributionAmounts(
  contributionType: ContributionType,
  currency: Currency,
): Radio[] {

  return amounts[contributionType][currency.iso].map(amount => ({
    value: amount.value,
    text: `${currency.glyph}${amount.value}`,
    accessibilityHint: getA11yHint(contributionType, currency, amount.spoken),
  }));

}


// ----- Exports ----- //

export {
  getCustomAmountA11yHint,
  getContributionAmounts,
};
