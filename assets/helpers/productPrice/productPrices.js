// @flow
import type { CountryGroupName } from 'helpers/internationalisation/countryGroup';
import { countryGroups, fromCountry } from 'helpers/internationalisation/countryGroup';
import type { BillingPeriod } from 'helpers/billingPeriods';
import type { Currency } from 'helpers/internationalisation/currency';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { NoFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import type { IsoCountry } from 'helpers/internationalisation/country';

// ----- Types ----- //

export type Promotion =
  {
    name: string,
    description: string,
    promoCode: string,
    discountedPrice?: number,
    discount?: {
      amount: number,
      durationMonths: number,
    };
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
          [Currency]: ProductPrice
        }
      }
    }
  }
}

function digitalPackProductPrice(
  productPrices: ProductPrices,
  billingPeriod: BillingPeriod,
  country: IsoCountry,
) {
  const countryGroup = countryGroups[fromCountry(country)];
  return productPrices[countryGroup.name][NoFulfilmentOptions][NoProductOptions][billingPeriod][countryGroup.currency];
}

export { digitalPackProductPrice };
