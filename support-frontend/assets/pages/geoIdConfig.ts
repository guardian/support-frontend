import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { Currency } from 'helpers/internationalisation/currency';
import { currencies } from 'helpers/internationalisation/currency';

type GeoIdConfig = {
	currency: Currency;
	currencyKey: keyof typeof currencies;
	countryGroupId: CountryGroupId;
};

export const geoIds = ['uk', 'us', 'eu', 'au', 'nz', 'ca', 'int'] as const;
export type GeoId = (typeof geoIds)[number];

/**
 * This method takes in the first URL segment (geoId) and returns static config
 * that varies on that segment and returns config used on all pages.
 *
 * This config value is intentially sparse to avoid overloading it with data that is
 * for a more specific use, in which case, you should try keep the data fetching closer
 * to that usecase.
 */
export const getGeoIdConfig = (geoId: GeoId): GeoIdConfig => {
	switch (geoId) {
		case 'uk':
			return {
				currency: currencies.GBP,
				currencyKey: 'GBP',
				countryGroupId: 'GBPCountries',
			};

		case 'us':
			return {
				currency: currencies.USD,
				currencyKey: 'USD',
				countryGroupId: 'UnitedStates',
			};

		case 'au':
			return {
				currency: currencies.AUD,
				currencyKey: 'AUD',
				countryGroupId: 'AUDCountries',
			};

		case 'eu':
			return {
				currency: currencies.EUR,
				currencyKey: 'EUR',
				countryGroupId: 'EURCountries',
			};

		case 'nz':
			return {
				currency: currencies.NZD,
				currencyKey: 'NZD',
				countryGroupId: 'NZDCountries',
			};

		case 'ca':
			return {
				currency: currencies.CAD,
				currencyKey: 'CAD',
				countryGroupId: 'Canada',
			};

		case 'int':
			return {
				currency: currencies.USD,
				currencyKey: 'USD',
				countryGroupId: 'International',
			};
	}
};
