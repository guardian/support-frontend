// @flow

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { currencies, detect } from 'helpers/internationalisation/currency';
import type { WeeklyBillingPeriod } from 'helpers/billingPeriods';
import { Annual, Quarterly, SixForSix } from 'helpers/billingPeriods';
import { getPromotionWeeklyProductPrice, getWeeklyProductPrice } from 'helpers/subscriptions';


export const getPrice = (countryGroupId: CountryGroupId, period: WeeklyBillingPeriod) => [
  currencies[detect(countryGroupId)].extendedGlyph,
  getWeeklyProductPrice(countryGroupId, period),
].join('');

type CurrencyAndPrice = {
  price: number,
  currency: string,
}

export const getCurrencyAndPrice = (countryGroupId: CountryGroupId, period: WeeklyBillingPeriod): CurrencyAndPrice => (
  {
    currency: detect(countryGroupId),
    price: parseFloat(getWeeklyProductPrice(countryGroupId, period)),
  }
);

export const getPromotionPrice = (countryGroupId: CountryGroupId, period: WeeklyBillingPeriod, promoCode: string) => [
  currencies[detect(countryGroupId)].extendedGlyph,
  getPromotionWeeklyProductPrice(countryGroupId, period, promoCode),
].join('');

export const displayBillingPeriods = {
  [SixForSix]: {
    title: '6 for 6',
    offer: 'Introductory offer',
    copy: (countryGroupId: CountryGroupId) => `${getPrice(countryGroupId, 'SixForSix')} for the first 6 issues (then ${getPrice(countryGroupId, 'Quarterly')} quarterly)`,
  },
  [Quarterly]: {
    title: 'Quarterly',
    copy: (countryGroupId: CountryGroupId) => `${getPrice(countryGroupId, 'Quarterly')} every 3 months`,
  },
  [Annual]: {
    title: 'Annually',
    offer: 'Save 10%',
    copy: (countryGroupId: CountryGroupId) => `${getPromotionPrice(countryGroupId, 'Annual', '10ANNUAL')} for 1 year, then standard rate (${getPrice(countryGroupId, 'Annual')} every year)`,
  },
};
