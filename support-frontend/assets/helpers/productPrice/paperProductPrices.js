// @flow

import { Monthly } from 'helpers/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type {
  ProductPrice,
  ProductPrices,
  Promotion,
} from 'helpers/productPrice/productPrices';
import {
  finalPrice as genericFinalPrice,
  getPromotion as genericGetPromotion,
  getProductPrice as genericGetProductPrice,
} from 'helpers/productPrice/productPrices';

const country = 'GB';
const billingPeriod = Monthly;

function getPromotion(
  productPrices: ProductPrices,
  fulfilmentOption: ?FulfilmentOptions,
  productOption: ?ProductOptions,
): ?Promotion {
  return genericGetPromotion(
    productPrices,
    country,
    billingPeriod,
    fulfilmentOption,
    productOption,
  );
}

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

export { getProductPrice, finalPrice, getPromotion };
