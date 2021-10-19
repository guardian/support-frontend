// flow
import {
	getProductOptions,
	getCurrencySymbol,
	getDisplayPrice,
	getProductPrice,
	getSavingPercentage,
} from '../helpers/paymentSelection';
jest.mock('ophan', () => {});
describe('PaymentSelection', () => {
	let productPrices;
	let productOptions;
	beforeEach(() => {
		productOptions = {
			Monthly: {
				GBP: {
					price: 17.99,
					currency: {
						glyph: '£',
						extendedGlyph: '£',
					},
					promotions: [],
				},
			},
			Annual: {
				GBP: {
					price: 109.99,
					currency: {
						glyph: '£',
						extendedGlyph: '£',
					},
					promotions: [],
				},
			},
		};
		productPrices = {
			'United Kingdom': {
				NoFulfilmentOptions: {
					NoProductOptions: productOptions,
				},
			},
		};
	});
	it('should return the product options based on country', () => {
		const countryGroup = 'GBPCountries';
		const expected = productOptions;
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
		expect(
			getProductPrice(productOptions, BillingPeriod, currencyId).price,
		).toBe(17.99);
	});
	it('should return saving percentage', () => {
		const annualCost = 100;
		const monthlyCostAnnualized = 150;
		expect(getSavingPercentage(annualCost, monthlyCostAnnualized)).toBe('33%');
	});
});
