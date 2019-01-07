// @flow

// ----- Imports ----- //
import { getCountry } from '../user';

// ----- Tests ----- //

describe('user', () => {

  describe('getCountry', () => {

    it('returns the isoCountry via the value from identity, if it exists', () => {
      global.guardian = { user: { country: 'United Kingdom' } };
      expect(getCountry('GBPCountries')).toBe('GB');

      global.guardian = { user: { country: 'France' } };
      expect(getCountry('EURCountries')).toBe('FR');
    });

    it('returns the isoCountry via the country group id if there is no value from identity', () => {
      global.guardian = { user: { country: '' } };
      expect(getCountry('GBPCountries')).toBe('GB');
      expect(getCountry('EURCountries')).toBe('DE');
    });

  });

});
