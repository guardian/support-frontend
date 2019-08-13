// flow

import { getProductOptions, getCurrencySymbol, getDisplayPrice } from '../helpers/paymentSelection';

jest.mock('ophan', () => {}); // required to get the test to run! why?

describe.only('PaymentSelection', () => {
  let productPrices;
  let productOptions;

  beforeEach(() => {
    // create an object with all country groups
    // start with an array with all country groups
    // then create an object containing all the options
    // remove some to the options on the object
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
          price: 17.99,
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

});

