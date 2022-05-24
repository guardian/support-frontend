import { userIsPatron } from 'helpers/patrons';
import { getBillingDescription } from 'helpers/productPrice/priceDescriptionsDigital';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import { getProductPrice, showPrice } from 'helpers/productPrice/productPrices';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import type { EndSummaryProps } from './endSummary';

const getPromotion = (productPrice: ProductPrice): string | null =>
	productPrice.promotions && productPrice.promotions.length > 0
		? productPrice.promotions[0].description
		: null;

function mapStateToProps(state: CheckoutState): EndSummaryProps {
	const { billingPeriod, productPrices, orderIsAGift } = state.page.checkout;
	const productPrice = getProductPrice(
		productPrices,
		state.common.internationalisation.countryId,
		billingPeriod,
	);
	const digitalBillingPeriod =
		billingPeriod === 'Annual' ? billingPeriod : 'Monthly';
	const digitalGiftBillingPeriod =
		billingPeriod === 'Annual' ? billingPeriod : 'Quarterly';

	return {
		priceDescription: getBillingDescription(productPrice, digitalBillingPeriod),
		promotion: getPromotion(productPrice) ?? '',
		orderIsAGift: orderIsAGift ?? false,
		digitalGiftBillingPeriod,
		price: showPrice(productPrice),
		isPatron: userIsPatron(productPrice.promotions),
	};
}

export default mapStateToProps;
