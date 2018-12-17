// @flow

// ----- Imports ----- //
import { getCountry } from '../user';

// ----- Tests ----- //

describe('user', () => {

  describe('getCountry', () => {

    it('returns the isoCountry via the value from identity, if it exists', () => {
      expect(getCountry('United Kingdom', 'GBPCountries')).toBe('GB');
      expect(getCountry('France', 'EURCountries')).toBe('FR');
      expect(getCountry('United Kingdom', 'UnitedStates')).toBe('GB');
    });

    it('returns the isoCountry via the country group id if there is no value from identity', () => {
      expect(getCountry(null, 'GBPCountries')).toBe('GB');
      expect(getCountry(null, 'EURCountries')).toBe('DE');
    });

  });

});
