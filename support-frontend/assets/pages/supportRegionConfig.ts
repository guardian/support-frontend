import type { CurrencyInfo } from '@guardian/support-service-lambdas/modules/internationalisation/src/currency';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { getCurrencyInfo } from '@modules/internationalisation/currency';
import type { IsoCurrency } from '@modules/internationalisation/currency';

type SupportRegionConfig = {
	currency: CurrencyInfo;
	currencyKey: IsoCurrency;
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
	const currencyInfo = (code: IsoCurrency): CurrencyInfo =>
		getCurrencyInfo(code);

	switch (supportRegionId) {
		case SupportRegionId.UK:
			return {
				currency: currencyInfo('GBP'),
				currencyKey: 'GBP',
				countryGroupId: 'GBPCountries',
			};

		case SupportRegionId.US:
			return {
				currency: currencyInfo('USD'),
				currencyKey: 'USD',
				countryGroupId: 'UnitedStates',
			};

		case SupportRegionId.AU:
			return {
				currency: currencyInfo('AUD'),
				currencyKey: 'AUD',
				countryGroupId: 'AUDCountries',
			};

		case SupportRegionId.EU:
			return {
				currency: currencyInfo('EUR'),
				currencyKey: 'EUR',
				countryGroupId: 'EURCountries',
			};

		case SupportRegionId.NZ:
			return {
				currency: currencyInfo('NZD'),
				currencyKey: 'NZD',
				countryGroupId: 'NZDCountries',
			};

		case SupportRegionId.CA:
			return {
				currency: currencyInfo('CAD'),
				currencyKey: 'CAD',
				countryGroupId: 'Canada',
			};

		case SupportRegionId.INT:
			return {
				currency: currencyInfo('USD'),
				currencyKey: 'USD',
				countryGroupId: 'International',
			};
	}
};
