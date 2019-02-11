// @flow

// Fulfilment options describe the various ways that a user can receive a product
const HomeDelivery: 'HomeDelivery' = 'HomeDelivery';
const Collection: 'Collection' = 'Collection';
const Domestic: 'Domestic' = 'Domestic';
const RestOfWorld: 'RestOfWorld' = 'RestOfWorld';
const NoFulfilmentOptions: 'NoFulfilmentOptions' = 'NoFulfilmentOptions';

export type GuardianWeeklyFulfilmentOptions = typeof Domestic | typeof RestOfWorld

export type PaperFulfilmentOptions = typeof HomeDelivery | typeof Collection

export type DigitalPackFulfilmentOptions = typeof NoFulfilmentOptions

export type FulfilmentOptions =
  typeof HomeDelivery
  | typeof Collection
  | typeof Domestic
  | typeof RestOfWorld
  | typeof NoFulfilmentOptions

export { HomeDelivery, Collection, Domestic, RestOfWorld, NoFulfilmentOptions };
