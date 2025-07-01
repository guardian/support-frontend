// ----- Imports ----- //
import type { BillingPeriod } from '@modules/product/billingPeriod';
import { getPriceDescription } from 'helpers/productPrice/priceDescriptions';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import { showPrice } from 'helpers/productPrice/productPrices';
import { getAppliedPromo, hasDiscount } from 'helpers/productPrice/promotions';

type PropTypes = {
	productPrice: ProductPrice;
	billingPeriod: BillingPeriod;
	className: string;
};

function PriceLabel({
	productPrice,
	billingPeriod,
	...props
}: PropTypes): JSX.Element {
	const description = getPriceDescription(productPrice, billingPeriod, true);
	const promotion = getAppliedPromo(productPrice.promotions);

	return (
		<span {...props}>
			{hasDiscount(promotion) && (
				<del aria-hidden="true">{showPrice(productPrice)}</del>
			)}
			<span>{` ${description}`}</span>
		</span>
	);
}

export { PriceLabel };
