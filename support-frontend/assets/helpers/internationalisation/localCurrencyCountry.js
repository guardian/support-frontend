// @flow

import type { IsoCountry } from './country';
import type { IsoCurrency } from './currency';
import type {Config, ContributionAmounts} from '../contributions';

export type LocalCurrencyCountry = {
  countryCode: IsoCountry,
  countryName: string,
  currency: IsoCurrency,
  amounts: ContributionAmounts,
  config: Config,
};

export const localCurrencyCountries: {
  [?IsoCountry]: LocalCurrencyCountry
} = {
  SE: {
    countryCode: 'SE',
    countryName: 'Sweden',
    currency: 'SEK',
    amounts: {
      ONE_OFF: {
        amounts: [50, 100, 150, 200],
        defaultAmount: 50,
      },
    },
    config: {
      ONE_OFF: {
        min: 10,
        minInWords: 'ten',
        max: 23_000,
        maxInWords: 'twenty three thousand',
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
        defaultAmount: 5,
      },
    },
    config: {
      ONE_OFF: {
        min: 2,
        minInWords: 'two',
        max: 2_200,
        maxInWords: 'two thousand and two hundred',
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
        defaultAmount: 50,
      },
    },
    config: {
      ONE_OFF: {
        min: 10,
        minInWords: 'ten',
        max: 23_000,
        maxInWords: 'twenty three thousand',
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
        defaultAmount: 50,
      },
    },
    config: {
      ONE_OFF: {
        min: 10,
        minInWords: 'ten',
        max: 23_000,
        maxInWords: 'twenty three thousand',
      },
    },
  },
};
