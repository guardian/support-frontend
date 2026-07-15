import { getCurrencyInfo } from '@modules/internationalisation/currency';
import {
	calculateAndFormatTotal,
	calculateAndRoundTax,
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
		[
			getCurrencyInfo('CAD'),
			{ originalAmount: 15, finalAmount: 15 },
			0.05,
			'$0.75',
		],
		[
			getCurrencyInfo('CAD'),
			{ originalAmount: 30, finalAmount: 30 },
			0.12,
			'$3.60',
		],
		[
			getCurrencyInfo('CAD'),
			{ originalAmount: 150, finalAmount: 150 },
			0.15,
			'$22.50',
		],
		[
			getCurrencyInfo('CAD'),
			{ originalAmount: 300, finalAmount: 300 },
			0.14975,
			'$44.93',
		],
		[
			getCurrencyInfo('CAD'),
			{ originalAmount: 15, finalAmount: 15 },
			0.14975,
			'$2.25',
		],
	])(
		`Currenct: %s / Payment: %s / Tax Rate: %d should format as %s`,
		(currency, payment, taxRate, expected) => {
			expect(simpleFormatTaxAmount(currency, payment, taxRate)).toBe(expected);
		},
	);
});

describe('calculateAndRoundTax', () => {
	it.each([
		[{ originalAmount: 30, finalAmount: 30 }, 0.12, 3.6],
		[{ originalAmount: 30, finalAmount: 15 }, 0.14975, 2.24],
		[{ originalAmount: 15, finalAmount: 15 }, 0.14975, 2.25],
		[{ originalAmount: 15, finalAmount: 12 }, 0.14975, 1.8],
		[{ originalAmount: 15, finalAmount: 7.5 }, 0.14975, 1.13],
	])(
		`Payment: %s / Tax rate: %d should return %d`,
		(payment, taxRate, expected) => {
			const taxAmount = calculateAndRoundTax(payment, taxRate);

			expect(taxAmount).toEqual(expected);
		},
	);
});

describe('calculateAndFormatTotal', () => {
	it.each([
		[
			{ type: 'tax_exclusive', rate: 0.05 } as const,
			getCurrencyInfo('CAD'),
			{ originalAmount: 15, finalAmount: 15 },
			'$15.75',
		],
		[
			{ type: 'tax_exclusive', rate: 0.12 } as const,
			getCurrencyInfo('CAD'),
			{ originalAmount: 30, finalAmount: 30 },
			'$33.60',
		],
		[
			{ type: 'tax_exclusive', rate: 0.15 } as const,
			getCurrencyInfo('CAD'),
			{ originalAmount: 150, finalAmount: 150 },
			'$172.50',
		],
		[
			{ type: 'tax_exclusive', rate: 0.14975 } as const,
			getCurrencyInfo('CAD'),
			{ originalAmount: 300, finalAmount: 300 },
			'$344.93',
		],
		[
			{ type: 'tax_exclusive', rate: 0.14975 } as const,
			getCurrencyInfo('CAD'),
			{ originalAmount: 15, finalAmount: 15 },
			'$17.25',
		],
		[
			{ type: 'tax_exclusive', rate: 0.14975 } as const,
			getCurrencyInfo('CAD'),
			{ originalAmount: 15, finalAmount: 12 },
			'$13.80',
		],
		[
			{ type: 'tax_exclusive', rate: 0.14975 } as const,
			getCurrencyInfo('CAD'),
			{ originalAmount: 15, finalAmount: 7.5 },
			'$8.63',
		],
	])(
		`%s / Currency %s / Payment: %s should return %s`,
		(taxRateConfig, currency, payment, expected) => {
			expect(calculateAndFormatTotal(taxRateConfig, currency, payment)).toBe(
				expected,
			);
		},
	);

	it('returns the total when the tax config is not_enough_information', () => {
		const taxConfig = { type: 'not_enough_information' } as const;
		const currency = getCurrencyInfo('CAD');
		const payment = { originalAmount: 15, finalAmount: 15 };

		const result = calculateAndFormatTotal(taxConfig, currency, payment);

		expect(result).toEqual('$15');
	});

	it('returns the total when the tax config is tax_inclusive', () => {
		const taxConfig = { type: 'tax_inclusive' } as const;
		const currency = getCurrencyInfo('CAD');
		const payment = { originalAmount: 15, finalAmount: 15 };

		const result = calculateAndFormatTotal(taxConfig, currency, payment);

		expect(result).toEqual('$15');
	});
});
