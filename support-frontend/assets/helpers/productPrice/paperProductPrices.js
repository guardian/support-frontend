// @flow

import { Monthly } from 'helpers/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type {
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

export { getProductPrice, finalPrice };
