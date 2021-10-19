import type { ProductPrice } from "helpers/productPrice/productPrices";
import { getProductPrice, showPrice } from "helpers/productPrice/productPrices";
import type { CheckoutState } from "helpers/subscriptionsForms/subscriptionCheckoutReducer";
import { getBillingDescription } from "helpers/productPrice/priceDescriptionsDigital";

const getPromotion = (productPrice: ProductPrice): string | null => productPrice.promotions && productPrice.promotions.length > 0 ? productPrice.promotions[0].description : null;

function mapStateToProps(state: CheckoutState) {
  const {
    billingPeriod,
    productPrices,
    orderIsAGift
  } = state.page.checkout;
  const productPrice = getProductPrice(productPrices, state.common.internationalisation.countryId, billingPeriod);
  const digitalBillingPeriod = billingPeriod === 'Annual' ? billingPeriod : 'Monthly';
  const digitalGiftBillingPeriod = billingPeriod === 'Annual' ? billingPeriod : 'Quarterly';
  return {
    priceDescription: getBillingDescription(productPrice, digitalBillingPeriod),
    promotion: getPromotion(productPrice),
    orderIsAGift,
    digitalGiftBillingPeriod,
    price: showPrice(productPrice)
  };
}

export default mapStateToProps;