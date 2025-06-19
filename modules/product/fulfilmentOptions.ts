// Fulfilment options describe the various ways that a user can receive a product
import { z } from 'zod';

const HomeDelivery = 'HomeDelivery';
const NationalDelivery = 'NationalDelivery';
const Collection = 'Collection';
const Domestic = 'Domestic';
const RestOfWorld = 'RestOfWorld';
const NoFulfilmentOptions = 'NoFulfilmentOptions';

export type GuardianWeeklyFulfilmentOptions =
	| typeof Domestic
	| typeof RestOfWorld;

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
