// @flow

// ----- Imports ----- //

import React from 'react';
import {
  type ProductPrice,
  showPrice,
} from 'helpers/productPrice/productPrices';
import { billingPeriodNoun, Quarterly, type BillingPeriod } from 'helpers/billingPeriods';
import { getPriceDescription } from 'helpers/productPrice/priceDescriptions';
import { getAppliedPromo, hasDiscount } from 'helpers/productPrice/promotions';
import { type Option } from 'helpers/types/option';

export type PropTypes = {
  productPrice: ProductPrice,
  billingPeriod: BillingPeriod,
  orderIsAGift: Option<boolean>,
  giftStyles?: Object,
  tabletAndDesktop?: Object,
}

function PriceLabel({
  productPrice,
  billingPeriod,
  orderIsAGift,
  giftStyles,
  tabletAndDesktop,
  ...props
}: PropTypes) {
  const description = getPriceDescription(productPrice, billingPeriod, orderIsAGift, true);

  const promotion = getAppliedPromo(productPrice.promotions);
  return (
    <span {...props}>
      {
        hasDiscount(promotion) && (
          <del aria-hidden="true">{showPrice(productPrice)}</del>
        )
      }
      {orderIsAGift && (
        <span className={tabletAndDesktop}>
          <span>{billingPeriodNoun(billingPeriod, orderIsAGift)}<br /></span>
        </span>)
      }
      <span className={orderIsAGift && giftStyles}>{description}</span>
    </span>);
}

PriceLabel.defaultProps = {
  giftStyles: {},
  tabletAndDesktop: {},
};

export { PriceLabel };
