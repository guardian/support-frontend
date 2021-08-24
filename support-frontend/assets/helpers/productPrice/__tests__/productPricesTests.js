// @flow

// ----- Imports ----- //
import
{
  getProductPrice,
  // getFirstValidPrice,
  // finalPrice,
  // getCurrency,
  // getCountryGroup,
  // showPrice,
  // displayPrice,
  isNumeric,
} from 'helpers/productPrice/productPrices';


// ----- Tests ----- //

jest.mock('ophan', () => {});


describe('isNumeric', () => {
  it('should return true if a number is provided', () => {

    expect(isNumeric(null)).toEqual(false);
    expect(isNumeric(undefined)).toEqual(false);
    expect(isNumeric(0)).toEqual(true);
    expect(isNumeric(50)).toEqual(true);

  });
});

describe('getProductPrice', () => {
  const productPrices = {
    'United Kingdom': {
      Collection: {
        Weekend: {
          Monthly: {
            GBP: {
              price: 20.76, savingVsRetail: 20, currency: 'GBP', fixedTerm: false, promotions: [],
            },
          },
        },
        NoProductOptions: {
          Monthly: {
            GBP: {
              price: 11.95, savingVsRetail: 5, currency: 'GBP', fixedTerm: false, promotions: [],
            },
          },
        },
      },
      NoFulfilmentOptions: {
        NoProductOptions: {
          Monthly: {
            GBP: {
              price: 15.95, savingVsRetail: 10, currency: 'GBP', fixedTerm: false, promotions: [],
            },
          },
        },
      },
    },
  };

  it('should return product price information for a given currency', () => {
    expect(getProductPrice(productPrices, 'United Kingdom', 'Monthly', 'Collection', 'Weekend'))
      .toEqual({
        currency: 'GBP',
        fixedTerm: false,
        price: 20.76,
        promotions: [],
        savingVsRetail: 20,
      });

    expect(getProductPrice(productPrices, 'United Kingdom', 'Monthly', 'Collection'))
      .toEqual({
        currency: 'GBP',
        fixedTerm: false,
        price: 11.95,
        promotions: [],
        savingVsRetail: 5,
      });

    expect(getProductPrice(productPrices, 'United Kingdom', 'Monthly'))
      .toEqual({
        currency: 'GBP',
        fixedTerm: false,
        price: 15.95,
        promotions: [],
        savingVsRetail: 10,
      });
  });
});
