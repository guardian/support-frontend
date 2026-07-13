import { getCurrencyInfo } from '@modules/internationalisation/currency';
import {
	calculateAndFormatTotal,
	calculateTax,
	simpleFormatAmount,
	simpleFormatTaxAmount,
} from '../forms/checkouts';

describe('simpleFormatAmount', () => {
	it.each([
		[getCurrencyInfo('GBP'), 12, '£12'],
		[getCurrencyInfo('NZD'), 12.5, '$12.50'],
		[getCurrencyInfo('CAD'), 12.0005, '$12'],
		[getCurrencyInfo('CAD'), 12.015, '$12.02'],
	])(`%s/%i should format as %s`, (currency, amount, expected) => {
		expect(simpleFormatAmount(currency, amount)).toBe(expected);
	});
});

describe('simpleFormatTaxAmount', () => {
	it.each([
		[getCurrencyInfo('CAD'), 15, 15, 0.05, '$0.75'],
		[getCurrencyInfo('CAD'), 30, 30, 0.12, '$3.60'],
		[getCurrencyInfo('CAD'), 150, 150, 0.15, '$22.50'],
		[getCurrencyInfo('CAD'), 300, 300, 0.14975, '$44.93'],
		[getCurrencyInfo('CAD'), 15, 15, 0.14975, '$2.25'],
	])(
		`%s / Amount: %i / Tax Rate: %d should format as %s`,
		(currency, originalAmount, finalAmount, taxRate, expected) => {
			expect(
				simpleFormatTaxAmount(currency, originalAmount, finalAmount, taxRate),
			).toBe(expected);
		},
	);
});

describe('calculateTax', () => {
	it('calculates tax based on a rate and an amount', () => {
		const originalAmount = 30;
		const finalAmount = 30;
		const taxRate = 0.12;

		const taxAmount = calculateTax(originalAmount, finalAmount, taxRate);

		expect(taxAmount).toEqual(3.6);
	});

	it('calculates tax when there is a discount', () => {
		const originalAmount = 15;
		const finalAmount = 12;
		const taxRate = 0.14975;

		const taxAmount = calculateTax(originalAmount, finalAmount, taxRate);

		expect(taxAmount).toEqual(1.8);
	});

	it('calculates tax when there is a different discount', () => {
		const originalAmount = 15;
		const finalAmount = 7.5;
		const taxRate = 0.14975;

		const taxAmount = calculateTax(originalAmount, finalAmount, taxRate);

		expect(taxAmount).toEqual(1.13);
	});
});

describe('calculateAndFormatTotal', () => {
	it.each([
		[
			{ type: 'tax_exclusive', rate: 0.05 } as const,
			getCurrencyInfo('CAD'),
			15,
			15,
			'$15.75',
		],
		[
			{ type: 'tax_exclusive', rate: 0.12 } as const,
			getCurrencyInfo('CAD'),
			30,
			30,
			'$33.60',
		],
		[
			{ type: 'tax_exclusive', rate: 0.15 } as const,
			getCurrencyInfo('CAD'),
			150,
			150,
			'$172.50',
		],
		[
			{ type: 'tax_exclusive', rate: 0.14975 } as const,
			getCurrencyInfo('CAD'),
			300,
			300,
			'$344.93',
		],
		[
			{ type: 'tax_exclusive', rate: 0.14975 } as const,
			getCurrencyInfo('CAD'),
			15,
			15,
			'$17.25',
		],
		[
			{ type: 'tax_exclusive', rate: 0.14975 } as const,
			getCurrencyInfo('CAD'),
			12, // This has a discount applied
			15, // This is the full amount
			'$13.80',
		],
		[
			{ type: 'tax_exclusive', rate: 0.14975 } as const,
			getCurrencyInfo('CAD'),
			7.5, // This has a discount applied
			15, // This is the full amount
			'$8.63',
		],
	])(
		`%s / Amount: %i / Tax Rate: %d should return %s`,
		(taxRateConfig, currency, originalAmount, finalAmount, expected) => {
			expect(
				calculateAndFormatTotal(
					taxRateConfig,
					currency,
					originalAmount,
					finalAmount,
				),
			).toBe(expected);
		},
	);

	it('returns the total when the tax config is not_enough_information', () => {
		const taxConfig = { type: 'not_enough_information' } as const;
		const currency = getCurrencyInfo('CAD');
		const amount = 15;

		const result = calculateAndFormatTotal(taxConfig, currency, amount, amount);

		expect(result).toEqual('$15');
	});

	it('returns the total when the tax config is tax_inclusive', () => {
		const taxConfig = { type: 'tax_inclusive' } as const;
		const currency = getCurrencyInfo('CAD');
		const amount = 15;

		const result = calculateAndFormatTotal(taxConfig, currency, amount, amount);

		expect(result).toEqual('$15');
	});
});
