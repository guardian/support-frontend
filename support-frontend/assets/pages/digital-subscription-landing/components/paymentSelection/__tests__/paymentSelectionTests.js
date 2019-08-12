// flow

import { getProductOptions } from '../helpers/paymentSelection';

jest.mock('ophan', () => {});

describe.only('PaymentSelection', () => {
  let productPrices;

  beforeEach(() => {
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

  it('return the correct production options ', () => {

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
});

