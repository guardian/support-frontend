import type { IsoCountry } from '@modules/internationalisation/country';

const sepaEligibleCountries: Partial<Record<IsoCountry, string>> = {
	// EUR countries
	AD: 'Andorra',
	AT: 'Austria',
	BE: 'Belgium',
	CY: 'Cyprus',
	EE: 'Estonia',
	FI: 'Finland',
	FR: 'France',
	DE: 'Germany',
	GR: 'Greece',
	IE: 'Ireland',
	IT: 'Italy',
	LV: 'Latvia',
	LT: 'Lithuania',
	LU: 'Luxembourg',
	MT: 'Malta',
	MC: 'Monaco',
	NL: 'Netherlands',
	PT: 'Portugal',
	SM: 'San Marino',
	SK: 'Slovakia',
	SI: 'Slovenia',
	ES: 'Spain',

	// Non-EUR countries
	BG: 'Bulgaria',
	HR: 'Croatia',
	CZ: 'Czech Republic',
	DK: 'Denmark',
	GI: 'Gibraltar',
	HU: 'Hungary',
	IS: 'Iceland',
	LI: 'Liechtenstein',
	NO: 'Norway',
	PL: 'Poland',
	RO: 'Romania',
	SE: 'Sweden',
	CH: 'Switzerland',
	GB: 'United Kingdom',
};
export { sepaEligibleCountries };
