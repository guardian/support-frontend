// @flow

// ----- Imports ----- //

import { config as contributionConfig } from 'helpers/contributions';
import { spokenCurrencies } from 'helpers/internationalisation/currency';

import type { Contrib as ContributionType } from 'helpers/contributions';
import type { Radio } from 'components/radioToggle/radioToggle';
import type { Currency } from 'helpers/internationalisation/currency';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';


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
      { value: '50', spoken: 'fifty' },
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
      { value: '2', spoken: 'two' },
      { value: '5', spoken: 'five' },
      { value: '10', spoken: 'ten' },
    ],
    UnitedStates: [
      { value: '7', spoken: 'seven' },
      { value: '15', spoken: 'fifteen' },
      { value: '30', spoken: 'thirty' },
    ],
    AUDCountries: [
      { value: '7', spoken: 'seven' },
      { value: '15', spoken: 'fifteen' },
      { value: '30', spoken: 'thirty' },
    ],
    EURCountries: [
      { value: '7', spoken: 'seven' },
      { value: '15', spoken: 'fifteen' },
      { value: '30', spoken: 'thirty' },
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
      { value: '100', spoken: 'one hundred' },
      { value: '250', spoken: 'two hundred and fifty' },
    ],
    EURCountries: [
      { value: '50', spoken: 'fifty' },
      { value: '100', spoken: 'one hundred' },
      { value: '250', spoken: 'two hundred and fifty' },
    ],
    International: [],
  },
};


// ----- Functions ----- //

function getOneOffName(country: IsoCountry) {
  return country === 'US' ? 'One-time' : 'One-off';
}

function getOneOffSpokenName(country: IsoCountry) {
  return country === 'US' ? 'one time' : 'one off';
}

function getSpokenType(
  contributionType: ContributionType,
  country: IsoCountry,
) {

  if (contributionType === 'ONE_OFF') {
    return getOneOffSpokenName(country);
  } else if (contributionType === 'MONTHLY') {
    return 'monthly';
  }

  return 'annual';

}

function getContributionTypeClassName(contributionType: ContributionType) {

  if (contributionType === 'ONE_OFF') {
    return 'one-off';
  } else if (contributionType === 'MONTHLY') {
    return 'monthly';
  }

  return 'annual';

}

function getAmountA11yHint(
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

function getContributionTypeRadios(country: IsoCountry) {

  return [
    {
      value: 'MONTHLY',
      text: 'Monthly',
      accessibilityHint: 'Make a regular monthly contribution',
    },
    {
      value: 'ONE_OFF',
      text: getOneOffName(country),
      accessibilityHint: `Make a ${getOneOffSpokenName(country)} contribution`,
    },
  ];

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

  return `Enter an amount of ${contributionConfig[contributionType].minInWords}
    ${spokenCurrency} or more for your 
    ${getSpokenType(contributionType, country)} contribution.`;

}

function getContributionAmountRadios(
  contributionType: ContributionType,
  currency: Currency,
  countryGroupId: CountryGroupId,
): Radio[] {

  return amounts[contributionType][countryGroupId].map(amount => ({
    value: amount.value,
    text: `${currency.glyph}${amount.value}`,
    accessibilityHint: getAmountA11yHint(contributionType, currency, amount.spoken),
  }));

}


// ----- Exports ----- //

export {
  getContributionTypeRadios,
  getContributionTypeClassName,
  getCustomAmountA11yHint,
  getContributionAmountRadios,
};
