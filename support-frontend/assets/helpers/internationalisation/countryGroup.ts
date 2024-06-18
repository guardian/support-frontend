// ----- Imports ----- //
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

// ----- Types ----- //
const GBPCountries = 'GBPCountries';
const UnitedStates = 'UnitedStates';
const AUDCountries = 'AUDCountries';
const EURCountries = 'EURCountries';
const NZDCountries = 'NZDCountries';
const Canada = 'Canada';
const International = 'International';

export type CountryGroupId =
	| typeof GBPCountries
	| typeof UnitedStates
	| typeof AUDCountries
	| typeof EURCountries
	| typeof International
	| typeof NZDCountries
	| typeof Canada;

export type CountryGroupName =
	| 'United Kingdom'
	| 'United States'
	| 'Australia'
	| 'Europe'
	| 'International'
	| 'New Zealand'
	| 'Canada';

export type SupportInternationalisationId =
	| 'uk'
	| 'us'
	| 'au'
	| 'eu'
	| 'int'
	| 'nz'
	| 'ca';

/*
  Note: supportInternationalizationId should match an existing
  id from support-internationalisation library. We use it to
  communicate with the backend. Additionally, the list of countries
  should match the list in support-internationalisation.
 */
export type CountryGroup = {
	name: CountryGroupName;
	currency: IsoCurrency;
	countries: IsoCountry[];
	supportInternationalisationId: SupportInternationalisationId;
};
type CountryGroups = Record<CountryGroupId, CountryGroup>;
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
		countries: [
			'AD',
			'AL',
			'AT',
			'BA',
			'BE',
			'BG',
			'BL',
			'CH',
			'CY',
			'CZ',
			'DE',
			'DK',
			'EE',
			'ES',
			'FI',
			'FO',
			'FR',
			'GF',
			'GL',
			'GP',
			'GR',
			'HR',
			'HU',
			'IE',
			'IT',
			'LI',
			'LT',
			'LU',
			'LV',
			'MC',
			'ME',
			'MF',
			'IS',
			'MQ',
			'MT',
			'NL',
			'NO',
			'PF',
			'PL',
			'PM',
			'PT',
			'RE',
			'RO',
			'RS',
			'SE',
			'SI',
			'SJ',
			'SK',
			'SM',
			'TF',
			'WF',
			'YT',
			'VA',
			'AX',
			'AZ',
			'AM',
			'GE',
			'BY',
			'MD',
			'UA',
			'MK',
		],
		supportInternationalisationId: 'eu',
	},
	International: {
		name: 'International',
		currency: 'USD',
		countries: [
			'AE',
			'AF',
			'AG',
			'AI',
			'AO',
			'AQ',
			'AR',
			'AS',
			'AW',
			'BB',
			'BD',
			'BF',
			'BH',
			'BI',
			'BJ',
			'BM',
			'BN',
			'BO',
			'BQ',
			'BR',
			'BS',
			'BT',
			'BV',
			'BW',
			'BZ',
			'CC',
			'CD',
			'CF',
			'CG',
			'CI',
			'CL',
			'CM',
			'CN',
			'CO',
			'CR',
			'CU',
			'CV',
			'CW',
			'CX',
			'DJ',
			'DM',
			'DO',
			'DZ',
			'EC',
			'EG',
			'EH',
			'ER',
			'ET',
			'FJ',
			'FM',
			'GA',
			'GD',
			'GH',
			'GM',
			'GN',
			'GQ',
			'GS',
			'GT',
			'GU',
			'GW',
			'GY',
			'HK',
			'HM',
			'HN',
			'HT',
			'ID',
			'IL',
			'IN',
			'IO',
			'IQ',
			'IR',
			'JM',
			'JO',
			'JP',
			'KE',
			'KG',
			'KH',
			'KM',
			'KN',
			'KP',
			'KR',
			'KW',
			'KY',
			'KZ',
			'LA',
			'LB',
			'LC',
			'LK',
			'LR',
			'LS',
			'LY',
			'MA',
			'MG',
			'MH',
			'ML',
			'MM',
			'MN',
			'MO',
			'MP',
			'MR',
			'MS',
			'MU',
			'MV',
			'MW',
			'MX',
			'MY',
			'MZ',
			'NA',
			'NC',
			'NE',
			'NG',
			'NI',
			'NP',
			'NU',
			'OM',
			'PA',
			'PE',
			'PG',
			'PH',
			'PK',
			'PN',
			'PR',
			'PS',
			'PW',
			'PY',
			'QA',
			'RU',
			'RW',
			'SA',
			'SB',
			'SC',
			'SD',
			'SG',
			'SL',
			'SN',
			'SO',
			'SR',
			'SS',
			'ST',
			'SV',
			'SX',
			'SY',
			'SZ',
			'TC',
			'TD',
			'TG',
			'TH',
			'TJ',
			'TK',
			'TL',
			'TM',
			'TN',
			'TO',
			'TR',
			'TT',
			'TW',
			'TZ',
			'UG',
			'UM',
			'UY',
			'UZ',
			'VC',
			'VE',
			'VG',
			'VI',
			'VN',
			'VU',
			'WS',
			'YE',
			'ZA',
			'ZM',
			'ZW',
		],
		supportInternationalisationId: 'int',
	},
	NZDCountries: {
		name: 'New Zealand',
		currency: 'NZD',
		countries: ['NZ', 'CK'],
		supportInternationalisationId: 'nz',
	},
	Canada: {
		name: 'Canada',
		currency: 'CAD',
		countries: ['CA'],
		supportInternationalisationId: 'ca',
	},
};

// ----- Exports ----- //
export {
	countryGroups,
	GBPCountries,
	UnitedStates,
	AUDCountries,
	EURCountries,
	NZDCountries,
	Canada,
	International,
};
