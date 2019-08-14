// flow

import {
  getProductOptions,
  getCurrencySymbol,
  getDisplayPrice,
  getProductPrice,
  getSavingPercentage,
  mapStateToProps,
} from '../helpers/paymentSelection';

jest.mock('ophan', () => {}); // required to get the test to run! why?

const functionReplacer = (k, v) => {
  if (typeof v === 'function') { return 'function'; } return v;
};

describe('PaymentSelection', () => {
  let productPrices;
  let productOptions;
  let state;

  beforeEach(() => {

    productOptions = {
      Monthly: {
        GBP: {
          price: 17.99,
          currency: {
            glyph: '£',
            extendedGlyph: '£',
          },
          promotions: [],
        },
      },
      Annual: {
        GBP: {
          price: 109.99,
          currency: {
            glyph: '£',
            extendedGlyph: '£',
          },
          promotions: [],
        },
      },
    };

    productPrices = {
      'United Kingdom': {
        NoFulfilmentOptions: {
          NoProductOptions: productOptions,
        },
      },
    };

    state = {
      page: { productPrices },
      common: {
        internationalisation: {
          countryGroupId: 'GBPCountries',
          currencyId: 'GBP',
        },
      },
    };

  });

  it('should return the product options based on country', () => {

    const countryGroup = 'GBPCountries';
    const expected = productOptions;

    expect(getProductOptions(productPrices, countryGroup)).toEqual(expected);
  });

  it('should return a currency glyph for the current country', () => {

    const isoCurrency = 'GBP';
    expect(getCurrencySymbol(isoCurrency)).toEqual('£');
  });

  it('should return the display price which includes the currency symbol and the price to two decimal places', () => {

    const isoCurrency = 'GBP';
    const price = 12.9899999999;
    expect(getDisplayPrice(isoCurrency, price)).toEqual('£12.99');
  });

  it('should get the product price from the product options for a billing period', () => {
    const BillingPeriod = 'Monthly';
    const currencyId = 'GBP';

    expect(getProductPrice(productOptions, BillingPeriod, currencyId)).toBe(17.99);
  });

  it('should return saving percentage', () => {
    const annualCost = 100;
    const monthlyCostAnnualized = 150;

    expect(getSavingPercentage(annualCost, monthlyCostAnnualized)).toBe('33%');
  });

  describe('mapStateToProps', () => {
    it('should return a payment options object for mapStateToProps', () => {

      const anonymous = () => {};

      const expected = {
        paymentOptions: [
          {
            title: 'Monthly',
            singlePeriod: 'month',
            price: '£17.99',
            href: 'http://localhost/subscribe/digital/checkout?promoCode=DXX83X',
            onClick: anonymous,
            salesCopy: {
              control: () => {},
              variantA: () => {},
            },
            offer: '49%',
          },
          {
            href: 'http://localhost/subscribe/digital/checkout?promoCode=DXX83X&period=Annual',
            offer: '49%',
            onClick: anonymous,
            price: '£109.99',
            salesCopy: {
              control: () => {},
              variantA: () => {},
            },
            singlePeriod: 'year',
            title: 'Annual',
          },
        ],
      };

      const result = mapStateToProps(state);

      // JSON.stringify is used to fix the problem of comparing deep equality in the object
      expect(JSON.stringify(result.paymentOptions[0], functionReplacer))
        .toEqual(JSON.stringify(expected.paymentOptions[0], functionReplacer));
    });

  });


});

