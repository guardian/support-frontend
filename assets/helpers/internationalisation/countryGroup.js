// @flow

// ----- Imports ----- //

import * as cookie from 'helpers/cookie';
import { getQueryParameter } from 'helpers/url';

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

export type CountryGroupId = 'GBPCountries' | 'UnitedStates' | 'AUDCountries' | 'EURCountries' | 'International';

/*
  Note: supportInternationalizationId should match an existing
  id from support-internationalisation library. We use it to
  communicate with the backend.
 */
export type CountryGroup = {
  name: string,
  currency: IsoCurrency,
  countries: IsoCountry[],
  supportInternationalisationId: string,
};

type CountryGroups = {
  [CountryGroupId]: CountryGroup
}

const countryGroups: CountryGroups = {
  GBPCountries: {
    name: 'United Kingdom',
    currency: 'GBP',
    countries: ['GB', 'FK', 'GI', 'GG', 'IM', 'JE', 'SH'],
    supportInternationalisationId: 'uk',
  },
  UnitedStates: {
    name: 'United States',
    currency: 'USD',
    countries: ['US'],
    supportInternationalisationId: 'us',
  },
  AUDCountries: {
    name: 'Australia',
    currency: 'AUD',
    countries: ['AU', 'KI', 'NR', 'NF', 'TV'],
    supportInternationalisationId: 'au',
  },
  EURCountries: {
    name: 'Europe',
    currency: 'EUR',
    countries: ['AD', 'AL', 'AT', 'BA', 'BE', 'BG', 'BL', 'CH', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FO', 'FR',
      'GF', 'GL', 'GP', 'GR', 'HR', 'HU', 'IE', 'IT', 'LI', 'LT', 'LU', 'LV', 'MC', 'ME', 'MF', 'IS', 'MQ', 'MT', 'NL',
      'NO', 'PF', 'PL', 'PM', 'PT', 'RE', 'RO', 'RS', 'SE', 'SI', 'SJ', 'SK', 'SM', 'TF', 'TR', 'WF', 'YT', 'VA', 'AX'],
    supportInternationalisationId: 'eu',
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
    supportInternationalisationId: 'int',
  },
};

function fromPath(path: string = window.location.pathname): ?CountryGroupId {
  if (path === '/uk' || path.startsWith('/uk/')) {
    return 'GBPCountries';
  } else if (path === '/us' || path.startsWith('/us/')) {
    return 'UnitedStates';
  } else if (path === '/au' || path.startsWith('/au/')) {
    return 'AUDCountries';
  } else if (path === '/eu' || path.startsWith('/eu/')) {
    return 'EURCountries';
  } else if (path === '/int' || path.startsWith('/int/')) {
    return 'International';
  }
  return null;
}

function fromString(countryGroup: string): ?CountryGroupId {
  switch (countryGroup) {
    case 'GBPCountries': return 'GBPCountries';
    case 'UnitedStates': return 'UnitedStates';
    case 'AUDCountries': return 'AUDCountries';
    case 'EURCountries': return 'EURCountries';
    case 'International': return 'International';
    default: return null;
  }
}

function fromCountry(isoCountry: string): ?CountryGroupId {

  Object.keys(countryGroups).forEach((countryGroupId) => {
    if (countryGroups[countryGroupId].countries.includes(isoCountry)) {
      return countryGroupId;
    }
    return null;
  });
}

function fromQueryParameter(): ?CountryGroupId {
  const countryGroup: ?string = getQueryParameter('countryGroup');
  if (countryGroup) {
    return fromString(countryGroup);
  }
  return null;
}

function fromCookie(): ?CountryGroupId {
  const country = cookie.get('GU_country');
  if (country) {
    return fromCountry(country);
  }
  return null;
}

function fromGeolocation(): ?CountryGroupId {
  const country = cookie.get('GU_geo_country');
  if (country) {
    return fromCountry(country);
  }
  return null;
}

function detect(): CountryGroupId {
  return fromPath() || fromQueryParameter() || fromCookie() || fromGeolocation() || 'GBPCountries';
}

export {
  countryGroups,
  detect,
};
