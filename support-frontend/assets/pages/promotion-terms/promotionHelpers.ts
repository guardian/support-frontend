import type { ProductAndRatePlanKey } from '@modules/product-catalog/productCatalog';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { getProductDescription } from 'helpers/productCatalog';

/** The catalog product key of the first matching rate plan, used to branch UI by product. */
export function getProductKey(
	catalogRatePlans: ProductAndRatePlanKey[],
): ActiveProductKey | undefined {
	return catalogRatePlans[0]?.productKey as ActiveProductKey | undefined;
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
