import { getCurrencyInfo } from '@modules/internationalisation/currency';
import {
	calculateTax,
	roundTaxAmount,
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
		[getCurrencyInfo('CAD'), 15, 0.05, '$0.75'],
		[getCurrencyInfo('CAD'), 30, 0.12, '$3.60'],
		[getCurrencyInfo('CAD'), 150, 0.15, '$22.50'],
		[getCurrencyInfo('CAD'), 300, 0.14975, '$44.92'],
		[getCurrencyInfo('CAD'), 15, 0.14975, '$2.24'],
	])(
		`%s / Amount: %i / Tax Rate: %d should format as %s`,
		(currency, amount, taxRate, expected) => {
			expect(simpleFormatTaxAmount(currency, amount, taxRate)).toBe(expected);
		},
	);
});

describe('roundTaxAmount', () => {
	it('rounds down to 2 decimal places', () => {
		const taxAmount = 44.929;

		const roundedTaxAmount = roundTaxAmount(taxAmount);

		expect(roundedTaxAmount).toEqual(44.92);
	});
});

describe('calculateTax', () => {
	it('calculates tax based on a rate and an amount', () => {
		const amount = 30;
		const taxRate = 0.12;

		const taxAmount = calculateTax(amount, taxRate);

		expect(taxAmount).toEqual(3.6);
	});
});
