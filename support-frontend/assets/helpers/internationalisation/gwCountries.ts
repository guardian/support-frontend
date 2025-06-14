import type { IsoCountry } from '@modules/internationalisation/country';

const gwCountries: Partial<Record<IsoCountry, string>> = {
	GB: 'United Kingdom',
	US: 'United States',
	AF: 'Afghanistan',
	AU: 'Australia',
	NZ: 'New Zealand',
	CK: 'Cook Islands',
	CA: 'Canada',
	AD: 'Andorra',
	AL: 'Albania',
	AM: 'Armenia',
	AT: 'Austria',
	BA: 'Bosnia-Herzegovina',
	BB: 'Barbados',
	BE: 'Belgium',
	BG: 'Bulgaria',
	BL: 'Saint Barthélemy',
	BM: 'Bermuda',
	BY: 'Belarus',
	CH: 'Switzerland',
	CY: 'Cyprus',
	CZ: 'Czech Republic',
	DE: 'Germany',
	DO: 'Dominican Republic',
	DK: 'Denmark',
	EC: 'Ecuador',
	EE: 'Estonia',
	ES: 'Spain',
	FI: 'Finland',
	FO: 'Faroe Islands',
	FR: 'France',
	GD: 'Grenada',
	GF: 'French Guiana',
	GL: 'Greenland',
	GP: 'Guadeloupe',
	GR: 'Greece',
	GY: 'Guyana',
	HR: 'Croatia',
	HU: 'Hungary',
	HT: 'Haiti',
	IE: 'Ireland',
	IN: 'India',
	IT: 'Italy',
	JM: 'Jamaica',
	KY: 'Cayman Islands',
	KW: 'Kuwait',
	LI: 'Liechtenstein',
	LT: 'Lithuania',
	LU: 'Luxembourg',
	LV: 'Latvia',
	MC: 'Monaco',
	MF: 'Saint Martin',
	IS: 'Iceland',
	ME: 'Montenegro',
	MQ: 'Martinique',
	MT: 'Malta',
	NL: 'Netherlands',
	NO: 'Norway',
	PF: 'French Polynesia',
	PE: 'Peru',
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
	AG: 'Antigua & Barbuda',
	AI: 'Anguilla',
	AO: 'Angola',
	AQ: 'Antarctica',
	AR: 'Argentina',
	AS: 'American Samoa',
	AW: 'Aruba',
	AZ: 'Azerbaijan',
	BD: 'Bangladesh',
	BF: 'Burkina Faso',
	BH: 'Bahrain',
	BI: 'Burundi',
	BJ: 'Benin',
	BN: 'Brunei Darussalam',
	BO: 'Bolivia',
	BQ: 'Bonaire, Saint Eustatius and Saba',
	BR: 'Brazil',
	BS: 'Bahamas',
	BT: 'Bhutan',
	BV: 'Bouvet Island',
	BW: 'Botswana',
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
	DZ: 'Algeria',
	EG: 'Egypt',
	EH: 'Western Sahara',
	ER: 'Eritrea',
	ET: 'Ethiopia',
	FJ: 'Fiji',
	FM: 'Micronesia',
	GA: 'Gabon',
	GE: 'Georgia',
	GH: 'Ghana',
	GM: 'Gambia',
	GN: 'Guinea',
	GQ: 'Equatorial Guinea',
	GS: 'South Georgia & The South Sandwich Islands',
	GT: 'Guatemala',
	GU: 'Guam',
	GW: 'Guinea-Bissau',
	HK: 'Hong Kong',
	HM: 'Heard Island and McDonald Islands',
	HN: 'Honduras',
	ID: 'Indonesia',
	IL: 'Israel',
	IO: 'British Indian Ocean Territory',
	IR: 'Iran',
	IQ: 'Iraq',
	JO: 'Jordan',
	JP: 'Japan',
	KE: 'Kenya',
	KG: 'Kyrgyzstan',
	KH: 'Cambodia',
	KM: 'Comoros',
	KN: 'Saint Christopher & Nevis',
	KP: 'North Korea',
	KR: 'South Korea',
	KZ: 'Kazakhstan',
	LA: 'Laos',
	LB: 'Lebanon',
	LY: 'Libya',
	LC: 'Saint Lucia',
	LK: 'Sri Lanka',
	LR: 'Liberia',
	LS: 'Lesotho',
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
	PG: 'Papua New Guinea',
	PH: 'Philippines',
	PK: 'Pakistan',
	PN: 'Pitcairn Islands',
	PR: 'Puerto Rico',
	PS: 'Palestinian Territories',
	PW: 'Palau',
	PY: 'Paraguay',
	QA: 'Qatar',
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
	TD: 'Chad',
	TC: 'Turks & Caicos Islands',
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
export { gwCountries };
