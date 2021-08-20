// @flow

// ----- Imports ----- //
import { isNumeric } from 'helpers/productPrice/productPrices';

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
