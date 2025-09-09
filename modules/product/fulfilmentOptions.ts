// Fulfilment options describe the various ways that a user can receive a product

const HomeDelivery = 'HomeDelivery';
const NationalDelivery = 'NationalDelivery';
const Collection = 'Collection';
const Domestic = 'Domestic';
const RestOfWorld = 'RestOfWorld';
const NoFulfilmentOptions = 'NoFulfilmentOptions';

export type GuardianWeeklyFulfilmentOptions =
	| typeof Domestic
	| typeof RestOfWorld;

export type PaperFulfilmentOptions = typeof Collection | typeof HomeDelivery;

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
