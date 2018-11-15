// @flow

// ----- Imports ----- //

import { headOption } from '../option';


// ----- Tests ----- //

describe('option', () => {

  describe('headOption', () => {

    it('retrieves the first item from an array', () => {
      expect(headOption([1, 2, 3])).toBe(1);
    });

    it('returns null when the array is empty', () => {
      expect(headOption([])).toBeNull();
    });

    it('returns null when the array contains null', () => {
      expect(headOption([null, 2, 3])).toBeNull();
    });

    it('returns empty string when the array contains empty string', () => {
      expect(headOption(['', 2, 3])).toBe('');
    });

    it('returns false when the array contains false', () => {
      expect(headOption([false, true, false])).toBe(false);
    });

  });

});
