// @flow

// ----- Imports ----- //

import { maxTwoDecimals } from '../formValidation';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { checkStateIfApplicable } from 'helpers/formValidation';
import type { ContributionType, OtherAmounts, SelectedAmounts } from 'helpers/contributions';

// ----- Tests ----- //


describe('formValidation', () => {

  describe('maxTwoDecimals', () => {

    it('should return true for an int', () => {
      expect(maxTwoDecimals('3')).toEqual(true);
    });

    it('should return true for one dp', () => {
      expect(maxTwoDecimals('3.2')).toEqual(true);
    });

    it('should return true for decimal point and no decimal places', () => {
      expect(maxTwoDecimals('3.')).toEqual(true);
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

    it('should return false for empty string', () => {
      expect(maxTwoDecimals('')).toEqual(false);
    });

    it('should return false for empty string', () => {
      expect(maxTwoDecimals('-12')).toEqual(false);
    });

  });

  describe('checkStateIfApplicable', () => {

    it('should return false if state is null', () => {
      const state = null;
      const countryGroupId = 'UnitedStates';
      expect(checkStateIfApplicable(state, countryGroupId)).toEqual(false);
    });

    it('should return true if countryGroupId is UnitedStates and state is a string', () => {
      const state = 'CA';
      const countryGroupId = 'UnitedStates';
      expect(checkStateIfApplicable(state, countryGroupId)).toEqual(true);
    });

    it('should return true if countryGroupId is Canada and state is a string', () => {
      const state = 'AL';
      const countryGroupId = 'Canada';
      expect(checkStateIfApplicable(state, countryGroupId)).toEqual(true);
    });

    it('should return true if countryGroupId is not Canada or United States regardless of the state', () => {
      let state = 'AL';
      expect(checkStateIfApplicable(state, 'GBPCountries')).toEqual(true);
      expect(checkStateIfApplicable(state, 'AUDCountries')).toEqual(true);
      expect(checkStateIfApplicable(state, 'EURCountries')).toEqual(true);
      expect(checkStateIfApplicable(state, 'International')).toEqual(true);
      expect(checkStateIfApplicable(state, 'NZDCountries')).toEqual(true);

      state = null;
      expect(checkStateIfApplicable(state, 'GBPCountries')).toEqual(true);
      expect(checkStateIfApplicable(state, 'AUDCountries')).toEqual(true);
      expect(checkStateIfApplicable(state, 'EURCountries')).toEqual(true);
      expect(checkStateIfApplicable(state, 'International')).toEqual(true);
      expect(checkStateIfApplicable(state, 'NZDCountries')).toEqual(true);
    });
  });
});
