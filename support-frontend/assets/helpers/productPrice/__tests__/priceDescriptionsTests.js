// @flow

// ----- Imports ----- //

import { getPriceDescription } from 'helpers/productPrice/priceDescriptions';
import { Annual, Monthly, Quarterly, SixWeekly } from 'helpers/productPrice/billingPeriods';

jest.mock('ophan', () => {});

// ----- Tests ----- //

describe('getPriceDescription', () => {
  it('should return a price based on inputs', () => {
    const gwAnnual = {
      price: 150,
      currency: 'GBP',
      promotions: [
        {
          name: '10% Off Annual Guardian Weekly Subs',
          description: 'Subscribe for 12 months and save 10%',
          promoCode: '10ANNUAL',
          discountedPrice: 135,
          numberOfDiscountedPeriods: 1,
          discount: { amount: 10, durationMonths: 12 },
        }],
    };
    expect(getPriceDescription(gwAnnual, Annual))
      .toEqual('You\'ll pay £135 for 1 year, then £150 per year');

    const gwQuarterly = { price: 37.5, currency: 'GBP', promotions: [] };
    expect(getPriceDescription(gwQuarterly, Quarterly))
      .toEqual('£37.50 per quarter');

    const gwMonthly = { price: 12.5, currency: 'GBP', promotions: [] };
    expect(getPriceDescription(gwMonthly, Monthly))
      .toEqual('£12.50 per month');

    const gwQuarterlyWithPromo = {
      price: 37.5,
      currency: 'GBP',
      promotions: [
        {
          name: '15% discount - WJWGEX9A8',
          description: '15% discount - WJWGEX9A8',
          promoCode: 'WJWGEX9A8',
          discountedPrice: 31.87,
          numberOfDiscountedPeriods: 1,
          discount: { amount: 15, durationMonths: 3 },
        }],
    };
    expect(getPriceDescription(gwQuarterlyWithPromo, Quarterly))
      .toEqual('You\'ll pay £31.87 for 1 quarter, then £37.50 per quarter');

    const gwSixWeekly = {
      price: 27.50,
      currency: 'USD',
      promotions: [
        {
          name: 'Six For Six',
          description: 'Introductory offer',
          promoCode: '6FOR6',
          introductoryPrice: { price: 6, periodLength: 6, periodType: 'issue' },
        }],
    };
    expect(getPriceDescription(gwSixWeekly, SixWeekly))
      .toEqual('US$6 for the first 6 issues (then US$27.50 per month)');
  });
});
