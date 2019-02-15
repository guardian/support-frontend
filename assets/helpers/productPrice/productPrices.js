// @flow
import type { CountryGroupName, CountryGroup } from 'helpers/internationalisation/countryGroup';
import { countryGroups, fromCountry } from 'helpers/internationalisation/countryGroup';
import type { BillingPeriod } from 'helpers/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { NoFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { type IsoCurrency, glyph, extendedGlyph } from 'helpers/internationalisation/currency';

// ----- Types ----- //

export type DiscountBenefit = {
  amount: number,
  durationMonths?: number,
}

export type Promotion =
  {
    name: string,
    description: string,
    promoCode: string,
    discountedPrice?: number,
    numberOfDiscountedPeriods?: number,
    discount?: DiscountBenefit,
  }

export type ProductPrice = {
    price: number,
    promotion?: Promotion
  }

export type ProductPrices = {
  [CountryGroupName]: {
    [FulfilmentOptions]: {
      [ProductOptions]: {
        [BillingPeriod]: {
          [IsoCurrency]: ProductPrice
        }
      }
    }
  }
}

export type Price = {|
  price: number,
  currency: IsoCurrency,
|};

const showPrice = (p: Price, isExtended: boolean = false): string => {
  const showGlyph = isExtended ? extendedGlyph : glyph;
  return `${showGlyph(p.currency)}${p.price.toFixed(2)}`;
};


function getCountryGroup(country: IsoCountry): CountryGroup {
  return countryGroups[fromCountry(country) || 'GBPCountries'];
}

function getCurrency(country: IsoCountry): IsoCurrency {
  const { currency } = getCountryGroup(country);
  return currency;
}

function applyPromotion(price: Price, promotion: ?Promotion) {
  if (promotion && promotion.discountedPrice) {
    return {
      ...price,
      price: promotion.discountedPrice,
    };
  }
  return price;
}

function digitalPackPromotion(
  productPrices: ProductPrices,
  billingPeriod: BillingPeriod,
  country: IsoCountry,
): ?Promotion {
  const { name } = getCountryGroup(country);
  const currency = getCurrency(country);
  return productPrices[name][NoFulfilmentOptions][NoProductOptions][billingPeriod][currency].promotion;
}

function digitalPackProductPrice(
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

function digitalPackAmountToPay(
  productPrices: ProductPrices,
  billingPeriod: BillingPeriod,
  country: IsoCountry,
): Price {
  const productPrice = digitalPackProductPrice(productPrices, billingPeriod, country);
  const promotion = digitalPackPromotion(productPrices, billingPeriod, country);

  return applyPromotion(productPrice, promotion);
}

export { showPrice, digitalPackPromotion, digitalPackProductPrice, digitalPackAmountToPay, applyPromotion };
