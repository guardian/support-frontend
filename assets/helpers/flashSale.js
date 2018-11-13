// @flow

import { getQueryParameter } from 'helpers/url';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

import type { SubscriptionProduct } from './subscriptions';

// Get end time
function getEndTime(): number {
  return new Date(2018, 11, 3, 0, 0).getTime(); // include all of 2nd Dec 2018
}

// Which products are included in the current sale?
const includedProducts: SubscriptionProduct[] = ['DigitalPack', 'Paper', 'PaperAndDigital'];

function flashSaleIsActive(product: SubscriptionProduct): boolean {
  // Days are 1 based, months are 0 based
  const startTime = new Date(2018, 10, 19, 0, 0).getTime(); // 19th Nov 2018
  const endTime = getEndTime();
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
    promoCode: 'DDPBF80X',
    intcmp: '',
  },
  Paper: {
    promoCode: 'GCA80F',
    intcmp: 'gdnwb_macqn_other_subs_SubscribeLandingPagePrintOnlySupporterLandingPagePrintOnly_',
  },
  PaperAndDigital: {
    promoCode: 'GCA80G',
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

function getCountdownAbTestParticipation(): boolean {
  return getQueryParameter('ab_timer') === 'variant';
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

export {
  flashSaleIsActive,
  getPromoCode,
  getIntcmp,
  getCountdownAbTestParticipation,
  getEndTime,
};
