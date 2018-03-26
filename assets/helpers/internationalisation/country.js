// @flow

// ----- Imports ----- //

import { getQueryParameter } from 'helpers/url';
import * as cookie from 'helpers/cookie';
import { countryGroups } from './countryGroup';
import type { CountryGroupId } from './countryGroup';


// ----- Setup ----- //

const usStates: {
  [string]: string,
} = {
  AK: 'Alaska',
  AL: 'Alabama',
  AR: 'Arkansas',
  AZ: 'Arizona',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DC: 'Washington DC (District of Columbia)',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  GU: 'Guam',
  HI: 'Hawaii',
  IA: 'Iowa',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  MA: 'Massachusetts',
  MD: 'Maryland',
  ME: 'Maine',
  MI: 'Michigan',
  MN: 'Minnesota',
  MO: 'Missouri',
  MS: 'Mississippi',
  MT: 'Montana',
  NC: 'North Carolina',
  ND: 'North Dakota',
  NE: 'Nebraska',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NV: 'Nevada',
  NY: 'New York',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  PR: 'Puerto Rico',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VA: 'Virginia',
  VI: 'Virgin Islands',
  VT: 'Vermont',
  WA: 'Washington',
  WI: 'Wisconsin',
  WV: 'West Virginia',
  WY: 'Wyoming',
  AA: 'Armed Forces America',
  AE: 'Armed Forces',
  AP: 'Armed Forces Pacific',
};

