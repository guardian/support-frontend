import type { IsoCountry } from './country';
import type { IsoCurrency } from './currency';
import type {ContributionAmounts, SelectedAmounts} from '../contributions';

export type LocalCurrencyCountry = {
  countryCode: IsoCountry,
  countryName: string,
  currency: IsoCurrency,
  amounts: ContributionAmounts,
};

export const localCurrencyCountries: {
  [string]: LocalCurrencyCountry
} = {
  SE: {
    countryCode: 'SE',
    countryName: 'Sweden',
    currency: 'SEK',
    amounts: {
      ONE_OFF: {
        amounts: [50, 100, 150, 200],
        defaultAmount: 50
      },
    },
  },
  CH: {
    countryCode: 'CH',
    countryName: 'Switzerland',
    currency: 'CHF',
    amounts: {
      ONE_OFF: {
        amounts: [5, 10, 15, 20],
        defaultAmount: 5
      },
    },
  },
  NO: {
    countryCode: 'NO',
    countryName: 'Norway',
    currency: 'NOK',
    amounts: {
      ONE_OFF: {
        amounts: [50, 100, 150, 200],
        defaultAmount: 50
      },
    },
  },
  DK: {
    countryCode: 'DK',
    countryName: 'Denmark',
    currency: 'DKK',
    amounts: {
      ONE_OFF: {
        amounts: [50, 100, 150, 200],
        defaultAmount: 50
      },
    },
  },
};
