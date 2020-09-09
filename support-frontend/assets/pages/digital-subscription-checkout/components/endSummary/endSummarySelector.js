// @flow

import { type ProductPrice, getProductPrice } from 'helpers/productPrice/productPrices';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { getBillingDescription } from 'helpers/productPrice/priceDescriptionsDigital';
import { giftPeriod } from '../helpers';

const getPromotion = (productPrice: ProductPrice): string | null =>
  (productPrice.promotions && productPrice.promotions.length > 0
    ? productPrice.promotions[0].description
    : null);

function mapStateToProps(state: CheckoutState) {
  const {
    billingPeriod, productPrices, orderIsAGift,
  } = state.page.checkout;

  const productPrice =
    getProductPrice(
      productPrices,
      state.common.internationalisation.countryId,
      billingPeriod,
    );

  const digitalBillingPeriod = billingPeriod === 'Annual' ? billingPeriod : 'Monthly';

  const giftType = orderIsAGift ? giftPeriod[digitalBillingPeriod] : null;

  return {
    priceDescription: getBillingDescription(productPrice, digitalBillingPeriod),
    promotion: getPromotion(productPrice),
    giftType,
  };
}

export default mapStateToProps;
