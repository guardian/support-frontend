import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { Currency } from 'helpers/internationalisation/currency';
import { currencies } from 'helpers/internationalisation/currency';

export const i18nIds = ['uk', 'us', 'eu', 'au', 'nz', 'ca', 'int'] as const;
export type I18nId = (typeof i18nIds)[number];

type I18nConfig = {
	currency: Currency;
	currencyKey: keyof typeof currencies;
	countryGroupId: CountryGroupId;
};

/**
 * This method takes in the first URL segment (i18nId) and returns static config
 * that varies on that segment and returns config used on all pages.
 *
 * This config value is intentially sparse to avoid overloading it with data that is
 * for a more specific use, in which case, you should try keep the data fetching closer
 * to that usecase.
 */
export const getI18nConfig = (i18nId: I18nId): I18nConfig => {
	switch (i18nId) {
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
