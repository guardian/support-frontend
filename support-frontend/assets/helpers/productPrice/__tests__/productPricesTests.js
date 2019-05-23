// @flow

// ----- Imports ----- //
import { hasDiscount, isNumeric } from 'helpers/productPrice/productPrices';
import { getFulfilmentOption } from 'helpers/productPrice/weeklyProductPrice';
import { Domestic, RestOfWorld } from 'helpers/productPrice/fulfilmentOptions';

// ----- Tests ----- //

jest.mock('ophan', () => {});


describe('productPrices', () => {

  describe('isNumeric', () => {
    expect(isNumeric(null)).toEqual(false);
    expect(isNumeric(undefined)).toEqual(false);
    expect(isNumeric(0)).toEqual(true);
    expect(isNumeric(50)).toEqual(true);
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

  describe('getFulfilmentOption', () => {
    it('should work out the correct fulfilment option for a country', () => {
      expect(getFulfilmentOption('GB')).toEqual(Domestic);
      expect(getFulfilmentOption('FR')).toEqual(Domestic);
      expect(getFulfilmentOption('US')).toEqual(Domestic);
      expect(getFulfilmentOption('AU')).toEqual(Domestic);
      expect(getFulfilmentOption('AE')).toEqual(RestOfWorld);
    });
  });

});
