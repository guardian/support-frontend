// ----- Imports ----- //
import { notLongerThan } from '../forms/formValidation';

// ----- Tests ----- //

describe('formValidation', () => {
	describe('notLongerThan', () => {
		it('should return false if string is too long', () => {
			expect(notLongerThan('hello world', 10)).toBeFalsy();
		});
		it('should return true if string is under max length', () => {
			expect(notLongerThan('hello world', 20)).toBeTruthy();
		});
	});
});
