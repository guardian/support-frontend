// ----- Imports ----- //
import {
	amountOrOtherAmountIsValid,
	isNotTooFarInTheFuture,
	maxTwoDecimals,
	notLongerThan,
} from '../forms/formValidation';
import { UnitedStates } from '../internationalisation/countryGroup';

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

	describe('isNotTooFarInFuture', () => {
		it('returns true if the date is less than 89 days from now', () => {
			const now = new Date(2024, 0, 1); // 1st Jan 2024
			const oneDayFromNow = new Date(2024, 0, 2); // 2nd Jan 2024

			expect(isNotTooFarInTheFuture(oneDayFromNow, now)).toEqual(true);
		});

		it('returns true if the date is exactly 89 days from now', () => {
			const now = new Date(2024, 0, 1); // 1st Jan 2024
			const eightyNineDaysFromNow = new Date(2024, 2, 30); // 30th Mar 2024

			expect(isNotTooFarInTheFuture(eightyNineDaysFromNow, now)).toEqual(true);
		});

		it('returns true if the date is exactly 89 days from now, even at a later time in the day', () => {
			const now = new Date(2024, 0, 1, 0, 0, 0); // 1st Jan 2024
			const eightyNineDaysFromNow = new Date(2024, 2, 30, 1, 0, 0); // 30th Mar 2024

			expect(isNotTooFarInTheFuture(eightyNineDaysFromNow, now)).toEqual(true);
		});

		it('returns false if the date is 1 day more than 89 days from now', () => {
			const now = new Date(2024, 0, 1); // 1st Jan 2024
			const ninetyDaysFromNow = new Date(2024, 2, 31); // 31st Mar 2024

			expect(isNotTooFarInTheFuture(ninetyDaysFromNow, now)).toEqual(false);
		});

		it('returns false if the date is many days more than 89 days from now', () => {
			const now = new Date(2024, 0, 1); // 1st Jan 2024
			const manyDaysFromNow = new Date(2024, 12, 1); // 1st Dec 2024

			expect(isNotTooFarInTheFuture(manyDaysFromNow, now)).toEqual(false);
		});
	});
});
