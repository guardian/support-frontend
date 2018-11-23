// @flow

// ----- Imports ----- //

import { checkAmountOrOtherAmount, maxTwoDecimals } from '../formValidation';
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

  describe('checkAmountOrOtherAmount', () => {

    const defaultSelectedAmounts =  {
      ONE_OFF: {
        value: '50',
        spoken: 'fifty',
        isDefault: true,
      },
      MONTHLY: {
        value: '15',
        spoken: 'fifteen',
        isDefault: true,
      },
      ANNUAL: {
        value: '100',
        spoken: 'one hundred',
        isDefault: true,
      },
    };

    const selectedAmountsWithOtherSelected = {
      ONE_OFF: 'other',
      MONTHLY: 'other',
      ANNUAL: 'other',
    };

    const defaultOtherAmounts = {
      ONE_OFF: {
        amount: null,
      },
      MONTHLY: {
        amount: '2',
      },
      ANNUAL: {
        amount: '0',
      },
    };


    it('should return true if selected amount is not other and amount is valid', () => {
      expect(checkAmountOrOtherAmount(defaultSelectedAmounts, defaultOtherAmounts, 'MONTHLY', 'UnitedStates')).toEqual(true);
    });

    it('should return true if other is selected and amount is valid', () => {
      expect(checkAmountOrOtherAmount(selectedAmountsWithOtherSelected, defaultOtherAmounts, 'MONTHLY', 'UnitedStates')).toEqual(true);
    });

    it('should return false if other is selected and amount is empty', () => {
      expect(checkAmountOrOtherAmount(selectedAmountsWithOtherSelected, defaultOtherAmounts, 'ONE_OFF', 'UnitedStates')).toEqual(false);
    });

    it('should return false if other is selected and amount is invalid', () => {
      expect(checkAmountOrOtherAmount(selectedAmountsWithOtherSelected, defaultOtherAmounts, 'ANNUAL', 'UnitedStates')).toEqual(false);
    });
  });
});
