import {
	getAnnualValue,
	getCurrencySymbol,
	getDisplayPrice,
	getProductOptions,
	getProductPrice,
} from '../helpers/paymentSelection';
import { productPrices } from './__fixtures__/productPrices';

jest.mock('ophan');

describe('PaymentSelection', () => {
	it('should return the product options based on country', () => {
		const countryGroup = 'GBPCountries';
		const expected =
			productPrices['United Kingdom']?.NoFulfilmentOptions?.NoProductOptions;
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
			productPrices['United Kingdom']?.NoFulfilmentOptions?.NoProductOptions;

		expect(productOptions).toBeDefined();

		if (productOptions) {
			expect(
				getProductPrice(productOptions, BillingPeriod, currencyId).price,
			).toBe(11.99);
		}
	});
	it('should get a monthly subscriptions annual value with a promotion', () => {
		const fullPrice = 11.99;
		const billingPeriod = 'Monthly';
		const promotion = {
			name: 'Sept 2019 Discount',
			description: '50% off for 3 months',
			promoCode: 'DK0NT24WG',
			discountedPrice: 5.99,
			numberOfDiscountedPeriods: 3,
			discount: { amount: 50, durationMonths: 3 },
			landingPage: {
				title: 'Lorem ipsum dolor sit amet',
				description: 'Lorem ipsum dolor sit amet',
				roundel: '50% off for 3 months',
			},
		};

		expect(getAnnualValue(fullPrice, promotion, billingPeriod)).toBe(12588);
	});
	it('should get a monthly subscriptions annual value without a promotion', () => {
		const fullPrice = 11.99;
		const billingPeriod = 'Monthly';
		const promotion = undefined;

		expect(getAnnualValue(fullPrice, promotion, billingPeriod)).toBe(14388);
	});
	it('should get an annual subscriptions annual value with a promotion', () => {
		const fullPrice = 119;
		const billingPeriod = 'Annual';
		const promotion = {
			name: 'Introductory Promotion UK',
			description: '16% off for the first year',
			promoCode: 'ANNUAL-INTRO-UK',
			discountedPrice: 99,
			numberOfDiscountedPeriods: 1,
			discount: { amount: 16.81, durationMonths: 12 },
			landingPage: {},
		};
		expect(getAnnualValue(fullPrice, promotion, billingPeriod)).toBe(9900);
	});
	it('should get an annual subscriptions annual value without a promotion', () => {
		const fullPrice = 119;
		const billingPeriod = 'Annual';
		const promotion = undefined;
		expect(getAnnualValue(fullPrice, promotion, billingPeriod)).toBe(11900);
	});
});
