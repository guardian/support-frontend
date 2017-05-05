// @flow

// ----- Imports ----- //

import { ascending, descending } from '../utilities';


// ----- Tests ----- //

describe('utilities', () => {

  describe('ascending', () => {

    it('should return a 1 if a > b', () => {
      expect(ascending(3, 2)).toEqual(1);
    });

    it('should return a 0 if a < b', () => {
      expect(ascending(2, 3)).toEqual(0);
    });

    it('should return a 1 if a === b', () => {
      expect(ascending(2, 2)).toEqual(0);
    });

    it('should sort an array in ascending order', () => {

      const unsorted = [100, 2, 2, 46.78, 54, 67, 54, 0.3, -3];
      const sorted = [-3, 0.3, 2, 2, 46.78, 54, 54, 67, 100];

      expect(unsorted.sort(ascending)).toEqual(sorted);

    });

  });

  describe('descending', () => {

    it('should return a 0 if a > b', () => {
      expect(ascending(3, 2)).toEqual(1);
    });

    it('should return a 1 if a < b', () => {
      expect(ascending(2, 3)).toEqual(0);
    });

    it('should return a 0 if a === b', () => {
      expect(ascending(2, 2)).toEqual(0);
    });

    it('should sort an array in descending order', () => {

      const unsorted = [100, 2, 2, 46.78, 54, 67, 54, 0.3, -3];
      const sorted = [100, 67, 54, 54, 46.78, 2, 2, 0.3, -3];

      expect(unsorted.sort(descending)).toEqual(sorted);

    });

  });

});
