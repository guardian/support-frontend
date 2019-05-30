// @flow

import { Monthly } from 'helpers/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type {
  Price,
  ProductPrices,
  Promotion,
} from 'helpers/productPrice/productPrices';
import {
  finalPrice as genericFinalPrice,
  getPromotion as genericGetPromotion,
  regularPrice as genericRegularPrice,
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

function regularPrice(
  productPrices: ProductPrices,
  fulfilmentOption: ?FulfilmentOptions,
  productOption: ?ProductOptions,
): Price {
  return genericRegularPrice(
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
): Price {
  return genericFinalPrice(
    productPrices,
    country,
    billingPeriod,
    fulfilmentOption,
    productOption,
  );
}

export { regularPrice, finalPrice, getPromotion };
