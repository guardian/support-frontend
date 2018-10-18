// @flow

import { getQueryParameter } from 'helpers/url';
import type { SubscriptionProduct } from './subscriptions';

// Which products are included in the current sale?
const includedProducts: SubscriptionProduct[] = ['DigitalPack'];

function inOfferPeriod(product: SubscriptionProduct): boolean {
  // Days are 1 based, months are 0 based
  const startTime = new Date(2018, 9, 22, 0, 0).getTime(); // 22nd Oct 2018
  const endTime = new Date(2018, 10, 5, 0, 0).getTime(); // include all of 4th Nov 2018
  const now = Date.now();
  const included = includedProducts.includes(product);

  return (now > startTime && now < endTime && included) || (included && getQueryParameter('flash_sale') === 'true');
}

// Promo codes
const promoCodes = {
  DigitalPack: {
    promoCode: 'DDPO80X',
    price: 11.99,
    intcmp: '',
  },
  Paper: {
    promoCode: 'GFS80G',
    price: 5.18,
    intcmp: 'gdnwb_macqn_other_subs_SubscribeLandingPagePrintOnlySupporterLandingPagePrintOnly_',
  },
  PaperAndDigital: {
    promoCode: 'GFS80I',
    price: 10.81,
    intcmp: 'gdnwb_macqn_other_subs_SubscribeLandingPagePrint+digitalSupporterLandingPagePrint+digital_',
  },
  DailyEdition: {
    promoCode: '',
    price: 6.99,
    intcmp: '',
  },
  GuardianWeekly: {
    promoCode: '',
    price: 30,
    intcmp: '',
  },
  PremiumTier: {
    promoCode: '',
    price: 5.99,
    intcmp: '',
  },
};

function getPromoCode(product: SubscriptionProduct, defaultCode: string): string {
  if (inOfferPeriod(product)) {
    return promoCodes[product].promoCode;
  }
  return defaultCode;
}

function getIntcmp(product: SubscriptionProduct, intcmp: ?string, defaultIntcmp: string): string {
  if (inOfferPeriod(product)) {
    return promoCodes[product].intcmp || intcmp || defaultIntcmp;
  }
  return intcmp || defaultIntcmp;
}

function getDiscountedPrice(product: SubscriptionProduct, defaultPrice: number): number {
  if (inOfferPeriod(product)) {
    return promoCodes[product].price;
  }
  return defaultPrice;
}

export {
  inOfferPeriod,
  getPromoCode,
  getIntcmp,
  getDiscountedPrice,
};
