// @flow

import { getProductPrice } from 'helpers/productPrice/productPrices';
import { getPaperProductPrice } from 'helpers/productPrice/paperProductPrices';

import { type Option } from 'helpers/types/option';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { getBillingDescription } from 'helpers/productPrice/priceDescriptionsDigital';
import { getPaymentStartDate } from 'pages/paper-subscription-checkout/helpers/options';

export type EndSummaryProps = {
  priceDescription: Option<?string>,
  promotion: Option<?string>,
}

const getPromotion = (productPrice: ProductPrice): Option<?string> =>
  productPrice.promotions &&
  (productPrice.promotions.length > 0
    ? productPrice.promotions[0].description
    : null);

function mapStateToProps(state: CheckoutState): EndSummaryProps {
  const {
    billingPeriod, productPrices, fulfilmentOption, productOption, product,
  } = state.page.checkout;

  const productPrice = (product === 'Paper') ?
    getPaperProductPrice(
      productPrices,
      fulfilmentOption,
      productOption,
    ) :

    getProductPrice(
      productPrices,
      state.common.internationalisation.countryId,
      billingPeriod,
    );

  const digitalBillingPeriod = billingPeriod === 'Annual' ? billingPeriod : 'Monthly';

  const livePaperSubscriptionOption = productOption === 'Everyday' || productOption === 'Sixday' || productOption === 'Weekend' || productOption === 'Sunday' ? productOption : null;

  const timeNow = Date.now();
  const paymentStartDate = getPaymentStartDate(timeNow, livePaperSubscriptionOption);

  return {
    priceDescription: getBillingDescription(productPrice, digitalBillingPeriod),
    promotion: getPromotion(productPrice),
    paymentStartDate,
  };
}

export default mapStateToProps;
