// Fulfilment options describe the various ways that a user can receive a product
import type { IsoCountry } from '@modules/internationalisation/country';
import { countryGroups } from 'support-frontend/assets/helpers/internationalisation/countryGroup';
import type { ActiveProductKey } from '../../support-frontend/assets/helpers/productCatalog';
import { z } from 'zod';

const HomeDelivery = 'HomeDelivery';
const NationalDelivery = 'NationalDelivery';
const Collection = 'Collection';
const Domestic = 'Domestic';
const RestOfWorld = 'RestOfWorld';
const NoFulfilmentOptions = 'NoFulfilmentOptions';

type GuardianWeeklyFulfilmentOptions = typeof Domestic | typeof RestOfWorld;

export type PaperFulfilmentOptions = typeof HomeDelivery | typeof Collection;

export const fulfilmentOptionsSchema = z.enum([
	NoFulfilmentOptions,
	NationalDelivery,
	HomeDelivery,
	Collection,
	Domestic,
	RestOfWorld,
]);

export type FulfilmentOptions = z.infer<typeof fulfilmentOptionsSchema>;

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
	throw new Error(`Fulfilment option not defined for product ${productKey}`);
};

export { getWeeklyFulfilmentOption };
