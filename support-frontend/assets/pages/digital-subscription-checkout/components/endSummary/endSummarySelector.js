// @flow

import { getProductPrice } from 'helpers/productPrice/productPrices';

import { type Option } from 'helpers/types/option';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { getBillingDescription } from 'helpers/productPrice/priceDescriptionsDigital';

export type EndSummaryProps = {
  priceDescription: string,
  promotion: Option<?string>,
}

const getPromotion = (productPrice: ProductPrice): Option<?string> =>
  productPrice.promotions &&
  (productPrice.promotions.length > 0
    ? productPrice.promotions[0].description
    : null);

function mapStateToProps(state: CheckoutState): EndSummaryProps {
  const { billingPeriod, productPrices } = state.page.checkout;

  const productPrice = getProductPrice(
    productPrices,
    state.common.internationalisation.countryId,
    billingPeriod,
  );

  const digitalBillingPeriod = billingPeriod === 'Annual' ? billingPeriod : 'Monthly';

  return {
    priceDescription: getBillingDescription(productPrice, digitalBillingPeriod),
    promotion: getPromotion(productPrice),
  };
}

export default mapStateToProps;
