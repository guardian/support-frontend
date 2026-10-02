import { getTodaysPaymentWithTaxExclusion } from './summaryHelpers';

describe('getTodaysPaymentWithTaxExclusion', () => {
	it('returns undefined when taxConfig is undefined', () => {
		expect(
			getTodaysPaymentWithTaxExclusion(
				{ originalAmount: 100, finalAmount: 100 },
				'CAD',
				undefined,
			),
		).toBeUndefined();
	});

	it('returns undefined when type is not tax_exclusive', () => {
		expect(
			getTodaysPaymentWithTaxExclusion(
				{ originalAmount: 100, finalAmount: 100 },
				'CAD',
				{
					type: 'tax_inclusive',
				},
			),
		).toBeUndefined();
	});

	it('formats integer amounts correctly', () => {
		expect(
			getTodaysPaymentWithTaxExclusion(
				{ originalAmount: 100, finalAmount: 100 },
				'CAD',
				{
					type: 'tax_exclusive',
					rate: 0.13,
				},
			),
		).toBe('$100 + $13 estimated tax');
	});

	it('formats decimal tax amounts correctly', () => {
		expect(
			getTodaysPaymentWithTaxExclusion(
				{ originalAmount: 10, finalAmount: 10 },
				'CAD',
				{
					type: 'tax_exclusive',
					rate: 0.05,
				},
			),
		).toBe('$10 + $0.50 estimated tax');
	});

	it('handles discounts correctly', () => {
		expect(
			getTodaysPaymentWithTaxExclusion(
				{ originalAmount: 15, finalAmount: 12 },
				'CAD',
				{
					type: 'tax_exclusive',
					rate: 0.14975,
				},
			),
		).toBe('$12 + $1.80 estimated tax');
	});
});
