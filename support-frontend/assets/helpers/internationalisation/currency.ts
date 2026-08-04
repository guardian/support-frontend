// ----- Imports ----- //

import type { CurrencyCode } from '@modules/internationalisation/currency';
import { getCurrencyByCode } from '@modules/internationalisation/currency';
import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import { supportRegions } from '@modules/internationalisation/supportRegion';
import { getQueryParameter } from 'helpers/urls/url';

// ----- Functions ----- //
function fromSupportRegionId(supportRegionId: SupportRegionId): CurrencyCode {
	return supportRegions[supportRegionId].currency.code;
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

function detect(supportRegionId: SupportRegionId): CurrencyCode {
	return fromQueryParameter() ?? fromSupportRegionId(supportRegionId);
}

const glyph = (c: CurrencyCode): string => getCurrencyByCode(c).glyph;

const extendedGlyph = (c: CurrencyCode): string =>
	getCurrencyByCode(c).extendedGlyph;

// ----- Exports ----- //
export { detect, fromSupportRegionId, glyph, extendedGlyph };
