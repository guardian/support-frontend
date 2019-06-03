// @flow

// ----- Imports ----- //
import {
  getFulfilmentOption,
  getPromotionPrice,
} from '../weeklyProductPrice';
import { regularPrice } from 'helpers/productPrice/productPrices';
import { Annual, Quarterly, SixWeekly } from 'helpers/billingPeriods';
import { Domestic, RestOfWorld } from 'helpers/productPrice/fulfilmentOptions';

jest.mock('ophan', () => {});

// ----- Tests ----- //

const productPrices = {
  'United Kingdom': {
    RestOfWorld: {
      NoProductOptions: {
        Quarterly: { GBP: { price: 60 } },
        SixWeekly: { GBP: { price: 6 } },
        Annual: { GBP: { price: 240 } },
      },
    },
    Domestic: {
      NoProductOptions: {
        SixWeekly: { GBP: { price: 6 } },
        Quarterly: { GBP: { price: 37.5 } },
        Annual: { GBP: { price: 150 } },
      },
    },
  },
  Europe: {
    RestOfWorld: {
      NoProductOptions: {
        Quarterly: { EUR: { price: 67.5 } },
        Annual: { EUR: { price: 270 } },
      },
    },
    Domestic: {
      NoProductOptions: {
        SixWeekly: { EUR: { price: 6 } },
        Quarterly: { EUR: { price: 61.3 } },
        Annual: { EUR: { price: 245.2 } },
      },
    },
  },
  'New Zealand': {
    RestOfWorld: {
      NoProductOptions: {
        Quarterly: { NZD: { price: 132.5 } },
        Annual: { NZD: { price: 530 } },
      },
    },
    Domestic: {
      NoProductOptions: {
        SixWeekly: { NZD: { price: 6 } },
        Quarterly: { NZD: { price: 123 } },
        Annual: { NZD: { price: 492 } },
      },
    },
  },
  Canada: {
    RestOfWorld: {
      NoProductOptions: {
        Quarterly: { CAD: { price: 86.25 } },
        Annual: { CAD: { price: 345 } },
      },
    },
    Domestic: {
      NoProductOptions: {
        SixWeekly: { CAD: { price: 6 } },
        Quarterly: { CAD: { price: 80 } },
        Annual: { CAD: { price: 320 } },
      },
    },
  },
  Australia: {
    RestOfWorld: {
      NoProductOptions: {
        Quarterly: { AUD: { price: 106 } },
        Annual: { AUD: { price: 424 } },
      },
    },
    Domestic: {
      NoProductOptions: {
        SixWeekly: { AUD: { price: 6 } },
        Quarterly: { AUD: { price: 97.5 } },
        Annual: { AUD: { price: 390 } },
      },
    },
  },
  International: {
    RestOfWorld: {
      NoProductOptions: {
        Quarterly: {
          GBP: { price: 60 },
          USD: { price: 81.3 },
        },
        SixWeekly: { GBP: { price: 6 }, USD: { price: 6 } },
        Annual: { GBP: { price: 240 }, USD: { price: 325.2 } },
      },
    },
    Domestic: {
      NoProductOptions: {
        SixWeekly: {
          GBP: { price: 6 },
          USD: { price: 6 },
        },
        Quarterly: { GBP: { price: 37.5 }, USD: { price: 75 } },
        Annual: { GBP: { price: 150 }, USD: { price: 300 } },
      },
    },
  },
  'United States': {
    RestOfWorld: {
      NoProductOptions: {
        Quarterly: { USD: { price: 81.3 } },
        SixWeekly: { USD: { price: 6 } },
        Annual: { USD: { price: 325.2 } },
      },
    },
    Domestic: {
      NoProductOptions: {
        SixWeekly: { USD: { price: 6 } },
        Quarterly: { USD: { price: 75 } },
        Annual: { USD: { price: 300 } },
      },
    },
  },
};

describe('getPrice', () => {
  it('should return a price based on inputs', () => {
    const euroPriceQuarterly = regularPrice(productPrices, 'FR', Quarterly, Domestic);
    expect(euroPriceQuarterly).toEqual({ currency: 'EUR', price: 61.30 });

    const audPriceSixForSix = regularPrice(productPrices, 'AU', SixWeekly, Domestic);
    expect(audPriceSixForSix).toEqual({ currency: 'AUD', price: 6 });

    const gbpPriceAnnual = regularPrice(productPrices, 'GB', Annual, Domestic);
    expect(gbpPriceAnnual).toEqual({ currency: 'GBP', price: 150 });

    const intPriceAnnual = regularPrice(productPrices, 'CG', Annual, RestOfWorld);
    expect(intPriceAnnual).toEqual({ currency: 'USD', price: 325.20 });
  });
});

describe('getFulfilmentOption', () => {
  it('should work out the correct fulfilment option for a country', () => {
    expect(getFulfilmentOption('GB')).toEqual(Domestic);
    expect(getFulfilmentOption('FR')).toEqual(Domestic);
    expect(getFulfilmentOption('US')).toEqual(Domestic);
    expect(getFulfilmentOption('AU')).toEqual(Domestic);
    expect(getFulfilmentOption('AE')).toEqual(RestOfWorld);
  });
});


describe('getPromotionPrice', () => {
  it('should return a price based on inputs including a promotion', () => {
    const usdPriceAnnualWithPromo = getPromotionPrice(
      'US', 'Annual',
      '10ANNUAL',
    );
    expect(usdPriceAnnualWithPromo).toEqual('US$270');

    const gbpPriceAnnualWithPromo = getPromotionPrice(
      'GB', 'Annual',
      '10ANNUAL',
    );
    expect(gbpPriceAnnualWithPromo).toEqual('£135');
  });
});
