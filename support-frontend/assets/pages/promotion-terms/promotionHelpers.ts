import type {
	ProductAndRatePlanKey,
	ProductKey,
} from '@modules/product-catalog/productCatalog';
import { getCustomerFacingName } from '@modules/product-catalog/productCatalog';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import type { ActiveRatePlanKey } from 'helpers/productCatalog';
import { getProductDescription, isProductKey } from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';

dayjs.extend(advancedFormat);

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

export function buildThreeTierCardPromoTerms(
	promoCount: number,
	productName: string,
	discountSummary: string,
	{ starts, expires }: Promotion,
): string {
	console.log('🚀 ~ buildThreeTierCardPromoTerms ~ promoCount:', promoCount);
	const startDate = dayjs(starts).format('Do MMMM'); // eg. 15th January
	const expiryDate = dayjs(expires).format('Do MMMM YYYY'); // eg. 31st April 2028
	const promoDuration =
		starts && expires
			? `Offer starts on the ${startDate} and ends on the ${expiryDate}.`
			: '';

	return ` ${'*'.repeat(
		promoCount,
	)} ${productName} offer is ${discountSummary} afterwards unless you cancel.
			Offer only available to new subscribers who do not have an existing subscription with the Guardian. 
			${promoDuration}`;
}
