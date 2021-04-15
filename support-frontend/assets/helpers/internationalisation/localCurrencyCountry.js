import type { IsoCountry } from './country';
import type { IsoCurrency } from './currency';
import type { SelectedAmounts } from '../contributions';

export type LocalCurrencyCountry = {
  countryCode: IsoCountry,
  countryName: string,
  currency: IsoCurrency,
  amounts: number[],
  defaultAmount: number,
  localSelectedAmounts: SelectedAmounts,
};

export const localCurrencyCountries: {
  [string]: LocalCurrencyCountry
} = {
  SE: {
    countryCode: 'SE',
    countryName: 'Sweden',
    currency: 'SEK',
    amounts: [50, 100, 150, 200],
    defaultAmount: 50,
    localSelectedAmounts: {
      ONE_OFF: 50,
    }
  },
  CH: {
    countryCode: 'CH',
    countryName: 'Switzerland',
    currency: 'CHF',
    amounts: [5, 10, 15, 20],
    defaultAmount: 10,
    localSelectedAmounts: {
      ONE_OFF: 10,
    }
  },
  NO: {
    countryCode: 'NO',
    countryName: 'Norway',
    currency: 'NOK',
    amounts: [50, 100, 150, 200],
    defaultAmount: 50,
    localSelectedAmounts: {
      ONE_OFF: 50,
    }
  },
  DK: {
    countryCode: 'DK',
    countryName: 'Denmark',
    currency: 'DKK',
    amounts: [50, 100, 150, 200],
    defaultAmount: 50,
    localSelectedAmounts: {
      ONE_OFF: 50,
    }
  },
};
