// @flow

import { getQueryParameter } from 'helpers/url';
import { type CountryGroupId, detect } from 'helpers/internationalisation/countryGroup';
import { fixDecimals } from 'helpers/subscriptions';
import { type BillingPeriod } from 'helpers/billingPeriods';

import { type SubscriptionProduct } from './subscriptions';
import { AUDCountries, GBPCountries, EURCountries, Canada, International, UnitedStates, NZDCountries } from './internationalisation/countryGroup';

export type SaleCopy = {
  featuredProduct: {
    heading: string,
    subHeading: string,
    description: string,
  },
  landingPage: {
    heading: string,
    subHeading: string,
    standfirst?: string,
  },
  bundle: {
    heading: string,
    subHeading: string,
    description: string,
  },
}

type SaleDetails = {
  [CountryGroupId]: {
    promoCode: string,
    annualPlanPromoCode?: string,
    intcmp: string,
    price: number,
    annualPrice?: number,
    discountPercentage?: number,
    saleCopy?: SaleCopy,
  },
};

export type FlashSaleSubscriptionProduct = SubscriptionProduct | 'AnnualDigitalPack'

type Sale = {
  subscriptionProduct: FlashSaleSubscriptionProduct,
  activeRegions: CountryGroupId[],
  startTime: number,
  endTime: number,
  duration?: string,
  saleDetails: SaleDetails,
};

// Days are 1 based, months are 0 based

const dpSale = {
  promoCode: 'DK0NT24WG',
  intcmp: '',
  price: 0,
  saleCopy: {
    featuredProduct: {
      heading: 'Digital Pack',
      subHeading: '50% off for 3 months',
      description: 'Read The Guardian ad-free on all devices, including the Premium App and UK Daily Edition iPad app.',
    },
    landingPage: {
      heading: 'Digital Pack subscriptions',
      subHeading: 'Save 50% for 3 months on award-winning, independent journalism, ad-free on all of your devices',
    },
    bundle: {
      heading: 'Digital Pack',
      subHeading: '50% off for 3 months',
      description: 'The Premium App and the daily edition iPad app of the UK newspaper in one pack, plus ad-free reading on all your devices',
    },
  },
};

const Sales: Sale[] = [
  {
    subscriptionProduct: 'DigitalPack',
    activeRegions: [GBPCountries, UnitedStates, AUDCountries, International, EURCountries, Canada, NZDCountries],
    startTime: new Date(2019, 8, 23).getTime(), // 23 Sept 2019
    endTime: new Date(2020, 8, 23).getTime(), // 23 Sept 2020 - we don't have an end date yet
    saleDetails: {
      GBPCountries: dpSale,
      UnitedStates: dpSale,
      International: dpSale,
      Canada: dpSale,
      NZDCountries: dpSale,
      EURCountries: dpSale,
      AUDCountries: dpSale,
    },
  },
];

function getTimeTravelDaysOverride() {
  return Number(getQueryParameter('flash_sale_time_travel')) || null;
}

function getFlashSaleActiveOverride() {
  return getQueryParameter('flash_sale') === 'true';
}

function sortSalesByStartTimesDescending(a: Sale, b: Sale) {
  return b.startTime - a.startTime;
}

function getActiveFlashSales(product: SubscriptionProduct, countryGroupId: CountryGroupId = detect()): Sale[] {

  const timeTravelDays = getTimeTravelDaysOverride();
  const now = timeTravelDays ? Date.now() + (timeTravelDays * 86400000) : Date.now();

  const sales = Sales.filter(sale =>
    sale.subscriptionProduct === product &&
    sale.activeRegions.includes(countryGroupId)).sort(sortSalesByStartTimesDescending);

  return sales.filter(sale =>
    (now > sale.startTime && now < sale.endTime) ||
    getFlashSaleActiveOverride() === true);
}

function getDiscount(product: SubscriptionProduct, countryGroupId: CountryGroupId): ?number {
  const sale = getActiveFlashSales(product, countryGroupId)[0];
  return sale && sale.saleDetails[countryGroupId] && sale.saleDetails[countryGroupId].discountPercentage;
}

function getDuration(product: SubscriptionProduct, countryGroupId: CountryGroupId): ?string {
  const sale = getActiveFlashSales(product, countryGroupId)[0];
  return sale && sale.duration;
}

