import type { ActiveProductKey } from '@guardian/support-service-lambdas/modules/product-catalog/src/productCatalog';
import { subscriptionProductTypes } from './productPrice/subscriptions';

/**
 * This file contains conversions between the legacy types used in the old checkouts
 * and the new types used in the product catalog/generic checkout.
 */

// These product types match the ones defined on the server in src/main/scala/com/gu/support/catalog/Product.scala
export const legacyProductTypes = [
	...subscriptionProductTypes,
	'TierThree',
	'SupporterPlus',
	'GuardianAdLite',
	'Contribution',
] as const;
export type LegacyProductType = (typeof legacyProductTypes)[number];

export const getLegacyProductType = (
	productKey: ActiveProductKey,
): LegacyProductType => {
	switch (productKey) {
		case 'HomeDelivery':
		case 'SubscriptionCard':
		case 'NationalDelivery':
			return 'Paper';
		case 'GuardianWeeklyRestOfWorld':
		case 'GuardianWeeklyDomestic':
			return 'GuardianWeekly';
		case 'DigitalSubscription':
			return 'DigitalPack';
		case 'OneTimeContribution':
			throw new Error(
				'OneTimeContribution does not exist in the old product catalog',
			);
		case 'GuardianPatron':
			throw new Error(
				'GuardianPatron does not exist in the old product catalog',
			);
		default:
			return productKey;
	}
};
