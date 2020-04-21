// @flow

import { getProductPrice } from 'helpers/productPrice/productPrices';
import { getPriceDescription, displayPrice } from 'helpers/productPrice/priceDescriptions';
import { extendedGlyph } from 'helpers/internationalisation/currency';

import type { ProductPrice } from 'helpers/productPrice/productPrices';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';

const getPromotion = (productPrice: ProductPrice) =>
  productPrice.promotions &&
  (productPrice.promotions.length > 0
    ? productPrice.promotions[0].description
    : null);

function mapStateToProps(state: CheckoutState) {
  const { billingPeriod, productPrices } = state.page.checkout;

  const productPrice = getProductPrice(
    productPrices,
    state.common.internationalisation.countryId,
    billingPeriod,
  );
  const glyph = extendedGlyph(productPrice.currency);

  return {
    priceDescription: getPriceDescription(productPrice, billingPeriod, true),
    promotion: getPromotion(productPrice),
    displayPrice: displayPrice(glyph, productPrice.price),
  };
}

export default mapStateToProps;
