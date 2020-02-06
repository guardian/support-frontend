// @flow

// ----- Imports ----- //
import { isNumeric } from 'helpers/productPrice/productPrices';
import { hasDiscount } from 'helpers/productPrice/promotions';
import { getMaxSavingVsRetail } from 'helpers/productPrice/paperProductPrices';

// ----- Tests ----- //

jest.mock('ophan', () => {});


describe('productPrices', () => {

  describe('isNumeric', () => {
    expect(isNumeric(null)).toEqual(false);
    expect(isNumeric(undefined)).toEqual(false);
    expect(isNumeric(0)).toEqual(true);
    expect(isNumeric(50)).toEqual(true);
  });

  describe('getMaxSavingVsRetail', () => {
    const productPrices = {
      'United Kingdom': {
        Collection: {
          SixdayPlus: {
            Monthly: {
              GBP: {
                price: 27.36, savingVsRetail: 35, currency: 'GBP', fixedTerm: false, promotions: [],
              },
            },
          },
          SundayPlus: {
            Monthly: {
              GBP: {
                price: 22.06, savingVsRetail: 15, currency: 'GBP', fixedTerm: false, promotions: [],
              },
            },
          },
          SaturdayPlus: {
            Monthly: {
              GBP: {
                price: 21.62, savingVsRetail: 16, currency: 'GBP', fixedTerm: false, promotions: [],
              },
            },
          },
          Saturday: {
            Monthly: {
              GBP: {
                price: 10.36, savingVsRetail: 13, currency: 'GBP', fixedTerm: false, promotions: [],
              },
            },
          },
          Sixday: {
            Monthly: {
              GBP: {
                price: 41.12, savingVsRetail: 26, currency: 'GBP', fixedTerm: false, promotions: [],
              },
            },
          },
          Weekend: {
            Monthly: {
              GBP: {
                price: 20.76, savingVsRetail: 20, currency: 'GBP', fixedTerm: false, promotions: [],
              },
            },
          },
          Sunday: {
            Monthly: {
              GBP: {
                price: 10.79, savingVsRetail: 13, currency: 'GBP', fixedTerm: false, promotions: [],
              },
            },
          },
          WeekendPlus: {
            Monthly: {
              GBP: {
                price: 12.56, savingVsRetail: 26, currency: 'GBP', fixedTerm: false, promotions: [],
              },
            },
          },
          Everyday: {
            Monthly: {
              GBP: {
                price: 47.62, savingVsRetail: 29, currency: 'GBP', fixedTerm: false, promotions: [],
              },
            },
          },
          EverydayPlus: {
            Monthly: {
              GBP: {
                price: 29.20, savingVsRetail: 41, currency: 'GBP', fixedTerm: false, promotions: [],
              },
            },
          },
        },
        HomeDelivery: {
          SixdayPlus: {
            Monthly: {
              GBP: {
                price: 30.36, currency: 'GBP', fixedTerm: false, promotions: [],
              },
            },
          },
          SundayPlus: {
            Monthly: {
              GBP: {
                price: 26.39, currency: 'GBP', fixedTerm: false, promotions: [],
              },
            },
          },
          SaturdayPlus: {
            Monthly: {
              GBP: {
                price: 25.96, currency: 'GBP', fixedTerm: false, promotions: [],
              },
            },
          },
          Saturday: {
            Monthly: {
              GBP: {
                price: 14.69, currency: 'GBP', fixedTerm: false, promotions: [],
              },
            },
          },
          Sixday: {
            Monthly: {
              GBP: {
                price: 54.12, savingVsRetail: 5, currency: 'GBP', fixedTerm: false, promotions: [],
              },
            },
          },
          Weekend: {
            Monthly: {
              GBP: {
                price: 25.09, savingVsRetail: 2, currency: 'GBP', fixedTerm: false, promotions: [],
              },
            },
          },
          Sunday: {
            Monthly: {
              GBP: {
                price: 15.12, currency: 'GBP', fixedTerm: false, promotions: [],
              },
            },
          },
          WeekendPlus: {
            Monthly: {
              GBP: {
                price: 12.57, currency: 'GBP', fixedTerm: false, promotions: [],
              },
            },
          },
          Everyday: {
            Monthly: {
              GBP: {
                price: 62.79, savingVsRetail: 9, currency: 'GBP', fixedTerm: false, promotions: [],
              },
            },
          },
          EverydayPlus: {
            Monthly: {
              GBP: {
                price: 29.19, currency: 'GBP', fixedTerm: false, promotions: [],
              },
            },
          },
        },
      },
    };

    expect(getMaxSavingVsRetail(productPrices)).toEqual(29);
  });

  describe('hasDiscount', () => {

    it('should cope with all the possible values for promotion.discountPrice', () => {
      expect(hasDiscount(null)).toEqual(false);
      expect(hasDiscount(undefined)).toEqual(false);
      expect(hasDiscount({})).toEqual(false);
      expect(hasDiscount({ discountedPrice: null })).toEqual(false);
      expect(hasDiscount({ discountedPrice: 50 })).toEqual(true);
      expect(hasDiscount({ discountedPrice: 0 })).toEqual(true);

    });
  });

});
