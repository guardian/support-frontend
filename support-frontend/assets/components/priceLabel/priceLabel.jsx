// @flow

// ----- Imports ----- //

import React from 'react';
import {
  getAppliedPromo,
  hasDiscount,
  type ProductPrice,
  showPrice,
} from 'helpers/productPrice/productPrices';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { getPriceDescription } from 'helpers/productPrice/priceDescriptions';

export type PropTypes = {
  productPrice: ProductPrice,
  billingPeriod: BillingPeriod,
}

function PriceLabel({
  productPrice, billingPeriod, ...props
}: PropTypes) {
  const description = getPriceDescription(productPrice, billingPeriod, true);

  const promotion = getAppliedPromo(productPrice.promotions);

  if (hasDiscount(promotion)) {
    return (
      <span {...props}>
        <del aria-hidden="true">{showPrice(productPrice)}</del>{' '}
        {description}
      </span>);
  }
  return (<span {...props}>{description}</span>);
}

export { PriceLabel };
