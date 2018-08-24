// @flow

// ----- Imports ----- //

import {
  emptyInputField,
  patternIsValid,
  emailRegexPattern,
} from '../checkoutForm';


// ----- Tests ----- //

describe('checkoutForm', () => {

  describe('patternIsValid', () => {

    it('should return true for test@gu.com', () => {
      expect(patternIsValid('test@gu.com', emailRegexPattern)).toEqual(true);
    });

    it('should return false if there is a space at the end of an email address', () => {
      expect(patternIsValid('test@gu.com ', emailRegexPattern)).toEqual(false);
    });

    it('should return false if there is a space at the start of an email address', () => {
      expect(patternIsValid(' test@gu.com', emailRegexPattern)).toEqual(false);
    });

    it('should return false if there is no dot in the domain', () => {
      expect(patternIsValid('test@gu', emailRegexPattern)).toEqual(false);
    });

    it('should return true for test@gu.co.uk', () => {
      expect(patternIsValid('test@gu.co.uk', emailRegexPattern)).toEqual(true);
    });
  });

  describe('emptyInputField', () => {

    it('should return true for null', () => {
      expect(emptyInputField(null)).toEqual(true);
    });

    it('should return true for undefined', () => {
      expect(emptyInputField(undefined)).toEqual(true);
    });

    it('should return true for an empty string', () => {
      expect(emptyInputField('')).toEqual(true);
    });

    it('should return true for a string which only contains a space', () => {
      expect(emptyInputField(' ')).toEqual(true);
    });

    it('should return false for a string which contains characters other than a space', () => {
      expect(emptyInputField('Test')).toEqual(false);
    });

  });

});
