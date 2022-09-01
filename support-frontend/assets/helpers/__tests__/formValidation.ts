// ----- Imports ----- //
import {
	amountOrOtherAmountIsValid,
	checkStateIfApplicable,
	maxTwoDecimals,
	notLongerThan,
} from '../forms/formValidation';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from '../internationalisation/countryGroup';

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
		const contributionType = 'MONTHLY';

		it('should return false if state is null', () => {
			const state = null;
			const countryGroupId = UnitedStates;
			expect(
				checkStateIfApplicable(state, countryGroupId, contributionType),
			).toEqual(false);
		});
		it('should return true if countryGroupId is UnitedStates and state is a string', () => {
			const state = 'CA';
			const countryGroupId = UnitedStates;
			expect(
				checkStateIfApplicable(state, countryGroupId, contributionType),
			).toEqual(true);
		});
		it('should return true if countryGroupId is Canada and state is a string', () => {
			const state = 'AL';
			const countryGroupId = Canada;
			expect(
				checkStateIfApplicable(state, countryGroupId, contributionType),
			).toEqual(true);
		});
		it('should return true if countryGroupId is AUDCountries and state is a string', () => {
			const state = 'NSW';
			const countryGroupId = AUDCountries;
			expect(
				checkStateIfApplicable(state, countryGroupId, contributionType),
			).toEqual(true);
		});
		it('should return true if countryGroupId is AUDCountries and country uses AUD but is not AU, false otherwise', () => {
			const countryGroupId = AUDCountries;
			const state = 'NSW';
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- disable for test
			window.guardian = window.guardian || {};
			window.guardian.geoip = window.guardian.geoip ?? { countryCode: 'TV' };
			window.guardian.geoip.countryCode = 'TV';
			expect(
				checkStateIfApplicable(state, countryGroupId, contributionType),
			).toEqual(true);
			expect(
				checkStateIfApplicable(null, countryGroupId, contributionType),
			).toEqual(true);
			expect(checkStateIfApplicable(null, countryGroupId, 'ONE_OFF')).toEqual(
				true,
			);
			expect(checkStateIfApplicable(null, countryGroupId, 'ANNUAL')).toEqual(
				true,
			);
			window.guardian.geoip.countryCode = 'AU';
			expect(
				checkStateIfApplicable(state, countryGroupId, contributionType),
			).toEqual(true);
			expect(
				checkStateIfApplicable(null, countryGroupId, contributionType),
			).toEqual(false);
			expect(checkStateIfApplicable(null, countryGroupId, 'ONE_OFF')).toEqual(
				true,
			);
			window.guardian.geoip.countryCode = 'GB';
			expect(
				checkStateIfApplicable(state, countryGroupId, contributionType),
			).toEqual(true);
			expect(
				checkStateIfApplicable(null, countryGroupId, contributionType),
			).toEqual(false);
			expect(checkStateIfApplicable(null, countryGroupId, 'ONE_OFF')).toEqual(
				true,
			);
			// This function tests for presence, it does not validate state and country
			expect(
				checkStateIfApplicable('NY', countryGroupId, contributionType),
			).toEqual(true);
			expect(checkStateIfApplicable(null, countryGroupId, 'ONE_OFF')).toEqual(
				true,
			);
			// Function supports no geoip
			delete window.guardian.geoip;
			expect(
				checkStateIfApplicable(state, countryGroupId, contributionType),
			).toEqual(true);
			expect(
				checkStateIfApplicable(null, countryGroupId, contributionType),
			).toEqual(false);
			expect(checkStateIfApplicable(null, countryGroupId, 'ONE_OFF')).toEqual(
				true,
			);
		});
		it('should return true if countryGroupId is not Canada, AUDCountries or United States regardless of the state', () => {
			let state: string | null = 'AL';
			expect(
				checkStateIfApplicable(state, GBPCountries, contributionType),
			).toEqual(true);
			expect(
				checkStateIfApplicable(state, EURCountries, contributionType),
			).toEqual(true);
			expect(
				checkStateIfApplicable(state, International, contributionType),
			).toEqual(true);
			expect(
				checkStateIfApplicable(state, NZDCountries, contributionType),
			).toEqual(true);
			state = null;
			expect(
				checkStateIfApplicable(state, GBPCountries, contributionType),
			).toEqual(true);
			expect(
				checkStateIfApplicable(state, EURCountries, contributionType),
			).toEqual(true);
			expect(
				checkStateIfApplicable(state, International, contributionType),
			).toEqual(true);
			expect(
				checkStateIfApplicable(state, NZDCountries, contributionType),
			).toEqual(true);
		});
	});
	describe('amountOrOtherAmountIsValid', () => {
		const defaultSelectedAmounts = {
			ONE_OFF: 50,
			MONTHLY: 15,
			ANNUAL: 100,
		};
		const selectedAmountsWithOtherSelected = {
			ONE_OFF: 'other',
			MONTHLY: 'other',
			ANNUAL: 'other',
		} as const;
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
			expect(
				amountOrOtherAmountIsValid(
					defaultSelectedAmounts,
					defaultOtherAmounts,
					'MONTHLY',
					UnitedStates,
				),
			).toEqual(true);
		});
		it('should return true if other is selected and amount is valid', () => {
			expect(
				amountOrOtherAmountIsValid(
					selectedAmountsWithOtherSelected,
					defaultOtherAmounts,
					'MONTHLY',
					UnitedStates,
				),
			).toEqual(true);
		});
		it('should return false if other is selected and amount is empty', () => {
			expect(
				amountOrOtherAmountIsValid(
					selectedAmountsWithOtherSelected,
					defaultOtherAmounts,
					'ONE_OFF',
					UnitedStates,
				),
			).toEqual(false);
		});
		it('should return false if other is selected and amount is invalid', () => {
			expect(
				amountOrOtherAmountIsValid(
					selectedAmountsWithOtherSelected,
					defaultOtherAmounts,
					'ANNUAL',
					UnitedStates,
				),
			).toEqual(false);
		});
	});
	describe('notLongerThan', () => {
		it('should return false if string is too long', () => {
			expect(notLongerThan('hello world', 10)).toBeFalsy();
		});
		it('should return true if string is under max length', () => {
			expect(notLongerThan('hello world', 20)).toBeTruthy();
		});
	});
});
