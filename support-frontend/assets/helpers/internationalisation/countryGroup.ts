// ----- Imports ----- //
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import * as cookie from 'helpers/storage/cookie';
import { getQueryParameter } from 'helpers/urls/url';

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
	supportInternationalisationId: string;
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
			'AM',
			'AO',
			'AQ',
			'AR',
			'AS',
			'AW',
			'AZ',
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
			'BY',
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
			'GE',
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
			'MD',
			'MG',
			'MH',
			'MK',
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
			'UA',
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

// ----- Functions ----- //
function fromPath(
	path: string = window.location.pathname,
): CountryGroupId | null | undefined {
	if (path === '/uk' || path.startsWith('/uk/')) {
		return GBPCountries;
	} else if (path === '/us' || path.startsWith('/us/')) {
		return UnitedStates;
	} else if (path === '/au' || path.startsWith('/au/')) {
		return AUDCountries;
	} else if (path === '/eu' || path.startsWith('/eu/')) {
		return EURCountries;
	} else if (path === '/int' || path.startsWith('/int/')) {
		return International;
	} else if (path === '/nz' || path.startsWith('/nz/')) {
		return NZDCountries;
	} else if (path === '/ca' || path.startsWith('/ca/')) {
		return Canada;
	}

	return null;
}

function fromString(countryGroup: string): CountryGroupId | null | undefined {
	switch (countryGroup) {
		case 'GBPCountries':
			return GBPCountries;

		case 'UnitedStates':
			return UnitedStates;

		case 'AUDCountries':
			return AUDCountries;

		case 'EURCountries':
			return EURCountries;

		case 'International':
			return International;

		case 'NZDCountries':
			return NZDCountries;

		case 'Canada':
			return Canada;

		default:
			return null;
	}
}

function fromCountry(isoCountry: string): CountryGroupId | null | undefined {
	if (isoCountry === 'UK') {
		return GBPCountries;
	}

	const countryGroup = (Object.keys(countryGroups) as CountryGroupId[]).find(
		(countryGroupId) =>
			countryGroups[countryGroupId].countries.includes(isoCountry),
	);
	return countryGroup ?? null;
}

function fromQueryParameter(): CountryGroupId | null | undefined {
	const countryGroup: string | null | undefined =
		getQueryParameter('countryGroup');

	if (countryGroup) {
		return fromString(countryGroup);
	}

	return null;
}

function fromCookie(): CountryGroupId | null | undefined {
	const country = cookie.get('GU_country');

	if (country) {
		return fromCountry(country);
	}

	return null;
}

function fromGeolocation(): CountryGroupId | null | undefined {
	const country = cookie.get('GU_geo_country');

	if (country) {
		return fromCountry(country);
	}

	return null;
}

function detect(): CountryGroupId {
	return (
		fromPath() ??
		fromQueryParameter() ??
		fromCookie() ??
		fromGeolocation() ??
		GBPCountries
	);
}

function stringToCountryGroupId(countryGroupId: string): CountryGroupId {
	return fromString(countryGroupId) ?? GBPCountries;
}

function fromCountryGroupName(name: CountryGroupName): CountryGroup {
	const groupId = (Object.keys(countryGroups) as CountryGroupId[]).find(
		(key) => countryGroups[key].name === name,
	);
	return groupId ? countryGroups[groupId] : countryGroups.GBPCountries;
}

// ----- Exports ----- //
export {
	countryGroups,
	detect,
	stringToCountryGroupId,
	fromCountry,
	fromCountryGroupName,
	GBPCountries,
	UnitedStates,
	AUDCountries,
	EURCountries,
	NZDCountries,
	Canada,
	International,
};
