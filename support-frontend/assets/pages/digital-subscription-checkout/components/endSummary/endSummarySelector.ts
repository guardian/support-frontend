import { userIsPatron } from 'helpers/patrons';
import { getBillingDescription } from 'helpers/productPrice/priceDescriptionsDigital';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import { showPrice } from 'helpers/productPrice/productPrices';
import { selectPriceForProduct } from 'helpers/redux/checkout/product/selectors/productPrice';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import type { EndSummaryProps } from './endSummary';

const getPromotion = (productPrice: ProductPrice): string | null =>
	productPrice.promotions && productPrice.promotions.length > 0
		? productPrice.promotions[0].description
		: null;

function mapStateToProps(state: SubscriptionsState): EndSummaryProps {
	const { billingPeriod, orderIsAGift } = state.page.checkoutForm.product;
	const productPrice = selectPriceForProduct(state);
	const digitalBillingPeriod =
		billingPeriod === 'Annual' ? billingPeriod : 'Monthly';
	const digitalGiftBillingPeriod =
		billingPeriod === 'Annual' ? billingPeriod : 'Quarterly';

	return {
		priceDescription: getBillingDescription(productPrice, digitalBillingPeriod),
		promotion: getPromotion(productPrice) ?? '',
		orderIsAGift,
		digitalGiftBillingPeriod,
		price: showPrice(productPrice),
		isPatron: userIsPatron(productPrice.promotions),
	};
}

export default mapStateToProps;
