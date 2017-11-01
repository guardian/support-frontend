// @flow

// ----- Imports ----- //

import type { Contrib as ContributionType } from 'helpers/contributions';
import type {
  Currency,
  IsoCurrency,
} from 'helpers/internationalisation/currency';


// ----- Setup ----- //

const spokenCurrencies = {
  GBP: 'pounds',
  USD: 'dollars',
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
  currency: IsoCurrency,
  spokenAmount: string,
): string {

  const spokenCurrency = spokenCurrencies[currency];

  if (contributionType === 'ONE_OFF') {
    return `make a one-off contribution of ${spokenAmount} ${spokenCurrency}`;
  } else if (contributionType === 'MONTHLY') {
    return `contribute ${spokenAmount} ${spokenCurrency} per month`;
  }

  return `contribute ${spokenAmount} ${spokenCurrency} annually`;

}

function getContributionAmounts(
  contributionType: ContributionType,
  currency: Currency,
) {

  return amounts[contributionType][currency.iso].map(amount => ({
    value: amount.value,
    text: `${currency.glyph}${amount.value}`,
    a11yHint: getA11yHint(contributionType, currency.iso, amount.spoken),
  }));

}


// ----- Exports ----- //

export {
  getContributionAmounts,
};
