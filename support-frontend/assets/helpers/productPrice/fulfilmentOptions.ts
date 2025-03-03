// Fulfilment options describe the various ways that a user can receive a product
import type { ActiveProductKey } from '@guardian/support-service-lambdas/modules/product-catalog/src/productCatalog';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { countryGroups } from 'helpers/internationalisation/countryGroup';

const HomeDelivery = 'HomeDelivery';
const NationalDelivery = 'NationalDelivery';
const Collection = 'Collection';
const Domestic = 'Domestic';
const RestOfWorld = 'RestOfWorld';
const NoFulfilmentOptions = 'NoFulfilmentOptions';

type GuardianWeeklyFulfilmentOptions = typeof Domestic | typeof RestOfWorld;

export type PaperFulfilmentOptions = typeof HomeDelivery | typeof Collection;

export type FulfilmentOptions =
	| typeof HomeDelivery
	| typeof NationalDelivery
	| typeof Collection
	| typeof Domestic
	| typeof RestOfWorld
	| typeof NoFulfilmentOptions;

export {
	HomeDelivery,
	NationalDelivery,
	Collection,
	Domestic,
	RestOfWorld,
	NoFulfilmentOptions,
};

const getWeeklyFulfilmentOption = (
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
		case 'Contribution':
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
		default:
			throw new Error(
				`Fulfilment option not defined for product ${productKey}`,
			);
	}
};

export { getWeeklyFulfilmentOption };
