import { postcodeIsWithinM25 } from '../forms/deliveryCheck';

const M25_PREFIXES = ['N1', 'EC1A', 'SW1A', 'SE2', 'W1'];

jest.mock('helpers/globalsAndSwitches/globals', () => ({
	__esModule: true,
	getGlobal: jest.fn().mockReturnValue(M25_PREFIXES),
}));

describe('Delivery Check', () => {
	describe('postcodeIsWithinM25', () => {
		it('should return true for postcodes within the M25', () => {
			expect(postcodeIsWithinM25('N1 2AB')).toBe(true);
			expect(postcodeIsWithinM25('EC1A 1BB')).toBe(true);
			expect(postcodeIsWithinM25('SW1A 2AA')).toBe(true);
			expect(postcodeIsWithinM25('SE2 7QE')).toBe(true);
			expect(postcodeIsWithinM25('W1 3PQ')).toBe(true);
		});

		it('should return false for postcodes outside the M25', () => {
			expect(postcodeIsWithinM25('MK1 1AA')).toBe(false);
			expect(postcodeIsWithinM25('OX1 1AA')).toBe(false);
			expect(postcodeIsWithinM25('DA19 2HL')).toBe(false);
		});

		it('should be case-insensitive', () => {
			expect(postcodeIsWithinM25('n1 2ab')).toBe(true);
			expect(postcodeIsWithinM25('sw1a 2aa')).toBe(true);
			expect(postcodeIsWithinM25('mk1 1aa')).toBe(false);
		});

		it('should return false for an empty string', () => {
			expect(postcodeIsWithinM25('')).toBe(false);
		});

		it('should return false for a postcode with no space separator', () => {
			expect(postcodeIsWithinM25('N12AB')).toBe(false);
		});
	});
});
