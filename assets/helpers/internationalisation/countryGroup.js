// @flow

// ----- Imports ----- //

import type { IsoCountry } from './country';
import type { IsoCurrency } from './currency';

import { countries } from './country';

type CountryGroupId = 'GBPCountries' | 'UnitedStates' | 'AUDCountries' | 'EURCountries' | 'International';

type CountryGroup = {
  name: string,
  currency: IsoCurrency,
  countries: IsoCountry[],
};

type CountryGroups = {
  [CountryGroupId]: CountryGroup
}

export const countryGroups: CountryGroups = {
  GBPCountries: {
    name: 'United Kingdom',
    currency: 'GBP',
    countries: ['GB'],
  },
  UnitedStates: {
    name: 'United States',
    currency: 'USD',
    countries: ['US'],
  },
  AUDCountries: {
    name: 'Australia',
    currency: 'AUD',
    countries: ['AU', 'KI', 'NR', 'NF', 'TV'],
  },
  EURCountries: {
    name: 'Europe',
    currency: 'EUR',
    countries: ['AD', 'AL', 'AT', 'BA', 'BE', 'BG', 'BL', 'CH', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FO', 'FR',
      'GF', 'GL', 'GP', 'GR', 'HR', 'HU', 'IE', 'IT', 'LI', 'LT', 'LU', 'LV', 'MC', 'ME', 'MF', 'IS', 'MQ', 'MT', 'NL',
      'NO', 'PF', 'PL', 'PM', 'PT', 'RE', 'RO', 'RS', 'SE', 'SI', 'SJ', 'SK', 'SM', 'TF', 'TR', 'WF', 'YT', 'VA', 'AX'],
  },
  International: {
    name: 'International',
    currency: 'USD',
    countries: [],
  },
};

export const getCountriesForCountriGroup =
  (countryGroupId: CountryGroupId): { [IsoCountry]: string } => {
    const response = {};
    countryGroups[countryGroupId].countries.forEach((isoCountry) => {
      response[isoCountry] = countries[isoCountry];
    });
    return response;
  };
