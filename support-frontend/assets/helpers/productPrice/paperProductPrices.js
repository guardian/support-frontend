// @flow
import { Monthly } from 'helpers/billingPeriods';
import { type FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { type PaperProductOptions } from 'helpers/productPrice/productOptions';

import { getCurrency, getCountryGroup, applyPromotion, type ProductPrices, type Price, type Promotion } from './productPrices';

const { name: country } = getCountryGroup('GB');
const currency = getCurrency('GB');

function promotion(
  productPrices: ProductPrices,
  fulfilmentOption: FulfilmentOptions,
  productOption: PaperProductOptions,
): ?Promotion {
  return productPrices[country][fulfilmentOption][productOption][Monthly][currency].promotion;
}

function regularPrice(
  productPrices: ProductPrices,
  fulfilmentOption: FulfilmentOptions,
  productOption: PaperProductOptions,
): Price {
  return {
    price: productPrices[country][fulfilmentOption][productOption][Monthly][currency].price,
    currency,
  };
}

function finalPrice(
  productPrices: ProductPrices,
  fulfilmentOption: FulfilmentOptions,
  productOption: PaperProductOptions,
): Price {
  return applyPromotion(
    regularPrice(productPrices, fulfilmentOption, productOption),
    promotion(productPrices, fulfilmentOption, productOption),
  );
}

export { promotion, regularPrice, finalPrice };
