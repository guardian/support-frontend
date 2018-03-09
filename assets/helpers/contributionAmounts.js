// @flow

// ----- Imports ----- //

import { config as contributionConfig } from 'helpers/contributions';
import { spokenCurrencies } from 'helpers/internationalisation/currency';

import type { Contrib as ContributionType } from 'helpers/contributions';
import type { Radio } from 'components/radioToggle/radioToggle';
import type { Currency } from 'helpers/internationalisation/currency';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

import { getSpokenType } from './contributionTypes';
import { countryGroups } from './internationalisation/countryGroup'


// ----- Setup ----- //

const amounts = {
  ONE_OFF: {
    GBPCountries: [
      { value: '25', spoken: 'twenty five' },
      { value: '50', spoken: 'fifty' },
      { value: '100', spoken: 'one hundred' },
      { value: '250', spoken: 'two hundred and fifty' },
    ],
    UnitedStates: [
      { value: '25', spoken: 'twenty five' },
      { value: '50', spoken: 'fifty' },
      { value: '100', spoken: 'one hundred' },
      { value: '250', spoken: 'two hundred and fifty' },
    ],
    AUDCountries: [
      { value: '25', spoken: 'twenty five' },
      { value: '100', spoken: 'one hundred' },
      { value: '250', spoken: 'two hundred and fifty' },
      { value: '500', spoken: 'five hundred' },
    ],
    EURCountries: [
      { value: '25', spoken: 'twenty five' },
      { value: '50', spoken: 'fifty' },
      { value: '100', spoken: 'one hundred' },
      { value: '250', spoken: 'two hundred and fifty' },
    ],
    International: [],
  },
  MONTHLY: {
    GBPCountries: [
      { value: '5', spoken: 'five' },
      { value: '10', spoken: 'ten' },
      { value: '20', spoken: 'twenty' },
    ],
    UnitedStates: [
      { value: '5', spoken: 'five' },
      { value: '10', spoken: 'ten' },
      { value: '20', spoken: 'twenty' },
    ],
    AUDCountries: [
      { value: '5', spoken: 'five' },
      { value: '10', spoken: 'ten' },
      { value: '20', spoken: 'twenty' },
    ],
    EURCountries: [
      { value: '6', spoken: 'six' },
      { value: '10', spoken: 'ten' },
      { value: '20', spoken: 'twenty' },
    ],
    International: [],
  },
  ANNUAL: {
    GBPCountries: [
      { value: '50', spoken: 'fifty' },
      { value: '75', spoken: 'seventy five' },
      { value: '100', spoken: 'one hundred' },
    ],
    UnitedStates: [
      { value: '50', spoken: 'fifty' },
      { value: '75', spoken: 'seventy five' },
      { value: '100', spoken: 'one hundred' },
    ],
    AUDCountries: [
      { value: '50', spoken: 'fifty' },
      { value: '75', spoken: 'seventy five' },
      { value: '100', spoken: 'one hundred' },
    ],
    EURCountries: [
      { value: '50', spoken: 'fifty' },
      { value: '75', spoken: 'seventy five' },
      { value: '100', spoken: 'one hundred' },
    ],
    International: [],
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
  countryGroupId: CountryGroupId,
): string {
  const currency = countryGroups[countryGroupId];

  let spokenCurrency = spokenCurrencies[currency.iso].plural;

  if (contributionType === 'ONE_OFF') {
    spokenCurrency = spokenCurrencies[currency.iso].singular;
  }

  return `Enter an amount of ${contributionConfig[countryGroupId][contributionType].minInWords}
    ${spokenCurrency} or more for your 
    ${getSpokenType(contributionType, country)} contribution.`;

}

function getContributionAmounts(
  contributionType: ContributionType,
  currency: Currency,
  countryGroupId: CountryGroupId,
): Radio[] {

  return amounts[contributionType][countryGroupId].map(amount => ({
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
