// ----- Imports ----- //

import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { countryGroups } from '@modules/internationalisation/countryGroup';
import {
	type CurrencyCode,
	getCurrency,
} from '@modules/internationalisation/currency';
import { getQueryParameter } from 'helpers/urls/url';

// ----- Functions ----- //
function fromCountryGroupId(countryGroupId: CountryGroupId): CurrencyCode {
	const countryGroup = countryGroups[countryGroupId];

	return countryGroup.currency;
}

function fromString(s: string): CurrencyCode | null | undefined {
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

function fromQueryParameter(): CurrencyCode | null | undefined {
	const currency = getQueryParameter('currency');

	if (currency) {
		return fromString(currency);
	}

	return null;
}

function detect(countryGroup: CountryGroupId): CurrencyCode {
	return fromQueryParameter() ?? fromCountryGroupId(countryGroup);
}

const glyph = (c: CurrencyCode): string => getCurrency(c).glyph;

const extendedGlyph = (c: CurrencyCode): string => getCurrency(c).extendedGlyph;

// ----- Exports ----- //
export { detect, fromCountryGroupId, glyph, extendedGlyph };
