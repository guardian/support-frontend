// ----- Imports ----- //
import { headOption } from '../option';
// ----- Tests ----- //
describe('option', () => {
	describe('headOption', () => {
		it('retrieves the first item from an array', () => {
			expect(headOption([1, 2, 3])).toBe(1);
			expect(headOption([null, 2, 3])).toBeNull();
			expect(headOption(['', 2, 3])).toBe('');
			expect(headOption([false, true, false])).toBe(false);
		});
		it('returns null when the array is empty', () => {
			expect(headOption([])).toBeNull();
		});
	});
});
