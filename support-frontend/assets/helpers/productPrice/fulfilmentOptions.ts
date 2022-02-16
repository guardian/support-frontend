// Fulfilment options describe the various ways that a user can receive a product
import type { IsoCountry } from 'helpers/internationalisation/country';
import { countryGroups } from 'helpers/internationalisation/countryGroup';

const HomeDelivery = 'HomeDelivery';
const Collection = 'Collection';
const Domestic = 'Domestic';
const RestOfWorld = 'RestOfWorld';
const NoFulfilmentOptions = 'NoFulfilmentOptions';

export type GuardianWeeklyFulfilmentOptions =
	| typeof Domestic
	| typeof RestOfWorld;

export type PaperFulfilmentOptions = typeof HomeDelivery | typeof Collection;

export type DigitalPackFulfilmentOptions = typeof NoFulfilmentOptions;

export type FulfilmentOptions =
	| typeof HomeDelivery
	| typeof Collection
	| typeof Domestic
	| typeof RestOfWorld
	| typeof NoFulfilmentOptions;

export { HomeDelivery, Collection, Domestic, RestOfWorld, NoFulfilmentOptions };

const getWeeklyFulfilmentOption = (
	country: IsoCountry,
): GuardianWeeklyFulfilmentOptions =>
	countryGroups.International.countries.includes(country)
		? RestOfWorld
		: Domestic;

export { getWeeklyFulfilmentOption };
