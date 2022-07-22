// ----- Imports ----- //

import {
	getMinContribution,
	parseContribution,
	validateContribution,
} from '../contributions';
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

describe('contributions', () => {
	describe('validateContribution', () => {
		it('should return "TooLittle" for contributions below the minimum', () => {
			expect(validateContribution(1, 'MONTHLY', GBPCountries)).toBe(
				'TooLittle',
			);
			expect(validateContribution(5, 'ANNUAL', AUDCountries)).toBe('TooLittle');
			expect(validateContribution(0.5, 'ONE_OFF', EURCountries)).toBe(
				'TooLittle',
			);
		});

		it('should return "TooMuch" for contributions above the maximum', () => {
			expect(validateContribution(2000, 'MONTHLY', UnitedStates)).toBe(
				'TooMuch',
			);
			expect(validateContribution(2030, 'ANNUAL', International)).toBe(
				'TooMuch',
			);
			expect(validateContribution(2030, 'ONE_OFF', Canada)).toBe('TooMuch');
		});

		it('should return null for contributions that are OK', () => {
			expect(validateContribution(100, 'MONTHLY', NZDCountries)).toBeNull();
			expect(validateContribution(100, 'ANNUAL', UnitedStates)).toBeNull();
			expect(validateContribution(100, 'ONE_OFF', GBPCountries)).toBeNull();
		});
	});

	describe('parseContribution', () => {
		it('should parse and format contribution strings that are valid', () => {
			expect(parseContribution('22.5')).toEqual({
				valid: true,
				amount: 22.5,
			});

			expect(parseContribution('0.4')).toEqual({
				valid: true,
				amount: 0.4,
			});

			expect(parseContribution('9.555')).toEqual({
				valid: true,
				amount: 9.56,
			});
		});

		it('should return an error for invalid contribution strings', () => {
			expect(parseContribution('a word')).toEqual({
				error: 'ParseError',
			});
		});
	});

	describe('getMinContribution', () => {
		it('should retrieve the minimum contribution', () => {
			expect(getMinContribution('ONE_OFF', GBPCountries)).toBe(1);
		});
	});
});
