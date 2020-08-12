// @flow

import { type ProductPrice, getProductPrice } from 'helpers/productPrice/productPrices';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { getPriceDescription } from 'helpers/productPrice/priceDescriptions';

const getPromotion = (productPrice: ProductPrice): string | null =>
  (productPrice.promotions && productPrice.promotions.length > 0
    ? productPrice.promotions[0].description
    : null);

function mapStateToProps(state: CheckoutState) {
  const {
    billingPeriod, productPrices, fulfilmentOption, productOption,
  } = state.page.checkout;

  const productPrice =
    getProductPrice(
      productPrices,
      state.common.internationalisation.countryId,
      billingPeriod,
      fulfilmentOption,
      productOption,
    );

  return {
    priceDescription: getPriceDescription(productPrice, billingPeriod),
    promotion: getPromotion(productPrice),
  };
}

export default mapStateToProps;
