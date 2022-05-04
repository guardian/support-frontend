import {
	getCurrencySymbol,
	getDisplayPrice,
	getProductOptions,
	getProductPrice,
	getSavingPercentage,
} from '../helpers/paymentSelection';
import { productPrices } from './fixtures/productPrices';

jest.mock('ophan');

describe('PaymentSelection', () => {
	it('should return the product options based on country', () => {
		const countryGroup = 'GBPCountries';
		const expected =
			productPrices['United Kingdom'].NoFulfilmentOptions?.NoProductOptions;
		expect(getProductOptions(productPrices, countryGroup)).toEqual(expected);
	});
	it('should return a currency glyph for the current country', () => {
		const isoCurrency = 'GBP';
		expect(getCurrencySymbol(isoCurrency)).toEqual('£');
	});
	it('should return the display price which includes the currency symbol and the price to two decimal places', () => {
		const isoCurrency = 'GBP';
		const price = 12.9899999999;
		expect(getDisplayPrice(isoCurrency, price)).toEqual('£12.99');
	});
	it('should get the product price from the product options for a billing period', () => {
		const BillingPeriod = 'Monthly';
		const currencyId = 'GBP';
		const productOptions =
			productPrices['United Kingdom'].NoFulfilmentOptions?.NoProductOptions;

		expect(productOptions).toBeDefined();

		if (productOptions) {
			expect(
				getProductPrice(productOptions, BillingPeriod, currencyId).price,
			).toBe(11.99);
		}
	});
	it('should return saving percentage', () => {
		const annualCost = 100;
		const monthlyCostAnnualized = 150;
		expect(getSavingPercentage(annualCost, monthlyCostAnnualized)).toBe('33%');
	});
});
