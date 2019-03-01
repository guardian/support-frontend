// @flow

// ----- Imports ----- //

import React from 'react';
import { showPrice, applyPromotion, type Price, type Promotion } from 'helpers/productPrice/productPrices';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { billingPeriodNoun } from 'helpers/billingPeriods';

export type PropTypes = {
  productPrice: Price,
  promotion: ?Promotion,
  billingPeriod: BillingPeriod,
}
const displayPriceForPeriod = (productPrice: Price, billingPeriod: BillingPeriod) =>
  `${showPrice(productPrice)} every ${billingPeriodNoun(billingPeriod).toLowerCase()}`;

function PriceLabel({
  productPrice, promotion, billingPeriod,
}: PropTypes) {

  if (promotion && promotion.discountedPrice) {
    return (
      <span>
        <del>{showPrice(productPrice)}</del>&nbsp;
        {displayPriceForPeriod(applyPromotion(productPrice, promotion), billingPeriod)}
      </span>);
  }
  return displayPriceForPeriod(productPrice, billingPeriod);
}

export { PriceLabel };
