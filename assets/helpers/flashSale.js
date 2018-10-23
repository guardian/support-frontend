// @flow

import { getQueryParameter } from 'helpers/url';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { getProductPrice } from 'helpers/subscriptions';

import type { SubscriptionProduct } from './subscriptions';

// Which products are included in the current sale?
const includedProducts: SubscriptionProduct[] = ['DigitalPack'];

function flashSaleIsActive(product: SubscriptionProduct): boolean {
  // Days are 1 based, months are 0 based
  const startTime = new Date(2018, 9, 22, 0, 0).getTime(); // 22nd Oct 2018
  const endTime = new Date(2018, 10, 5, 0, 0).getTime(); // include all of 4th Nov 2018
  const now = Date.now();
  const included = includedProducts.includes(product);

  return (now > startTime && now < endTime && included) || (included && getQueryParameter('flash_sale') === 'true');
}

type PriceList = {
  [CountryGroupId]: number
}

type SaleDetails = {
  [SubscriptionProduct]: {
    promoCode: string,
    intcmp: string,
    prices?: PriceList,
  },
};

const saleDetails: SaleDetails = {
  DigitalPack: {
    promoCode: 'DDPO80X',
    intcmp: '',
    prices: {
      GBPCountries: 6,
      UnitedStates: 10,
      AUDCountries: 10.75,
      International: 10,
    },
  },
  Paper: {
    promoCode: 'GFS80G',
    intcmp: 'gdnwb_macqn_other_subs_SubscribeLandingPagePrintOnlySupporterLandingPagePrintOnly_',
  },
  PaperAndDigital: {
    promoCode: 'GFS80I',
    intcmp: 'gdnwb_macqn_other_subs_SubscribeLandingPagePrint+digitalSupporterLandingPagePrint+digital_',
  },
  DailyEdition: {
    promoCode: '',
    intcmp: '',
  },
  GuardianWeekly: {
    promoCode: '',
    intcmp: '',
  },
  PremiumTier: {
    promoCode: '',
    intcmp: '',
  },
};

function getDiscountedPrice(product: SubscriptionProduct, countryGroupId: CountryGroupId): string {
  if (flashSaleIsActive(product) && saleDetails[product].prices && saleDetails[product].prices[countryGroupId]) {
    return saleDetails[product].prices[countryGroupId].toString();
  }
  return getProductPrice(product, countryGroupId);
}

function getPromoCode(product: SubscriptionProduct, defaultCode: string): string {
  if (flashSaleIsActive(product)) {
    return saleDetails[product].promoCode;
  }
  return defaultCode;
}

function getIntcmp(product: SubscriptionProduct, intcmp: ?string, defaultIntcmp: string): string {
  if (flashSaleIsActive(product)) {
    return saleDetails[product].intcmp || intcmp || defaultIntcmp;
  }
  return intcmp || defaultIntcmp;
}

function getEndTime(): number { return new Date(2018, 9, 24, 14, 30, 0).getTime(); }

export {
  getDiscountedPrice,
  flashSaleIsActive,
  getPromoCode,
  getIntcmp,
  getEndTime,
};
