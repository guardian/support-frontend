// @flow

// ----- Imports ----- //

import React from 'react';
import {
  type ProductPrice,
  showPrice,
} from 'helpers/productPrice/productPrices';
import { Quarterly, type BillingPeriod } from 'helpers/billingPeriods';
import { getPriceDescription } from 'helpers/productPrice/priceDescriptions';
import { getAppliedPromo, hasDiscount } from 'helpers/productPrice/promotions';
import { type Option } from 'helpers/types/option';

export type PropTypes = {
  productPrice: ProductPrice,
  billingPeriod: BillingPeriod,
  orderIsAGift: Option<boolean>,
  giftStyles?: Object,
}

function PriceLabel({
  productPrice, billingPeriod, orderIsAGift, giftStyles, ...props
}: PropTypes) {
  const description = getPriceDescription(productPrice, billingPeriod, orderIsAGift, true);

  const promotion = getAppliedPromo(productPrice.promotions);

  if (hasDiscount(promotion)) {
    return (
      <span {...props}>
        <del aria-hidden="true">{showPrice(productPrice)}</del>{' '}
        {orderIsAGift && billingPeriod === Quarterly ?
          <span>3 Months<br /></span> :
          <span>A year<br /></span>
        }
        <span className={orderIsAGift && giftStyles}>{description}</span>
      </span>);
  }
  return (
    <span {...props}>
      {orderIsAGift && billingPeriod === Quarterly ?
        <span>3 Months<br /></span> :
        <span>A year<br /></span>
        }
      <span className={orderIsAGift && giftStyles}>{description}</span>
    </span>);
}

PriceLabel.defaultProps = {
  giftStyles: {},
};

export { PriceLabel };
