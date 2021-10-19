import type { $Keys } from 'utility-types';
// ----- Imports ----- //
import * as cookie from 'helpers/storage/cookie';
import type { Option } from 'helpers/types/option';
import { getQueryParameter } from 'helpers/urls/url';
import 'helpers/types/option';
import {
	AUDCountries,
	Canada,
	countryGroups,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from './countryGroup';
import type { CountryGroupId } from './countryGroup';
// ----- Setup ----- //
const usStates: Record<string, string> = {
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
const caStates: Record<string, string> = {
	AB: 'Alberta',
	BC: 'British Columbia',
	MB: 'Manitoba',
	NB: 'New Brunswick',
	NL: 'Newfoundland and Labrador',
	NS: 'Nova Scotia',
	NT: 'Northwest Territories',
	NU: 'Nunavut',
	ON: 'Ontario',
	PE: 'Prince Edward Island',
	QC: 'Quebec',
	SK: 'Saskatchewan',
	YT: 'Yukon',
};
const auStates: Record<string, string> = {
	ACT: 'Australian Capital Territory',
	NSW: 'New South Wales',
	NT: 'Northern Territory',
	QLD: 'Queensland',
	SA: 'South Australia',
	TAS: 'Tasmania',
	VIC: 'Victoria',
	WA: 'Western Australia',
};
const newspaperCountries: Record<string, string> = {
	GB: 'United Kingdom',
	IM: 'Isle of Man',
};
const countries: Record<string, string> = {
	GB: 'United Kingdom',
	US: 'United States',
	AU: 'Australia',
	NZ: 'New Zealand',
	CK: 'Cook Islands',
	CA: 'Canada',
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
export type CaState = $Keys<typeof caStates>;
export type AuState = $Keys<typeof auStates>;
export type IsoCountry = $Keys<typeof countries>;
export type StateProvince = UsState | CaState | AuState;
// Annoyingly, this isn't Stripe's documentation, but if you try and submit
// a country that isn't on this list, you get an error
const stripePaymentRequestAllowedCountries = [
	'AT',
	'AU',
	'BE',
	'BR',
	'CA',
	'CH',
	'DE',
	'DK',
	'EE',
	'ES',
	'FI',
	'FR',
	'GB',
	'HK',
	'IE',
	'IN',
	'IT',
	'JP',
	'LT',
	'LU',
	'LV',
	'MX',
	'NL',
	'NZ',
	'NO',
	'PH',
	'PL',
	'PT',
	'RO',
	'SE',
	'SG',
	'SK',
	'US',
];
export const isInStripePaymentRequestAllowedCountries = (country: IsoCountry) =>
	stripePaymentRequestAllowedCountries.includes(country);

// ----- Functions ----- /
function stateProvinceFromMap(
	l: string,
	states: Record<string, string>,
): StateProvince | null | undefined {
	const s = l.toUpperCase();
	return states[s]
		? s
		: Object.keys(states).find(
				(key) =>
					states[key].toUpperCase() === s ||
					(s.length === 3 && s.startsWith(key)),
		  );
}

function usStateFromString(s: string): Option<UsState> {
	return stateProvinceFromMap(s, usStates) || null;
}

function caStateFromString(s: string): Option<CaState> {
	return stateProvinceFromMap(s, caStates) || null;
}

function auStateFromString(s: string): Option<AuState> {
	return stateProvinceFromMap(s, auStates) || null;
}

function stateProvinceFieldFromString(
	countryGroupId: CountryGroupId | null | undefined,
	s?: string,
): Option<StateProvince> {
	if (!s) {
		return null;
	}

	switch (countryGroupId) {
		case UnitedStates:
			return usStateFromString(s);

		case Canada:
			return caStateFromString(s);

		case AUDCountries:
			return auStateFromString(s);

		default:
			return null;
	}
}

function stateProvinceFromString(
	country: Option<IsoCountry>,
	s?: string,
): Option<StateProvince> {
	if (!s) {
		return null;
	}

	switch (country) {
		case 'US':
			return usStateFromString(s);

		case 'CA':
			return caStateFromString(s);

		case 'AU':
			return auStateFromString(s);

		default:
			return null;
	}
}

function fromString(s: string): IsoCountry | null | undefined {
	const candidateIso = s.toUpperCase();
	const isoCountryArray: IsoCountry[] = Object.keys(countries);
	const isoIndex = isoCountryArray.indexOf(candidateIso);

	if (candidateIso === 'UK') {
		return 'GB';
	}

	if (isoIndex > -1) {
		return isoCountryArray[isoIndex];
	}

	return null;
}

function findIsoCountry(country?: string): Option<IsoCountry> {
	if (!country) {
		return null;
	}

	return (
		fromString(country) ||
		Object.keys(countries).find((key) => countries[key] === country) ||
		null
	);
}

function fromCountryGroup(
	countryGroupId: CountryGroupId | null | undefined = null,
): IsoCountry | null | undefined {
	switch (countryGroupId) {
		case UnitedStates:
			return 'US';

		case Canada:
			return 'CA';

		default:
			return null;
	}
}

function fromPath(
	path: string = window.location.pathname,
): IsoCountry | null | undefined {
	if (path === '/us' || path.startsWith('/us/')) {
		return 'US';
	} else if (path === '/ca' || path.startsWith('/ca/')) {
		return 'CA';
	}

	return null;
}

function fromQueryParameter(): IsoCountry | null | undefined {
	const country = getQueryParameter('country');

	if (country) {
		return fromString(country);
	}

	return null;
}

function fromCookie(): IsoCountry | null | undefined {
	const country = cookie.get('GU_country');

	if (country) {
		return fromString(country);
	}

	return null;
}

function fromGeolocation(): IsoCountry | null | undefined {
	const country = cookie.get('GU_geo_country');

	if (country) {
		return fromString(country);
	}

	return null;
}

function setCountry(country: IsoCountry) {
	cookie.set('GU_country', country, 7);
}

type TargetCountryGroups =
	| typeof International
	| typeof EURCountries
	| typeof NZDCountries
	| typeof GBPCountries
	| typeof AUDCountries;

function handleCountryForCountryGroup(
	targetCountryGroup: TargetCountryGroups,
	countryGroupId: CountryGroupId | null | undefined = null,
): IsoCountry | null | undefined {
	const paths: Record<TargetCountryGroups, string[]> = {
		International: ['/int', '/int/'],
		EURCountries: ['/eu', '/eu/'],
		NZDCountries: ['/nz', '/nz/'],
		GBPCountries: ['/uk', '/uk/'],
		AUDCountries: ['/au', '/au/'],
	};
	const defaultCountry: Record<TargetCountryGroups, IsoCountry> = {
		International: 'IN',
		EURCountries: 'DE',
		NZDCountries: 'NZ',
		GBPCountries: 'GB',
		AUDCountries: 'AU',
	};
	const path = window.location.pathname;

	if (
		path !== paths[targetCountryGroup][0] &&
		!path.startsWith(paths[targetCountryGroup][1]) &&
		countryGroupId !== targetCountryGroup
	) {
		return null;
	}

	const candidateCountry: IsoCountry | null | undefined =
		fromQueryParameter() || fromCookie() || fromGeolocation();

	if (
		candidateCountry &&
		countryGroups[targetCountryGroup].countries.includes(candidateCountry)
	) {
		return candidateCountry;
	}

	return defaultCountry[targetCountryGroup];
}

function detect(
	countryGroupId: CountryGroupId | null | undefined = null,
): IsoCountry {
	const targetCountryGroups: TargetCountryGroups[] = [
		International,
		EURCountries,
		NZDCountries,
		GBPCountries,
		AUDCountries,
	];
	let country = null;
	targetCountryGroups.forEach((targetCountryGroupId) => {
		const candidateCountry = handleCountryForCountryGroup(
			targetCountryGroupId,
			countryGroupId,
		);

		if (candidateCountry !== null && country === null) {
			country = candidateCountry;
		}
	});

	if (country === null) {
		country =
			fromCountryGroup(countryGroupId) ||
			fromPath() ||
			fromQueryParameter() ||
			fromCookie() ||
			fromGeolocation() ||
			'GB';
	}

	setCountry(country);
	return country;
}

// ----- Exports ----- //
export {
	detect,
	setCountry,
	usStates,
	caStates,
	auStates,
	countries,
	newspaperCountries,
	findIsoCountry,
	fromString,
	fromGeolocation,
	stateProvinceFieldFromString,
	stateProvinceFromString,
	fromCountryGroup,
};
