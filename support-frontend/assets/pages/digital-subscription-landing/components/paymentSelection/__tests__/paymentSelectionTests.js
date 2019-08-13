// flow

import { getProductOptions, getCurrencySymbol } from '../helpers/paymentSelection';

jest.mock('ophan', () => {}); // required to get the test to run! why?

describe.only('PaymentSelection', () => {
  let productPrices;

  beforeEach(() => {
    // create an object with all country groups
    // start with an array with all country groups
    // then create an object containing all the options
    // remove some to the options on the object
    productPrices = {
      'United Kingdom': {
        NoFulfilmentOptions: {
          NoProductOptions: {
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
          },
        },
      },
    };

  });

  it('should return the product options based on country', () => {

    const countryGroup = 'GBPCountries';
    const expected = {
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

    expect(getProductOptions(productPrices, countryGroup)).toEqual(expected);
  });

  it('should return a currency glyph for the current country', () => {

    const isoCurrency = 'GBP';
    expect(getCurrencySymbol(isoCurrency)).toEqual('£');
  });
});

