// @flow
import { Monthly } from 'helpers/billingPeriods';
import { type FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';

import {
  applyDiscount,
  getCountryGroup,
  getCurrency,
  type Price,
  type ProductPrices,
  type Promotion,
} from './productPrices';

const country = getCountryGroup('GB').name;
const currency = getCurrency('GB');

function promotion(
  productPrices: ProductPrices,
  fulfilmentOption: FulfilmentOptions,
  productOption: ProductOptions,
): ?Promotion {
  return productPrices[country][fulfilmentOption][productOption][Monthly][currency].promotion;
}

function regularPrice(
  productPrices: ProductPrices,
  fulfilmentOption: FulfilmentOptions,
  productOption: ProductOptions,
): Price {
  return {
    price: productPrices[country][fulfilmentOption][productOption][Monthly][currency].price,
    currency,
  };
}

function finalPrice(
  productPrices: ProductPrices,
  fulfilmentOption: FulfilmentOptions,
  productOption: ProductOptions,
): Price {
  return applyDiscount(
    regularPrice(productPrices, fulfilmentOption, productOption),
    promotion(productPrices, fulfilmentOption, productOption),
  );
}

export { promotion, regularPrice, finalPrice };
