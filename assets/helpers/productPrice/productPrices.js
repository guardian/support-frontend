// @flow
import type { CountryGroupName } from 'helpers/internationalisation/countryGroup';
import { countryGroups, fromCountry } from 'helpers/internationalisation/countryGroup';
import type { BillingPeriod } from 'helpers/billingPeriods';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { NoFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import type { IsoCountry } from 'helpers/internationalisation/country';

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

function digitalPackProductPrice(
  productPrices: ProductPrices,
  billingPeriod: BillingPeriod,
  country: IsoCountry,
): ProductPrice {
  const countryGroup = countryGroups[fromCountry(country) || 'GBPCountries'];
  return productPrices[countryGroup.name][NoFulfilmentOptions][NoProductOptions][billingPeriod][countryGroup.currency];
}

export { digitalPackProductPrice };
