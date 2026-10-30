import type { Currency } from '@guardian/support-service-lambdas/modules/internationalisation/src/currency';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { CurrencyCode } from '@modules/internationalisation/currency';
import { getCurrencyByCode } from '@modules/internationalisation/currency';

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
		case SupportRegionId.UK:
			return {
				currency: getCurrencyByCode('GBP'),
				currencyKey: 'GBP',
				countryGroupId: 'GBPCountries',
			};

		case SupportRegionId.US:
			return {
				currency: getCurrencyByCode('USD'),
				currencyKey: 'USD',
				countryGroupId: 'UnitedStates',
			};

		case SupportRegionId.AU:
			return {
				currency: getCurrencyByCode('AUD'),
				currencyKey: 'AUD',
				countryGroupId: 'AUDCountries',
			};

		case SupportRegionId.EU:
			return {
				currency: getCurrencyByCode('EUR'),
				currencyKey: 'EUR',
				countryGroupId: 'EURCountries',
			};

		case SupportRegionId.NZ:
			return {
				currency: getCurrencyByCode('NZD'),
				currencyKey: 'NZD',
				countryGroupId: 'NZDCountries',
			};

		case SupportRegionId.CA:
			return {
				currency: getCurrencyByCode('CAD'),
				currencyKey: 'CAD',
				countryGroupId: 'Canada',
			};

		case SupportRegionId.INT:
			return {
				currency: getCurrencyByCode('USD'),
				currencyKey: 'USD',
				countryGroupId: 'International',
			};
	}
};