const countries = {
  GB: 'United Kingdom',
  US: 'United States',
  AU: 'Australia',
  NZ: 'New Zealand',
  CK: 'Cook Islands',
  AD: 'Andorra',
  AL: 'Albania',
  AT: 'Austria',
  BA: 'Bosnia-Herzegovina',
  BE: 'Belgium',
  BG: 'Bulgaria',
  BL: 'Saint Barthélemy',
  CH: 'Switzerland',
  CY: 'Cyprus',
  CZ: 'Czech Republic',
  DE: 'Germany',
  DK: 'Denmark',
  EE: 'Estonia',
  ES: 'Spain',
  FI: 'Finland',
  FO: 'Faroe Islands',
  FR: 'France',
  GF: 'French Guiana',
  GL: 'Greenland',
  GP: 'Guadeloupe',
  GR: 'Greece',
  HR: 'Croatia',
  HU: 'Hungary',
  IE: 'Ireland',
  IT: 'Italy',
  LI: 'Liechtenstein',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  LV: 'Latvia',
  MC: 'Monaco',
  ME: 'Montenegro',
  MF: 'Saint Martin',
  IS: 'Iceland',
  MQ: 'Martinique',
  MT: 'Malta',
  NL: 'Netherlands',
  NO: 'Norway',
  PF: 'French Polynesia',
  PL: 'Poland',
  PM: 'Saint Pierre & Miquelon',
  PT: 'Portugal',
  RE: 'Réunion',
  RO: 'Romania',
  RS: 'Serbia',
  SE: 'Sweden',
  SI: 'Slovenia',
  SJ: 'Svalbard and Jan Mayen',
  SK: 'Slovakia',
  SM: 'San Marino',
  TF: 'French Southern Territories',
  TR: 'Turkey',
  WF: 'Wallis & Futuna',
  YT: 'Mayotte',
  VA: 'Holy See',
  AX: 'Åland Islands',
  KI: 'Kiribati',
  NR: 'Nauru',
  NF: 'Norfolk Island',
  TV: 'Tuvalu',
  AE: 'United Arab Emirates',
  AF: 'Afghanistan',
  AG: 'Antigua & Barbuda',
  AI: 'Anguilla',
  AM: 'Armenia',
  AO: 'Angola',
  AQ: 'Antarctica',
  AR: 'Argentina',
  AS: 'American Samoa',
  AW: 'Aruba',
  AZ: 'Azerbaijan',
  BB: 'Barbados',
  BD: 'Bangladesh',
  BF: 'Burkina Faso',
  BH: 'Bahrain',
  BI: 'Burundi',
  BJ: 'Benin',
  BM: 'Bermuda',
  BN: 'Brunei Darussalam',
  BO: 'Bolivia',
  BQ: 'Bonaire, Saint Eustatius and Saba',
  BR: 'Brazil',
  BS: 'Bahamas',
  BT: 'Bhutan',
  BV: 'Bouvet Island',
  BW: 'Botswana',
  BY: 'Belarus',
  BZ: 'Belize',
  CC: 'Cocos (Keeling) Islands',
  CD: 'Congo (Kinshasa)',
  CF: 'Central African Republic',
  CG: 'Congo (Brazzaville)',
  CI: 'Ivory Coast',
  CL: 'Chile',
  CM: 'Cameroon',
  CN: 'China',
  CO: 'Colombia',
  CR: 'Costa Rica',
  CU: 'Cuba',
  CV: 'Cape Verde Islands',
  CW: 'Curaçao',
  CX: 'Christmas Island',
  DJ: 'Djibouti',
  DM: 'Dominica',
  DO: 'Dominican Republic',
  DZ: 'Algeria',
  EC: 'Ecuador',
  EG: 'Egypt',
  EH: 'Western Sahara',
  ER: 'Eritrea',
  ET: 'Ethiopia',
  FJ: 'Fiji',
  FM: 'Micronesia',
  GA: 'Gabon',
  GD: 'Grenada',
  GE: 'Georgia',
  GH: 'Ghana',
  GM: 'Gambia',
  GN: 'Guinea',
  GQ: 'Equatorial Guinea',
  GS: 'South Georgia & The South Sandwich Islands',
  GT: 'Guatemala',
  GU: 'Guam',
  GW: 'Guinea-Bissau',
  GY: 'Guyana',
  HK: 'Hong Kong',
  HM: 'Heard Island and McDonald Islands',
  HN: 'Honduras',
  HT: 'Haiti',
  ID: 'Indonesia',
  IL: 'Israel',
  IN: 'India',
  IO: 'British Indian Ocean Territory',
  IQ: 'Iraq',
  IR: 'Iran',
  JM: 'Jamaica',
  JO: 'Jordan',
  JP: 'Japan',
  KE: 'Kenya',
  KG: 'Kyrgyzstan',
  KH: 'Cambodia',
  KM: 'Comoros',
  KN: 'Saint Christopher & Nevis',
  KP: 'North Korea',
  KR: 'South Korea',
  KW: 'Kuwait',
  KY: 'Cayman Islands',
  KZ: 'Kazakhstan',
  LA: 'Laos',
  LB: 'Lebanon',
  LC: 'Saint Lucia',
  LK: 'Sri Lanka',
  LR: 'Liberia',
  LS: 'Lesotho',
  LY: 'Libya',
  MA: 'Morocco',
  MD: 'Moldova',
  MG: 'Madagascar',
  MH: 'Marshall Islands',
  MK: 'Macedonia',
  ML: 'Mali',
  MM: 'Myanmar',
  MN: 'Mongolia',
  MO: 'Macau',
  MP: 'Northern Mariana Islands',
  MR: 'Mauritania',
  MS: 'Montserrat',
  MU: 'Mauritius',
  MV: 'Maldives',
  MW: 'Malawi',
  MX: 'Mexico',
  MY: 'Malaysia',
  MZ: 'Mozambique',
  NA: 'Namibia',
  NC: 'New Caledonia',
  NE: 'Niger',
  NG: 'Nigeria',
  NI: 'Nicaragua',
  NP: 'Nepal',
  NU: 'Niue',
  OM: 'Oman',
  PA: 'Panama',
  PE: 'Peru',
  PG: 'Papua New Guinea',
  PH: 'Philippines',
  PK: 'Pakistan',
  PN: 'Pitcairn Islands',
  PR: 'Puerto Rico',
  PS: 'Palestinian Territories',
  PW: 'Palau',
  PY: 'Paraguay',
  QA: 'Qatar',
  RU: 'Russia',
  RW: 'Rwanda',
  SA: 'Saudi Arabia',
  SB: 'Solomon Islands',
  SC: 'Seychelles',
  SD: 'Sudan',
  SG: 'Singapore',
  SL: 'Sierra Leone',
  SN: 'Senegal',
  SO: 'Somalia',
  SR: 'Suriname',
  SS: 'South Sudan',
  ST: 'Sao Tome & Principe',
  SV: 'El Salvador',
  SX: 'Sint Maarten',
  SY: 'Syria',
  SZ: 'Swaziland',
  TC: 'Turks & Caicos Islands',
  TD: 'Chad',
  TG: 'Togo',
  TH: 'Thailand',
  TJ: 'Tajikistan',
  TK: 'Tokelau',
  TL: 'East Timor',
  TM: 'Turkmenistan',
  TN: 'Tunisia',
  TO: 'Tonga',
  TT: 'Trinidad & Tobago',
  TW: 'Taiwan',
  TZ: 'Tanzania',
  UA: 'Ukraine',
  UG: 'Uganda',
  UM: 'United States Minor Outlying Islands',
  UY: 'Uruguay',
  UZ: 'Uzbekistan',
  VC: 'Saint Vincent & The Grenadines',
  VE: 'Venezuela',
  VG: 'British Virgin Islands',
  VI: 'United States Virgin Islands',
  VN: 'Vietnam',
  VU: 'Vanuatu',
  WS: 'Samoa',
  YE: 'Yemen',
  ZA: 'South Africa',
  ZM: 'Zambia',
  ZW: 'Zimbabwe',
  FK: 'Falkland Islands',
  GI: 'Gibraltar',
  GG: 'Guernsey',
  IM: 'Isle of Man',
  JE: 'Jersey',
  SH: 'Saint Helena',
};


