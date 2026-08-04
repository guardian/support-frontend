// ----- Imports ----- //
import type { CurrencyCode } from '@modules/internationalisation/currency';
import { detect } from '../currency';

let mockCurrency: CurrencyCode | null | undefined = null;
jest.mock('helpers/urls/url', () => ({
	getQueryParameter: () => mockCurrency,
}));
// ----- Tests ----- //
describe('detect currency', () => {
	it('should return the currency for the supplied country group if there is no query parameter set (GBP)', () => {
		mockCurrency = null;
		expect(detect('uk')).toEqual('GBP');
	});
	it('should return the currency for the supplied country group if there is no query parameter set (USD)', () => {
		mockCurrency = null;
		expect(detect('us')).toEqual('USD');
	});
	it('should return the currency from the query parameter (USD)', () => {
		mockCurrency = 'USD';
		expect(detect('uk')).toEqual('USD');
	});
	it('should return the currency from the query parameter (GBP)', () => {
		mockCurrency = 'GBP';
		expect(detect('us')).toEqual('GBP');
	});
	it('should return the currency from the query parameter (AUD)', () => {
		mockCurrency = 'AUD';
		expect(detect('us')).toEqual('AUD');
	});
	it('should return the currency for the supplied country group if there is no query parameter set (AUDCountries)', () => {
		mockCurrency = null;
		expect(detect('au')).toEqual('AUD');
	});
	it('should return the currency from the query parameter (EUR)', () => {
		mockCurrency = 'EUR';
		expect(detect('us')).toEqual('EUR');
	});
	it('should return the currency for the supplied country group if there is no query parameter set (EURCountries)', () => {
		mockCurrency = null;
		expect(detect('eu')).toEqual('EUR');
	});
});
