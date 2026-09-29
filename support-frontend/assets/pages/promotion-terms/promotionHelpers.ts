import type {
	ProductAndRatePlanKey,
	ProductKey,
} from '@modules/product-catalog/productCatalog';
import { getCustomerFacingName } from '@modules/product-catalog/productCatalog';
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
		const label = getCustomerFacingName(productKey);

		// Rate-plan display names (e.g. "Every 3 months") are only curated for the
		// active/purchasable product set - fall back to the raw key otherwise. The
		// cast is safe since productKey/productRatePlanKey always come from the
		// same catalog entry.
		const ratePlanDisplayName = isProductKey(productKey)
			? getProductDescription(
					productKey,
					productRatePlanKey as ActiveRatePlanKey,
			  ).ratePlans[productRatePlanKey]?.displayName
			: undefined;

		return `${label}, ${ratePlanDisplayName ?? productRatePlanKey}`;
	});
}
