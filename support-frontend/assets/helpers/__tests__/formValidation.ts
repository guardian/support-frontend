// ----- Imports ----- //
import { checkStateIfApplicable } from "helpers/forms/formValidation";
import { amountOrOtherAmountIsValid, maxTwoDecimals } from "../forms/formValidation";
import { AUDCountries, Canada, EURCountries, GBPCountries, International, NZDCountries, UnitedStates } from "../internationalisation/countryGroup";
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
      const countryGroupId = UnitedStates;
      expect(checkStateIfApplicable(state, countryGroupId)).toEqual(false);
    });
    it('should return true if countryGroupId is UnitedStates and state is a string', () => {
      const state = 'CA';
      const countryGroupId = UnitedStates;
      expect(checkStateIfApplicable(state, countryGroupId)).toEqual(true);
    });
    it('should return true if countryGroupId is Canada and state is a string', () => {
      const state = 'AL';
      const countryGroupId = Canada;
      expect(checkStateIfApplicable(state, countryGroupId)).toEqual(true);
    });
    it('should return true if countryGroupId is AUDCountries and state is a string', () => {
      const state = 'NSW';
      const countryGroupId = AUDCountries;
      expect(checkStateIfApplicable(state, countryGroupId)).toEqual(true);
    });
    it('should return true if countryGroupId is AUDCountries and country uses AUD but is not AU, false otherwise', () => {
      const countryGroupId = AUDCountries;
      const state = 'NSW';
      window.guardian = window.guardian || {};
      window.guardian.geoip = window.guardian.geoip || {};
      window.guardian.geoip.countryCode = 'TV';
      expect(checkStateIfApplicable(state, countryGroupId)).toEqual(true);
      expect(checkStateIfApplicable(null, countryGroupId)).toEqual(true);
      expect(checkStateIfApplicable(null, countryGroupId, 'ONE_OFF')).toEqual(true);
      expect(checkStateIfApplicable(null, countryGroupId, 'ANNUAL')).toEqual(true);
      window.guardian.geoip.countryCode = 'AU';
      expect(checkStateIfApplicable(state, countryGroupId)).toEqual(true);
      expect(checkStateIfApplicable(null, countryGroupId)).toEqual(false);
      expect(checkStateIfApplicable(null, countryGroupId, 'ONE_OFF')).toEqual(true);
      window.guardian.geoip.countryCode = 'GB';
      expect(checkStateIfApplicable(state, countryGroupId)).toEqual(true);
      expect(checkStateIfApplicable(null, countryGroupId)).toEqual(false);
      expect(checkStateIfApplicable(null, countryGroupId, 'ONE_OFF')).toEqual(true);
      // This function tests for presence, it does not validate state and country
      expect(checkStateIfApplicable('NY', countryGroupId)).toEqual(true);
      expect(checkStateIfApplicable(null, countryGroupId, 'ONE_OFF')).toEqual(true);
      // Function supports no geoip
      delete window.guardian.geoip;
      expect(checkStateIfApplicable(state, countryGroupId)).toEqual(true);
      expect(checkStateIfApplicable(null, countryGroupId)).toEqual(false);
      expect(checkStateIfApplicable(null, countryGroupId, 'ONE_OFF')).toEqual(true);
    });
    it('should return true if countryGroupId is not Canada, AUDCountries or United States regardless of the state', () => {
      let state = 'AL';
      expect(checkStateIfApplicable(state, GBPCountries)).toEqual(true);
      expect(checkStateIfApplicable(state, EURCountries)).toEqual(true);
      expect(checkStateIfApplicable(state, International)).toEqual(true);
      expect(checkStateIfApplicable(state, NZDCountries)).toEqual(true);
      state = null;
      expect(checkStateIfApplicable(state, GBPCountries)).toEqual(true);
      expect(checkStateIfApplicable(state, EURCountries)).toEqual(true);
      expect(checkStateIfApplicable(state, International)).toEqual(true);
      expect(checkStateIfApplicable(state, NZDCountries)).toEqual(true);
    });
  });
  describe('amountOrOtherAmountIsValid', () => {
    const defaultSelectedAmounts = {
      ONE_OFF: 50,
      MONTHLY: 15,
      ANNUAL: 100
    };
    const selectedAmountsWithOtherSelected = {
      ONE_OFF: 'other',
      MONTHLY: 'other',
      ANNUAL: 'other'
    };
    const defaultOtherAmounts = {
      ONE_OFF: {
        amount: null
      },
      MONTHLY: {
        amount: '2'
      },
      ANNUAL: {
        amount: '0'
      }
    };
    it('should return true if selected amount is not other and amount is valid', () => {
      expect(amountOrOtherAmountIsValid(defaultSelectedAmounts, defaultOtherAmounts, 'MONTHLY', UnitedStates)).toEqual(true);
    });
    it('should return true if other is selected and amount is valid', () => {
      expect(amountOrOtherAmountIsValid(selectedAmountsWithOtherSelected, defaultOtherAmounts, 'MONTHLY', UnitedStates)).toEqual(true);
    });
    it('should return false if other is selected and amount is empty', () => {
      expect(amountOrOtherAmountIsValid(selectedAmountsWithOtherSelected, defaultOtherAmounts, 'ONE_OFF', UnitedStates)).toEqual(false);
    });
    it('should return false if other is selected and amount is invalid', () => {
      expect(amountOrOtherAmountIsValid(selectedAmountsWithOtherSelected, defaultOtherAmounts, 'ANNUAL', UnitedStates)).toEqual(false);
    });
  });
});