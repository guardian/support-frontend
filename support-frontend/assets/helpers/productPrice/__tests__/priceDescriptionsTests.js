// @flow

// ----- Imports ----- //

import { getPriceDescription } from 'helpers/productPrice/priceDescriptions';
import { Annual, Quarterly, SixWeekly } from 'helpers/billingPeriods';

jest.mock('ophan', () => {});

// ----- Tests ----- //

describe('getPriceDescription', () => {
  it('should return a price based on inputs', () => {
    const gwAnnual = {
      price: 150,
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
    expect(getPriceDescription('£', gwAnnual, Annual))
      .toEqual('£135 for 1 year, then standard rate (£150 every year)');

    const gwQuarterly = { price: 37.5, promotions: [] };
    expect(getPriceDescription('£', gwQuarterly, Quarterly))
      .toEqual('£37.50 every quarter');

    const gwQuarterlyWithPromo = {
      price: 37.5,
      promotions: [
        {
          name: '15% discount - WJWGEX9A8',
          description: '15% discount - WJWGEX9A8',
          promoCode: 'WJWGEX9A8',
          discountedPrice: 31.87,
          numberOfDiscountedPeriods: 1,
          discount: { amount: 15, durationMonths: 3 },
        },
        {
          name: 'Six For Six',
          description: 'Introductory offer',
          promoCode: '6FOR6',
          introductoryPrice: { price: 6, periodLength: 6, periodType: 'issue' },
        }],
    };
    expect(getPriceDescription('£', gwQuarterlyWithPromo, Quarterly))
      .toEqual('£31.87 for 1 quarter, then standard rate (£37.50 every quarter)');

    const gwSixWeekly = { price: 81.30, promotions: [] };
    expect(getPriceDescription('US$', gwSixWeekly, SixWeekly))
      .toEqual('US$6 for the first 6 issues (then US$81.30 every quarter)');
  });
});
