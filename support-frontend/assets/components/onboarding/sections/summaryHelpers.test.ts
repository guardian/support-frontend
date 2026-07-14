import { getTodaysPaymentWithTaxExclusion } from './summaryHelpers';

describe('getTodaysPaymentWithTaxExclusion', () => {
	it('returns undefined when taxConfig is undefined', () => {
		expect(
			getTodaysPaymentWithTaxExclusion(100, 'CAD', undefined),
		).toBeUndefined();
	});

	it('returns undefined when type is not tax_exclusive', () => {
		expect(
			getTodaysPaymentWithTaxExclusion(100, 'CAD', {
				type: 'tax_inclusive',
			}),
		).toBeUndefined();
	});

	it('formats integer amounts correctly', () => {
		expect(
			getTodaysPaymentWithTaxExclusion(100, 'CAD', {
				type: 'tax_exclusive',
				rate: 0.13,
			}),
		).toBe('$100 + $13 estimated tax');
	});

	it('formats decimal tax amounts correctly', () => {
		expect(
			getTodaysPaymentWithTaxExclusion(10, 'CAD', {
				type: 'tax_exclusive',
				rate: 0.05,
			}),
		).toBe('$10 + $0.50 estimated tax');
	});
});
