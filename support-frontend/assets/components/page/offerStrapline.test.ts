import { preventWidow } from './offerStrapline';

describe('offerStrapLine', () => {
	describe('preventWidow function', () => {
		it('returns the same string if it has only one word', () => {
			expect(preventWidow('Discount')).toBe('Discount');
		});

		it('adds a non-breaking space between the last two words', () => {
			expect(preventWidow('Great Discount')).toBe('Great\u00A0Discount');
		});

		it('trims leading and trailing spaces', () => {
			expect(preventWidow('   Great Discount   ')).toBe('Great\u00A0Discount');
		});

		it('handles multiple words correctly', () => {
			expect(preventWidow('Another great discount coming soon')).toBe(
				'Another great discount coming\u00A0soon',
			);
		});
	});
});
