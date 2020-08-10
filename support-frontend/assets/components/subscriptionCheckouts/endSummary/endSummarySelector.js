// @flow

import { type Option } from 'helpers/types/option';
import { type ProductPrice, getProductPrice } from 'helpers/productPrice/productPrices';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { getBillingDescription } from 'helpers/productPrice/priceDescriptionsDigital';
import { getPriceDescription } from 'helpers/productPrice/priceDescriptions';
import { Paper } from 'helpers/subscriptions';

export type EndSummaryProps = {
  priceDescription: Option<string>,
  promotion: Option<string>,
}

const getPromotion = (productPrice: ProductPrice): Option<string> =>
  (productPrice.promotions && productPrice.promotions.length > 0
    ? productPrice.promotions[0].description
    : null);

function mapStateToProps(state: CheckoutState): EndSummaryProps {
  const {
    billingPeriod, productPrices, fulfilmentOption, productOption, product,
  } = state.page.checkout;

  const productPrice =
    getProductPrice(
      productPrices,
      state.common.internationalisation.countryId,
      billingPeriod,
      fulfilmentOption,
      productOption,
    );

  const digitalBillingPeriod = billingPeriod === 'Annual' ? billingPeriod : 'Monthly';

  return {
    priceDescription: product === Paper ?
      getPriceDescription(productPrice, billingPeriod) :
      getBillingDescription(productPrice, digitalBillingPeriod),
    promotion: getPromotion(productPrice),
  };
}

export default mapStateToProps;
