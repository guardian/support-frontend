import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { ActivePaperProductNoTestTypes } from 'helpers/productCatalogToProductOption';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getPlans } from '../helpers/getPlans';
import { PaperPrices } from './content/paperPrices';

// ---- Helpers ----- //

export type PaperProductPricesProps = {
	productPrices: ProductPrices | null | undefined;
	tab: PaperFulfilmentOptions;
	setTabAction: (arg0: PaperFulfilmentOptions) => void;
};

function PaperProductPrices({
	productPrices,
	tab,
	setTabAction,
}: PaperProductPricesProps): JSX.Element | null {
	if (!productPrices) {
		return null;
	}

	const products = getPlans(tab, productPrices, ActivePaperProductNoTestTypes);

	return (
		<PaperPrices
			activeTab={tab}
			products={products}
			setTabAction={setTabAction}
		/>
	);
}

// ----- Exports ----- //
export default PaperProductPrices;