// ----- Types ----- //

export type UsState = $Keys<typeof usStates>;
export type IsoCountry = $Keys<typeof countries>;


// ----- Functions ----- /

function fromString(s: string): ?IsoCountry {
  const candidateIso = s.toUpperCase();
  const isoCountryArray: Array<IsoCountry> = Object.keys(countries);
  const isoIndex = isoCountryArray.indexOf(candidateIso);

  if (candidateIso === 'UK') {
    return 'GB';
  }
  if (isoIndex > -1) {
    return isoCountryArray[isoIndex];
  }
  return null;
}

function fromCountryGroup(countryGroupId: ?CountryGroupId = null): ?IsoCountry {
  switch (countryGroupId) {
    case 'GBPCountries':
      return 'GB';
    case 'AUDCountries':
      return 'AU';
    case 'UnitedStates':
      return 'US';
    default: return null;
  }
}

function fromPath(path: string = window.location.pathname): ?IsoCountry {
  if (path === '/uk' || path.startsWith('/uk/')) {
    return 'GB';
  } else if (path === '/us' || path.startsWith('/us/')) {
    return 'US';
  } else if (path === '/au' || path.startsWith('/au/')) {
    return 'AU';
  }
  return null;
}

function fromQueryParameter(): ?IsoCountry {
  const country = getQueryParameter('country');
  if (country) {
    return fromString(country);
  }
  return null;
}

function fromCookie(): ?IsoCountry {
  const country = cookie.get('GU_country');
  if (country) {
    return fromString(country);
  }
  return null;
}

function fromGeolocation(): ?IsoCountry {
  const country = cookie.get('GU_geo_country');
  if (country) {
    return fromString(country);
  }
  return null;
}

function setCountry(country: IsoCountry) {
  cookie.set('GU_country', country, 7);
}

function handleCountryForCountryGroup(
  targetCountryGroup: 'International' | 'EURCountries',
  countryGroupId: ?CountryGroupId = null,
): ?IsoCountry {

  const paths = {
    International: ['/int', '/int/'],
    EURCountries: ['/eu', '/eu/'],
    NZDCountries: ['/nz', '/nz/'],
  };

  const defaultCountry = {
    International: 'IN',
    EURCountries: 'DE',
    NZDCountries: 'NZ',
  };

  const path = window.location.pathname;

  if (
    path !== paths[targetCountryGroup][0] &&
    !path.startsWith(paths[targetCountryGroup][1]) &&
    countryGroupId !== targetCountryGroup
  ) {
    return null;
  }

  const candidateCountry: ?IsoCountry = fromQueryParameter() || fromCookie() || fromGeolocation();

  if (candidateCountry && countryGroups[targetCountryGroup].countries.includes(candidateCountry)) {
    return candidateCountry;
  }

  return defaultCountry[targetCountryGroup];
}

function detect(countryGroupId: ?CountryGroupId = null): IsoCountry {
  const country = handleCountryForCountryGroup('EURCountries', countryGroupId)  ||
                  handleCountryForCountryGroup('International', countryGroupId) ||
                  handleCountryForCountryGroup('NZDCountries', countryGroupId) ||
                  fromCountryGroup(countryGroupId) ||
                  fromPath() ||
                  fromQueryParameter() ||
                  fromCookie() ||
                  fromGeolocation() ||
                  'GB';

  setCountry(country);
  return country;
}


// ----- Exports ----- //

export {
  detect,
  setCountry,
  usStates,
  countries,
};
