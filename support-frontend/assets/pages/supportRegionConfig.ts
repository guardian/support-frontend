import type { Currency } from '@guardian/support-service-lambdas/modules/internationalisation/src/currency';
import type { CurrencyCode } from '@modules/internationalisation/currency';
import { getCurrencyByCode } from '@modules/internationalisation/currency';
import type { SupportRegionId } from '@modules/internationalisation/supportRegion';

type SupportRegionConfig = {
	currency: Currency;
	currencyKey: CurrencyCode;
	supportRegionId: SupportRegionId;
};

/**
 * This method takes in the first URL segment (supportRegionId) and returns static config
 * that varies on that segment and returns config used on all pages.
 *
 * This config value is intentially sparse to avoid overloading it with data that is
 * for a more specific use, in which case, you should try keep the data fetching closer
 * to that usecase.
 */
export const getSupportRegionIdConfig = (
	supportRegionId: SupportRegionId,
): SupportRegionConfig => {
	switch (supportRegionId) {
		case 'uk':
			return {
				currency: getCurrencyByCode('GBP'),
				currencyKey: 'GBP',
				supportRegionId: 'uk',
			};

		case 'us':
			return {
				currency: getCurrencyByCode('USD'),
				currencyKey: 'USD',
				supportRegionId: 'us',
			};

		case 'au':
			return {
				currency: getCurrencyByCode('AUD'),
				currencyKey: 'AUD',
				supportRegionId: 'au',
			};

		case 'eu':
			return {
				currency: getCurrencyByCode('EUR'),
				currencyKey: 'EUR',
				supportRegionId: 'eu',
			};

		case 'nz':
			return {
				currency: getCurrencyByCode('NZD'),
				currencyKey: 'NZD',
				supportRegionId: 'nz',
			};

		case 'ca':
			return {
				currency: getCurrencyByCode('CAD'),
				currencyKey: 'CAD',
				supportRegionId: 'ca',
			};

		case 'int':
			return {
				currency: getCurrencyByCode('USD'),
				currencyKey: 'USD',
				supportRegionId: 'int',
			};
	}
};
