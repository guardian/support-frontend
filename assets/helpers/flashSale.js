// @flow

import { getQueryParameter } from 'helpers/url';
import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { fixDecimals } from 'helpers/subscriptions';

import type { SubscriptionProduct } from './subscriptions';

export type SaleCopy = {
  landingPage: {
    heading: string,
    subHeading: string,
  },
  bundle: {
    heading: string,
    subHeading: string,
    description: string,
  },
}

type SaleDetails = {
  [CountryGroupId]: {
    [SubscriptionProduct]: {
      promoCode: string,
      intcmp: string,
      price: number,
      saleCopy: SaleCopy,
    },
  },
};

type Sale = {
  includedProducts: SubscriptionProduct[],
  activeRegions: CountryGroupId[],
  startTime: number,
  endTime: number,
  saleDetails: SaleDetails,
};

// Days are 1 based, months are 0 based
const Sales: Sale[] = [
  {
    includedProducts: ['DigitalPack'],
    activeRegions: ['GBPCountries'],
    startTime: new Date(2018, 11, 12).getTime(), // 20 Dec 2018
    endTime: new Date(2019, 0, 3).getTime(), // 3 Jan 2019
    saleDetails: {
      GBPCountries: {
        DigitalPack: {
          promoCode: 'DDPCS99X',
          intcmp: '',
          price: 8.99,
          saleCopy: {
            landingPage: {
              heading: 'Digital Pack',
              subHeading: 'Save 25% for a year',
            },
            bundle: {
              heading: 'Digital Pack',
              subHeading: '£8.99/month for a year then £11.99/month',
              description: 'The Premium App and the daily edition iPad app in one pack, plus ad-free reading on all your devices',
            },
          },
        },
      },
    },
  },
];

function sortSalesByStartTimes(a: Sale, b: Sale) {
  return a.startTime - b.startTime;
}

function getSales(product: SubscriptionProduct, countryGroupId: CountryGroupId = detect()): Sale[] {
  return Sales.filter(sale =>
    sale.includedProducts.includes(product) &&
    sale.activeRegions.includes(countryGroupId)).sort(sortSalesByStartTimes);
}

function flashSaleIsActive(product: SubscriptionProduct, countryGroupId: CountryGroupId = detect()): boolean {
  const now = Date.now();
  const sales = getSales(product, countryGroupId).filter(sale =>
    (now > sale.startTime && now < sale.endTime) ||
    getQueryParameter('flash_sale') === 'true');

  return sales.length > 0;
}

function getPromoCode(
  product: SubscriptionProduct,
  countryGroupId?: CountryGroupId = detect(),
  defaultCode: string,
): string {
  if (flashSaleIsActive(product, countryGroupId)) {
    const sale = getSales(product, countryGroupId)[0];
    return sale && sale.saleDetails[countryGroupId][product].promoCode;
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
    const sale = getSales(product, countryGroupId)[0];
    return (sale && sale.saleDetails[countryGroupId][product].intcmp) || intcmp || defaultIntcmp;
  }
  return intcmp || defaultIntcmp;
}

function getEndTime(product: SubscriptionProduct, countryGroupId: CountryGroupId) {
  const sale = getSales(product, countryGroupId)[0];
  return sale && sale.endTime;
}

function getSaleCopy(product: SubscriptionProduct, countryGroupId: CountryGroupId): SaleCopy {
  const emptyCopy = {
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
    const sale = getSales(product, countryGroupId)[0];
    return sale.saleDetails[countryGroupId][product].saleCopy;
  }
  return emptyCopy;
}

function getFormattedFlashSalePrice(product: SubscriptionProduct, countryGroupId: CountryGroupId): string {
  const sale = getSales(product, countryGroupId)[0];
  return fixDecimals(sale.saleDetails[countryGroupId][product].price);
}

export {
  flashSaleIsActive,
  getPromoCode,
  getIntcmp,
  getEndTime,
  getSaleCopy,
  getFormattedFlashSalePrice,
};
