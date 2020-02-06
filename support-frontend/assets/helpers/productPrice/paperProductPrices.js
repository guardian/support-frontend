// @flow

import { Monthly } from 'helpers/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import {
  Collection,
  HomeDelivery,
} from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import { ActivePaperProductTypes } from 'helpers/productPrice/productOptions';
import type {
  CountryGroupPrices,
  ProductPrice,
  ProductPrices,
} from 'helpers/productPrice/productPrices';
import {
  finalPrice as genericFinalPrice,
  getProductPrice as genericGetProductPrice,
} from 'helpers/productPrice/productPrices';

const country = 'GB';
const billingPeriod = Monthly;

function getProductPrice(
  productPrices: ProductPrices,
  fulfilmentOption: ?FulfilmentOptions,
  productOption: ?ProductOptions,
): ProductPrice {
  return genericGetProductPrice(
    productPrices,
    country,
    billingPeriod,
    fulfilmentOption,
    productOption,
  );
}

function finalPrice(
  productPrices: ProductPrices,
  fulfilmentOption: ?FulfilmentOptions,
  productOption: ?ProductOptions,
): ProductPrice {
  return genericFinalPrice(
    productPrices,
    country,
    billingPeriod,
    fulfilmentOption,
    productOption,
  );
}

function getSavingsForFulfilmentOption(
  prices: CountryGroupPrices,
  fulfilmentOption: FulfilmentOptions,
) {
  return ActivePaperProductTypes.map((productOption) => {
    const price = prices[fulfilmentOption][productOption].Monthly.GBP;
    return price.savingVsRetail || 0;
  });
}

function getMaxSavingVsRetail(productPrices: ProductPrices): number {
  const countryPrices = productPrices['United Kingdom'];
  const allSavings = getSavingsForFulfilmentOption(countryPrices, Collection)
    .concat(getSavingsForFulfilmentOption(countryPrices, HomeDelivery));
  return Math.max(...allSavings);
}

export { getProductPrice, finalPrice, getMaxSavingVsRetail };
