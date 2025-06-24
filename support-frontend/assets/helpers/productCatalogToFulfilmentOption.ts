import type { IsoCountry } from '@modules/internationalisation/country';
import { countryGroups } from '@modules/internationalisation/countryGroup';
import type {
	FulfilmentOptions,
	GuardianWeeklyFulfilmentOptions,
} from '@modules/product/fulfilmentOptions';
import { Domestic, RestOfWorld } from '@modules/product/fulfilmentOptions';
import type { ActiveProductKey } from './productCatalog';

export const getWeeklyFulfilmentOption = (
	country: IsoCountry,
): GuardianWeeklyFulfilmentOptions =>
	countryGroups.International.countries.includes(country)
		? RestOfWorld
		: Domestic;
export const getFulfilmentOptionFromProductKey = (
	productKey: ActiveProductKey,
): FulfilmentOptions => {
	switch (productKey) {
		case 'SupporterPlus':
		case 'GuardianAdLite':
		case 'Contribution':
		case 'OneTimeContribution':
		case 'DigitalSubscription':
			return 'NoFulfilmentOptions';
		case 'TierThree':
		case 'GuardianWeeklyDomestic':
			return 'Domestic';
		case 'GuardianWeeklyRestOfWorld':
			return 'RestOfWorld';
		case 'SubscriptionCard':
			return 'Collection';
		case 'NationalDelivery':
		case 'HomeDelivery':
			return productKey;
	}
};
