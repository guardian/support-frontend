// @flow

// ----- Imports ----- //

import { fromCountry } from '../countryGroup';


// ----- Tests ----- //

describe('countryGroup', () => {

  describe('fromCountry', () => {

    it('retrieves countries that exist', () => {

      expect(fromCountry('GB')).toEqual('GBPCountries');
      expect(fromCountry('US')).toEqual('UnitedStates');
      expect(fromCountry('AU')).toEqual('AUDCountries');
      expect(fromCountry('FR')).toEqual('EURCountries');
      expect(fromCountry('CI')).toEqual('International');

    });

    it('returns \'null\' for a country that does not exist', () => {

      expect(fromCountry('42')).toBeNull();

    });

  });

});
