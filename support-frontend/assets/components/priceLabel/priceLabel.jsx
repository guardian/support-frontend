// @flow

// ----- Imports ----- //

import React from 'react';
import { showPrice, applyPromotion, hasPromotion, type Price, type Promotion } from 'helpers/productPrice/productPrices';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { billingPeriodNoun } from 'helpers/billingPeriods';

import { del } from './priceLabel.module.scss';

export type PropTypes = {
  productPrice: Price,
  promotion: ?Promotion,
  billingPeriod: BillingPeriod,
}
const displayPriceForPeriod = (productPrice: Price, billingPeriod: BillingPeriod) =>
  `${showPrice(productPrice)}/${billingPeriodNoun(billingPeriod).toLowerCase()}`;

function PriceLabel({
  productPrice, promotion, billingPeriod, ...props
}: PropTypes) {

  if (hasPromotion(promotion)) {
    return (
      <span {...props}>
        <del className={del} aria-hidden="true">{showPrice(productPrice)}</del>
        {displayPriceForPeriod(applyPromotion(productPrice, promotion), billingPeriod)}
      </span>);
  }
  return (<span {...props}>{displayPriceForPeriod(productPrice, billingPeriod)}</span>);
}

export { PriceLabel };
