import { getCurrencyInfo } from '@modules/internationalisation/currency';
import { simpleFormatAmount, simpleFormatTaxAmount } from '../forms/checkouts';

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
	it('applies the tax rate to the amount and renders the result with the currency', () => {
		const amount = 15;
		const taxRate = 0.15;
		const currency = getCurrencyInfo('CAD');

		const formattedTax = simpleFormatTaxAmount(currency, amount, taxRate);

		expect(formattedTax).toEqual('$2.25');
	});
	it.each([
		[getCurrencyInfo('CAD'), 15, 0.05, '$0.75'],
		[getCurrencyInfo('CAD'), 30, 0.12, '$3.60'],
		[getCurrencyInfo('CAD'), 150, 0.15, '$22.50'],
		[getCurrencyInfo('CAD'), 300, 0.1498, '$44.94'],
		[getCurrencyInfo('CAD'), 15, 0.1498, '$2.25'],
	])(`%s/%i should format as %s`, (currency, amount, taxRate, expected) => {
		expect(simpleFormatTaxAmount(currency, amount, taxRate)).toBe(expected);
	});
});
