import { getCurrencyInfo } from '@modules/internationalisation/currency';
import { simpleFormatAmount } from '../forms/checkouts';

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
