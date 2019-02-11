// @flow

// ----- Imports ----- //

import React from 'react';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { billingPeriodNoun } from 'helpers/billingPeriods';
import { countryGroups, fromCountry } from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { fixDecimals } from 'helpers/subscriptions';

export type PropTypes = {
  country: IsoCountry,
  productPrice: ProductPrice,
  billingPeriod: BillingPeriod,
}
const displayPrice = (glyph: string, price: number) => `${glyph}${fixDecimals(price)}`;
const displayPriceForPeriod = (glyph: string, price: number, billingPeriod: BillingPeriod) =>
  `${displayPrice(glyph, price)} Every ${billingPeriodNoun(billingPeriod)}`;

function discountedPrice(productPrice: ProductPrice, glyph: string, billingPeriod: BillingPeriod) {
  if (productPrice.promotion && productPrice.promotion.discountedPrice) {
    const discountPrice = productPrice.promotion.discountedPrice;
    return (
      <span>
        <del>{displayPrice(glyph, productPrice.price)}</del>&nbsp;
        {displayPriceForPeriod(glyph, discountPrice, billingPeriod)}
      </span>);
  }
  return displayPriceForPeriod(glyph, productPrice.price, billingPeriod);
}

function PriceLabel(props: PropTypes) {

  const countryGroup = countryGroups[fromCountry(props.country) || 'GBPCountries'];

  const { glyph } = currencies[countryGroup.currency];

  return discountedPrice(props.productPrice, glyph, props.billingPeriod);
}

export { PriceLabel };
