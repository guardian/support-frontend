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

export { getMaxSavingVsRetail };
