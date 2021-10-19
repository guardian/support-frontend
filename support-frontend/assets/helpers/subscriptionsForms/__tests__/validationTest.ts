// ----- Imports ----- //
import {
	nonEmptyString,
	notNull,
	firstError,
	formError,
	validate,
	nonSillyCharacters,
} from '../validation';
// ----- Tests ----- //
describe('validation', () => {
	describe('non silly characters', () => {
		it('should return false if string contains a silly character', () => {
			expect(nonSillyCharacters('😊')).toBe(false);
			expect(nonSillyCharacters('jane✅')).toBe(false);
			expect(nonSillyCharacters('𝒢℞à©ℨ')).toBe(false);
		});
		it('should return true if string does not contain silly characters', () => {
			expect(nonSillyCharacters('joe')).toBe(true);
		});
	});
	describe('nonEmptyString', () => {
		it('should return false for an empty string', () => {
			expect(nonEmptyString('')).toBe(false);
		});
		it('should return false for a space-padded empty string', () => {
			expect(nonEmptyString('  ')).toBe(false);
		});
		it('should return true for a valid string', () => {
			expect(nonEmptyString('foo')).toBe(true);
			expect(nonEmptyString(' foo ')).toBe(true);
		});
	});
	describe('notNull', () => {
		it('should return false if the value is null', () => {
			expect(notNull(null)).toBe(false);
		});
		it('should return true if the value is not null', () => {
			expect(notNull(1)).toBe(true);
			expect(notNull('')).toBe(true);
			expect(notNull('foo')).toBe(true);
			expect(notNull(true)).toBe(true);
			expect(notNull(false)).toBe(true);
			expect(notNull(undefined)).toBe(true);
			expect(notNull({})).toBe(true);
			expect(notNull([])).toBe(true);
		});
	});
	describe('firstError', () => {
		const someErrors = [
			{
				field: 'foo',
				message: 'bar',
			},
			{
				field: 'hello',
				message: 'world',
			},
			{
				field: 'foo',
				message: 'baz',
			},
		];
		it('should return the first error from a list of errors', () => {
			expect(firstError('foo', someErrors)).toBe('bar');
		});
		it('should return null if there are no matching errors', () => {
			expect(firstError('bar', someErrors)).toBeNull();
		});
		it('should return null if there are no errors at all', () => {
			expect(firstError('foo', [])).toBeNull();
		});
	});
	describe('formError', () => {
		it('should return a FormError', () => {
			expect(formError('foo', 'bar')).toEqual({
				field: 'foo',
				message: 'bar',
			});
		});
	});
	describe('validate', () => {
		it('should return a list of validation errors', () => {
			const rules = [
				{
					rule: false,
					error: 'foo',
				},
				{
					rule: true,
					error: 'bar',
				},
				{
					rule: false,
					error: 'baz',
				},
			];
			expect(validate(rules)).toEqual(['foo', 'baz']);
		});
	});
});
