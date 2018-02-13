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
    countries: ['AE', 'AF', 'AG', 'AI', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AW', 'AZ', 'BB', 'BD', 'BF', 'BH', 'BI', 'BJ', 'BM',
      'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ', 'CC', 'CD', 'CF', 'CG', 'CI', 'CL', 'CM', 'CN', 'CO', 'CR',
      'CU', 'CV', 'CW', 'CX', 'DJ', 'DM', 'DO', 'DZ', 'EC', 'EG', 'EH', 'ER', 'ET', 'FJ', 'FM', 'GA', 'GD', 'GE', 'GH', 'GM',
      'GN', 'GQ', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HM', 'HN', 'HT', 'ID', 'IL', 'IN', 'IO', 'IQ', 'IR', 'JM', 'JO', 'JP',
      'KE', 'KG', 'KH', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LK', 'LR', 'LS', 'LY', 'MA', 'MD', 'MG',
      'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MR', 'MS', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NG', 'NI',
      'NP', 'NU', 'OM', 'PA', 'PE', 'PG', 'PH', 'PK', 'PN', 'PR', 'PS', 'PW', 'PY', 'QA', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD',
      'SG', 'SL', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ', 'TC', 'TD', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN',
      'TO', 'TT', 'TW', 'TZ', 'UA', 'UG', 'UM', 'UY', 'UZ', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WS', 'YE', 'ZA', 'ZM', 'ZW'],
  },
};
