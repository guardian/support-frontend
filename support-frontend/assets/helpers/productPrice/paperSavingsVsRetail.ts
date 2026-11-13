import type { ProductKey } from '@modules/product-catalog/productCatalog';
import type { WindowProductCatalog } from 'helpers/globalsAndSwitches/window';
import { ActivePaperProductTypes } from '../productCatalogToProductOption';

// Defined locally because importing newspaperProducts from the product-catalog
// module pulls the catalog zod schema into the bundle
const paperProductKeys = [
	'SubscriptionCard',
	'HomeDelivery',
	'NationalDelivery',
] as const satisfies readonly ProductKey[];

function getMaxSavingVsRetail(productCatalog: WindowProductCatalog): number {
	const allSavings = paperProductKeys.flatMap((productKey) =>
		ActivePaperProductTypes.map(
			(productOption) =>
				productCatalog[productKey]?.ratePlans[productOption]?.savingVsRetail ??
				0,
		),
	);

	return Math.max(...allSavings);
}

function hackRemoveMeDiscount(discountPercentage: number) {
	// We have had a misunderstanding around how to get the correct
	// rounding for discount percentages. This is a temporary fix
	if (discountPercentage === 49) {
		return 50;
	} else if (discountPercentage === 34) {
		return 35;
	}
	return discountPercentage;
}

/**
 * @param discountedPrice - price after promo discount applied to online price
 * @param onlineVsRetailPerc - % discount of normal online price vs retail price
 * @param discountedVsOnlinePerc - % discount of discountedPrice against normal online price
 */
const getDiscountVsRetail = (
	discountedPrice: number,
	onlineVsRetailPerc: number,
	discountedVsOnlinePerc: number,
): number => {
	const onlinePrice = discountedPrice / (1 - discountedVsOnlinePerc / 100);
	const retailPrice = onlinePrice / (1 - onlineVsRetailPerc / 100);
	const totalSavingVsRetail = (1 - discountedPrice / retailPrice) * 100;
	/**
	 * We should never overstate a discount,
	 * even by a fraction of a %. Therefore
	 * we always round down to the nearest whole number.
	 */
	return hackRemoveMeDiscount(Math.floor(totalSavingVsRetail));
};

export { getMaxSavingVsRetail, getDiscountVsRetail };
