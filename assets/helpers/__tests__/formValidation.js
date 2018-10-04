// @flow

// ----- Imports ----- //

import { maxTwoDecimals } from '../formValidation';

// ----- Tests ----- //


describe('formValidation', () => {

  describe('maxTwoDecimals', () => {

    it('should return true for an int', () => {
      expect(maxTwoDecimals('3')).toEqual(true);
    });

    it('should return true for one dp', () => {
      expect(maxTwoDecimals('3.2')).toEqual(true);
    });

    it('should return true for two dp', () => {
      expect(maxTwoDecimals('3.22')).toEqual(true);
    });

    it('should return false for three dp', () => {
      expect(maxTwoDecimals('3.222')).toEqual(false);
    });

    it('should return false for invalid number', () => {
      expect(maxTwoDecimals('3e22')).toEqual(false);
    });
  });
});
