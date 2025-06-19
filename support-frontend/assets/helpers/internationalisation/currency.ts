// ----- Imports ----- //

import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { countryGroups } from '@modules/internationalisation/countryGroup';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { getQueryParameter } from 'helpers/urls/url';
import { CountryGroup } from './classes/countryGroup';

// ----- Types ----- //

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
};

// ----- Functions ----- //
function fromCountryGroupId(countryGroupId: CountryGroupId): IsoCurrency {
	const countryGroup = countryGroups[countryGroupId];

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

		default:
			return null;
	}
}

function currencyFromCountryCode(
	countryCode: IsoCountry,
): IsoCurrency | null | undefined {
	const countryGroupId = CountryGroup.fromCountry(countryCode);
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
	return fromQueryParameter() ?? fromCountryGroupId(countryGroup);
}

const glyph = (c: IsoCurrency): string => currencies[c].glyph;

const extendedGlyph = (c: IsoCurrency): string => currencies[c].extendedGlyph;

// ----- Exports ----- //
export {
	detect,
	spokenCurrencies,
	fromCountryGroupId,
	currencyFromCountryCode,
	currencies,
	glyph,
	extendedGlyph,
};
