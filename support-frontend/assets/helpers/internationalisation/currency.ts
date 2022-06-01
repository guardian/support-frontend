// ----- Imports ----- //

import { getQueryParameter } from 'helpers/urls/url';
import type { IsoCountry } from './country';
import type { CountryGroup, CountryGroupId } from './countryGroup';
import { countryGroups, fromCountry } from './countryGroup';

// ----- Types ----- //

export type IsoCurrency =
	| 'GBP'
	| 'USD'
	| 'AUD'
	| 'EUR'
	| 'NZD'
	| 'CAD'
	| 'SEK'
	| 'CHF'
	| 'NOK'
	| 'DKK';
export type Currency = {
	glyph: string;
	extendedGlyph: string;
	isSuffixGlyph: boolean;
	isPaddedGlyph: boolean;
};
export type SpokenCurrency = {
	singular: string;
	plural: string;
};

// ----- Config ----- //

const currencies: Record<IsoCurrency, Currency> = {
	GBP: {
		glyph: '£',
		extendedGlyph: '£',
		isSuffixGlyph: false,
		isPaddedGlyph: false,
	},
	USD: {
		glyph: '$',
		extendedGlyph: 'US$',
		isSuffixGlyph: false,
		isPaddedGlyph: false,
	},
	AUD: {
		glyph: '$',
		extendedGlyph: 'AU$',
		isSuffixGlyph: false,
		isPaddedGlyph: false,
	},
	EUR: {
		glyph: '€',
		extendedGlyph: '€',
		isSuffixGlyph: false,
		isPaddedGlyph: false,
	},
	NZD: {
		glyph: '$',
		extendedGlyph: 'NZ$',
		isSuffixGlyph: false,
		isPaddedGlyph: false,
	},
	CAD: {
		glyph: '$',
		extendedGlyph: 'CA$',
		isSuffixGlyph: false,
		isPaddedGlyph: false,
	},
	SEK: {
		glyph: 'kr',
		extendedGlyph: 'SEK',
		isSuffixGlyph: true,
		isPaddedGlyph: true,
	},
	CHF: {
		glyph: 'fr.',
		extendedGlyph: 'CHF',
		isSuffixGlyph: true,
		isPaddedGlyph: true,
	},
	NOK: {
		glyph: 'kr',
		extendedGlyph: 'NOK',
		isSuffixGlyph: true,
		isPaddedGlyph: true,
	},
	DKK: {
		glyph: 'kr.',
		extendedGlyph: 'DKK',
		isSuffixGlyph: true,
		isPaddedGlyph: true,
	},
};
const spokenCurrencies: Record<IsoCurrency, SpokenCurrency> = {
	GBP: {
		singular: 'pound',
		plural: 'pounds',
	},
	USD: {
		singular: 'dollar',
		plural: 'dollars',
	},
	AUD: {
		singular: 'dollar',
		plural: 'dollars',
	},
	EUR: {
		singular: 'euro',
		plural: 'euros',
	},
	NZD: {
		singular: 'dollar',
		plural: 'dollars',
	},
	CAD: {
		singular: 'dollar',
		plural: 'dollars',
	},
	SEK: {
		singular: 'krona',
		plural: 'kronor',
	},
	CHF: {
		singular: 'franc',
		plural: 'francs',
	},
	NOK: {
		singular: 'krone',
		plural: 'kroner',
	},
	DKK: {
		singular: 'krone',
		plural: 'kroner',
	},
};

// ----- Functions ----- //
function fromCountryGroupId(
	countryGroupId: CountryGroupId,
): IsoCurrency | null | undefined {
	const countryGroup: CountryGroup | null | undefined =
		countryGroups[countryGroupId];

	if (!countryGroup) {
		return null;
	}

	return countryGroup.currency;
}

function fromString(s: string): IsoCurrency | null | undefined {
	switch (s.toLowerCase()) {
		case 'gbp':
			return 'GBP';

		case 'usd':
			return 'USD';

		case 'aud':
			return 'AUD';

		case 'eur':
			return 'EUR';

		case 'nzd':
			return 'NZD';

		case 'cad':
			return 'CAD';

		case 'sek':
			return 'SEK';

		case 'chf':
			return 'CHF';

		case 'nok':
			return 'NOK';

		case 'dkk':
			return 'DKK';

		default:
			return null;
	}
}

function currencyFromCountryCode(
	countryCode: IsoCountry,
): IsoCurrency | null | undefined {
	const countryGroupId = fromCountry(countryCode);
	return countryGroupId ? fromCountryGroupId(countryGroupId) : null;
}

function fromQueryParameter(): IsoCurrency | null | undefined {
	const currency = getQueryParameter('currency');

	if (currency) {
		return fromString(currency);
	}

	return null;
}

function detect(countryGroup: CountryGroupId): IsoCurrency {
	return fromQueryParameter() ?? fromCountryGroupId(countryGroup) ?? 'GBP';
}

const glyph = (c: IsoCurrency): string => currencies[c].glyph;

const extendedGlyph = (c: IsoCurrency): string => currencies[c].extendedGlyph;

const isSuffixGlyph = (c: IsoCurrency): boolean => currencies[c].isSuffixGlyph;

const isPaddedGlyph = (c: IsoCurrency): boolean => currencies[c].isPaddedGlyph;

// ----- Exports ----- //
export {
	detect,
	spokenCurrencies,
	fromCountryGroupId,
	currencyFromCountryCode,
	currencies,
	glyph,
	extendedGlyph,
	isSuffixGlyph,
	isPaddedGlyph,
};
