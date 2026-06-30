import type { Currency } from '@guardian/support-service-lambdas/modules/internationalisation/src/currency';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { CurrencyCode } from '@modules/internationalisation/currency';
import { getCurrency } from '@modules/internationalisation/currency';
import type { SupportRegionId } from '@modules/internationalisation/supportRegion';

type SupportRegionConfig = {
	currency: Currency;
	currencyKey: CurrencyCode;
	countryGroupId: CountryGroupId;
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
				currency: getCurrency('GBP'),
				currencyKey: 'GBP',
				countryGroupId: 'GBPCountries',
			};

		case 'us':
			return {
				currency: getCurrency('USD'),
				currencyKey: 'USD',
				countryGroupId: 'UnitedStates',
			};

		case 'au':
			return {
				currency: getCurrency('AUD'),
				currencyKey: 'AUD',
				countryGroupId: 'AUDCountries',
			};

		case 'eu':
			return {
				currency: getCurrency('EUR'),
				currencyKey: 'EUR',
				countryGroupId: 'EURCountries',
			};

		case 'nz':
			return {
				currency: getCurrency('NZD'),
				currencyKey: 'NZD',
				countryGroupId: 'NZDCountries',
			};

		case 'ca':
			return {
				currency: getCurrency('CAD'),
				currencyKey: 'CAD',
				countryGroupId: 'Canada',
			};

		case 'int':
			return {
				currency: getCurrency('USD'),
				currencyKey: 'USD',
				countryGroupId: 'International',
			};
	}
};
