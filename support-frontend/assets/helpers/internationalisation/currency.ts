// ----- Imports ----- //

import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { countryGroups } from '@modules/internationalisation/countryGroup';
import {
	getCurrencyInfo,
	type IsoCurrency,
} from '@modules/internationalisation/currency';
import { getQueryParameter } from 'helpers/urls/url';

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

const glyph = (c: IsoCurrency): string => getCurrencyInfo(c).glyph;

const extendedGlyph = (c: IsoCurrency): string =>
	getCurrencyInfo(c).extendedGlyph;

// ----- Exports ----- //
export { detect, fromCountryGroupId, glyph, extendedGlyph };
