import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { Currency } from 'helpers/internationalisation/currency';
import { currencies } from 'helpers/internationalisation/currency';

type SupportRegionConfig = {
	currency: Currency;
	currencyKey: keyof typeof currencies;
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
				currency: currencies.GBP,
				currencyKey: 'GBP',
				countryGroupId: 'GBPCountries',
			};

		case SupportRegionId.US:
			return {
				currency: currencies.USD,
				currencyKey: 'USD',
				countryGroupId: 'UnitedStates',
			};

		case SupportRegionId.AU:
			return {
				currency: currencies.AUD,
				currencyKey: 'AUD',
				countryGroupId: 'AUDCountries',
			};

		case SupportRegionId.EU:
			return {
				currency: currencies.EUR,
				currencyKey: 'EUR',
				countryGroupId: 'EURCountries',
			};

		case SupportRegionId.NZ:
			return {
				currency: currencies.NZD,
				currencyKey: 'NZD',
				countryGroupId: 'NZDCountries',
			};

		case SupportRegionId.CA:
			return {
				currency: currencies.CAD,
				currencyKey: 'CAD',
				countryGroupId: 'Canada',
			};

		case SupportRegionId.INT:
			return {
				currency: currencies.USD,
				currencyKey: 'USD',
				countryGroupId: 'International',
			};
	}
};
