// @flow
import type { BillingPeriod } from 'helpers/billingPeriods';
import { NoFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import type { IsoCountry } from 'helpers/internationalisation/country';

import { getCurrency, getCountryGroup, applyPromotion, type ProductPrices, type Price, type Promotion } from './productPrices';

function promotion(
  productPrices: ProductPrices,
  billingPeriod: BillingPeriod,
  country: IsoCountry,
): ?Promotion {
  const { name } = getCountryGroup(country);
  const currency = getCurrency(country);
  return productPrices[name][NoFulfilmentOptions][NoProductOptions][billingPeriod][currency].promotion;
}

function price(
  productPrices: ProductPrices,
  billingPeriod: BillingPeriod,
  country: IsoCountry,
): Price {
  const { name } = getCountryGroup(country);
  const currency = getCurrency(country);
  return {
    price: productPrices[name][NoFulfilmentOptions][NoProductOptions][billingPeriod][currency].price,
    currency,
  };
}

function amountToPay(
  productPrices: ProductPrices,
  billingPeriod: BillingPeriod,
  country: IsoCountry,
): Price {
  return applyPromotion(
    price(productPrices, billingPeriod, country),
    promotion(productPrices, billingPeriod, country),
  );
}

export { promotion, price, amountToPay };
