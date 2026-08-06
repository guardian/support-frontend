import type { CountryCode } from '@modules/internationalisation/country';
import { supportRegions } from '@modules/internationalisation/supportRegion';
import type {
	FulfilmentOptions,
	GuardianWeeklyFulfilmentOptions,
} from '@modules/product/fulfilmentOptions';
import { Domestic, RestOfWorld } from '@modules/product/fulfilmentOptions';
import type { ActiveProductKey } from './productCatalog';

export const getWeeklyFulfilmentOption = (
	country: CountryCode,
): GuardianWeeklyFulfilmentOptions =>
	supportRegions.int.countries.includes(country) ? RestOfWorld : Domestic;
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
