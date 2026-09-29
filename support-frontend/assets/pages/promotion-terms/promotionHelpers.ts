import type {
	ProductAndRatePlanKey,
	ProductKey,
} from '@modules/product-catalog/productCatalog';
import type { ActiveRatePlanKey } from 'helpers/productCatalog';
import { getProductDescription, isProductKey } from 'helpers/productCatalog';

/** The catalog product key of the first matching rate plan, used to branch UI by product. */
export function getProductKey(
	catalogRatePlans: ProductAndRatePlanKey[],
): ProductKey | undefined {
	return catalogRatePlans[0]?.productKey;
}

/** A promotion is treated as gift-only if every matching rate plan is a gift rate plan. */
export function isGiftPromotion(
	catalogRatePlans: ProductAndRatePlanKey[],
): boolean {
	return (
		catalogRatePlans.length > 0 &&
		catalogRatePlans.every(({ productRatePlanKey }) =>
			productRatePlanKey.includes('Gift'),
		)
	);
}

/** Human-readable "<product>, <rate plan>" labels for the "Applies to products:" list. */
export function getProductRatePlanDescriptions(
	catalogRatePlans: ProductAndRatePlanKey[],
): string[] {
	return catalogRatePlans.map(({ productKey, productRatePlanKey }) => {
		// Promotions can apply to catalog rate plans outside the "active"/purchasable
		// product set that getProductDescription covers (e.g. legacy paper/weekly
		// zone products) - fall back to the raw key for those.
		if (!isProductKey(productKey)) {
			return productRatePlanKey;
		}

		// isProductKey only narrows productKey - productRatePlanKey is still typed as
		// the union of rate plan keys across the *whole* catalog (the correlation to
		// this specific productKey is lost on destructuring), so this assertion still
		// relies on the two having come from the same catalog entry, as they always do.
		const description = getProductDescription(
			productKey,
			productRatePlanKey as ActiveRatePlanKey,
		);
		return (
			description.label +
			', ' +
			(description.ratePlans[productRatePlanKey]?.displayName ??
				productRatePlanKey)
		);
	});
}