function flashSaleIsActive(product: SubscriptionProduct, countryGroupId: CountryGroupId = detect()): boolean {
  const sales = getActiveFlashSales(product, countryGroupId);

  return sales.length > 0;
}

function getPromoCode(
  product: SubscriptionProduct,
  countryGroupId?: CountryGroupId = detect(),
  defaultCode: string,
): string {
  if (flashSaleIsActive(product, countryGroupId)) {
    const sale = getActiveFlashSales(product, countryGroupId)[0];
    return sale && sale.saleDetails[countryGroupId].promoCode;
  }
  return defaultCode;
}

function getAnnualPlanPromoCode(
  product: SubscriptionProduct,
  countryGroupId?: CountryGroupId = detect(),
  defaultCode: string,
): string {
  if (flashSaleIsActive(product, countryGroupId)) {
    const sale = getActiveFlashSales(product, countryGroupId)[0];
    return (sale
      && sale.saleDetails[countryGroupId]
      && sale.saleDetails[countryGroupId].annualPlanPromoCode) || defaultCode;
  }
  return defaultCode;
}

function getIntcmp(
  product: SubscriptionProduct,
  countryGroupId: CountryGroupId = detect(),
  intcmp: ?string,
  defaultIntcmp: string,
): string {
  if (flashSaleIsActive(product)) {
    const sale = getActiveFlashSales(product, countryGroupId)[0];
    return (sale && sale.saleDetails[countryGroupId].intcmp) || intcmp || defaultIntcmp;
  }
  return intcmp || defaultIntcmp;
}

function getEndTime(product: SubscriptionProduct, countryGroupId: CountryGroupId) {
  const sale = getActiveFlashSales(product, countryGroupId)[0];
  return sale && sale.endTime;
}

function getSaleCopy(product: SubscriptionProduct, countryGroupId: CountryGroupId): SaleCopy {
  const emptyCopy = {
    featuredProduct: {
      heading: '',
      subHeading: '',
      description: '',
    },
    landingPage: {
      heading: '',
      subHeading: '',
    },
    bundle: {
      heading: '',
      subHeading: '',
      description: '',
    },
  };
  if (flashSaleIsActive(product, countryGroupId)) {
    const sale = getActiveFlashSales(product, countryGroupId)[0];
    return sale.saleDetails[countryGroupId].saleCopy || emptyCopy;
  }
  return emptyCopy;
}

function getFormattedFlashSalePrice(
  product: SubscriptionProduct,
  countryGroupId: CountryGroupId,
  period?: BillingPeriod,
): string {
  const sale = getActiveFlashSales(product, countryGroupId)[0];
  if (period === 'Annual') {
    const { annualPrice } = sale.saleDetails[countryGroupId];
    if (annualPrice) {
      return fixDecimals(annualPrice);
    }
    return fixDecimals(sale.saleDetails[countryGroupId].price);

  }
  return fixDecimals(sale.saleDetails[countryGroupId].price);
}

function countdownTimerIsActive(flashSaleActive: boolean, showForHowManyDays: number, endTime: number): boolean {
  if (flashSaleActive) {
    const timeTravelDays = getTimeTravelDaysOverride();
    const oneDayInMillis = 86400000;
    const now = timeTravelDays ? Date.now() + (timeTravelDays * oneDayInMillis) : Date.now();
    const daysFromNow = now + (showForHowManyDays * oneDayInMillis);

    return daysFromNow - endTime > 0;
  }
  return false;
}

function showCountdownTimer(product: SubscriptionProduct, countryGroupId: CountryGroupId): boolean {
  const flashSaleActive = flashSaleIsActive(product, countryGroupId);
  const flashSaleEndTime = getEndTime(product, countryGroupId);

  return countdownTimerIsActive(flashSaleActive, 7, flashSaleEndTime);
}


export {
  flashSaleIsActive,
  getPromoCode,
  getAnnualPlanPromoCode,
  getIntcmp,
  getEndTime,
  getSaleCopy,
  getFormattedFlashSalePrice,
  getDiscount,
  getDuration,
  getTimeTravelDaysOverride,
  getFlashSaleActiveOverride,
  countdownTimerIsActive,
  showCountdownTimer,
  dpSale,
};
