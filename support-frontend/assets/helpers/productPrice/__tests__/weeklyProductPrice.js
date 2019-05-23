// @flow

// ----- Imports ----- //
import {
  getPrice, getCurrencyAndPrice, getPromotionPrice, displayBillingPeriods,
} from '../weeklyProductPrice';

jest.mock('ophan', () => {});

// ----- Tests ----- //


describe('getPrice', () => {
  it('should return a price based on inputs', () => {
    const euroPriceQuarterly = getPrice('EURCountries', 'Quarterly');
    expect(euroPriceQuarterly).toEqual('€61.30');

    const audPriceSixForSix = getPrice('AUDCountries', 'SixForSix');
    expect(audPriceSixForSix).toEqual('AU$6');

    const gbpPriceAnnual = getPrice('GBPCountries', 'Annual');
    expect(gbpPriceAnnual).toEqual('£150');

    const intPriceAnnual = getPrice('International', 'Annual');
    expect(intPriceAnnual).toEqual('US$325.20');

  });
});

describe('getCurrencyAndPrice', () => {
  it('should return a price based on inputs', () => {
    const euroPriceQuarterly = getCurrencyAndPrice('EURCountries', 'Quarterly');
    expect(euroPriceQuarterly).toEqual({ currency: 'EUR', price: 61.30 });

    const gbpPriceAnnual = getCurrencyAndPrice('GBPCountries', 'Annual');
    expect(gbpPriceAnnual).toEqual({ currency: 'GBP', price: 150 });

  });
});

describe('getpromotionPrice', () => {
  it('should return a price based on inputs including a promotion', () => {
    const usdPriceAnnualWithPromo = getPromotionPrice('UnitedStates', 'Annual', '10ANNUAL');
    expect(usdPriceAnnualWithPromo).toEqual('US$270');

    const gbpPriceAnnualWithPromo = getPromotionPrice('GBPCountries', 'Annual', '10ANNUAL');
    expect(gbpPriceAnnualWithPromo).toEqual('£135');
  });
});

describe('displayBillingPeriods', () => {
  it('should return a phrase about the price based on the location and product', () => {
    const annualCopyObject = displayBillingPeriods.Annual;
    expect(typeof annualCopyObject).toEqual('object');
    expect(annualCopyObject).toHaveProperty('title');
    expect(annualCopyObject).toHaveProperty('offer');

    const phraseUSA = annualCopyObject.copy('UnitedStates');
    expect(phraseUSA).toBe('US$270 for 1 year, then standard rate (US$300 every year)');

    const phraseUK = annualCopyObject.copy('GBPCountries');
    expect(phraseUK).toBe('£135 for 1 year, then standard rate (£150 every year)');
  });
});
