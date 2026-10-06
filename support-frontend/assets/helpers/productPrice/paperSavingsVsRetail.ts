import { newspaperProducts } from '@modules/product-catalog/productCatalog';
import type { WindowProductCatalog } from 'helpers/globalsAndSwitches/window';
import { ActivePaperProductTypes } from '../productCatalogToProductOption';

function getMaxSavingVsRetail(productCatalog: WindowProductCatalog): number {
	const allSavings = newspaperProducts.flatMap((productKey) =>
		ActivePaperProductTypes.map(
			(productOption) =>
				productCatalog[productKey]?.ratePlans[productOption]?.savingVsRetail ??
				0,
		),
	);

	return Math.max(...allSavings);
}

export { getMaxSavingVsRetail };
