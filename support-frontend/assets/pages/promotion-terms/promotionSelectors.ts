import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { getProductDescription } from 'helpers/productCatalog';
import {
	DigitalPack,
	GuardianWeekly,
	Paper,
} from 'helpers/productPrice/subscriptions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';

type CatalogRatePlan =
	PromoWithCatalogInformation['appliesTo']['catalogRatePlans'][number];

// Maps a product catalog key onto the small set of products this page distinguishes between.
function subscriptionProductForCatalogKey(
	productKey: string,
): SubscriptionProduct {
	if (productKey === 'DigitalSubscription') {
		return DigitalPack;
	}
	if (
		productKey === 'GuardianWeeklyDomestic' ||
		productKey === 'GuardianWeeklyRestOfWorld'
	) {
		return GuardianWeekly;
	}
	return Paper;
}

/** Derives the small set of products this page distinguishes between from the first matching catalog rate plan. */
export function getSubscriptionProduct(
	catalogRatePlans: CatalogRatePlan[],
): SubscriptionProduct {
	const [firstMatch] = catalogRatePlans;
	return firstMatch
		? subscriptionProductForCatalogKey(firstMatch.productKey)
		: DigitalPack;
}

/** A promotion is treated as gift-only if every matching rate plan is a gift rate plan. */
export function isGiftPromotion(catalogRatePlans: CatalogRatePlan[]): boolean {
	return (
		catalogRatePlans.length > 0 &&
		catalogRatePlans.every(({ productRatePlanKey }) =>
			productRatePlanKey.includes('Gift'),
		)
	);
}

/** Human-readable "<product>, <rate plan>" labels for the "Applies to products:" list. */
export function getProductRatePlanDescriptions(
	catalogRatePlans: CatalogRatePlan[],
): string[] {
	return catalogRatePlans.map(({ productKey, productRatePlanKey }) => {
		try {
			const description = getProductDescription(
				productKey as ActiveProductKey,
				productRatePlanKey as ActiveRatePlanKey,
			);
			return (
				description.label +
				', ' +
				(description.ratePlans[productRatePlanKey]?.displayName ??
					productRatePlanKey)
			);
		} catch {
			return productRatePlanKey;
		}
	});
}
