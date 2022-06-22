import type { ProductPrice } from 'helpers/productPrice/productPrices';
import { getSubscriptionAnnualValue } from '../quantumMetricHelpers';

describe('Quantum Metric Helpers', () => {
	it('should get a monthly subscriptions annual value with a promotion', () => {
		const productPrice: ProductPrice = {
			price: 11.99,
			currency: 'GBP',
			fixedTerm: false,
			promotions: [
				{
					name: 'Sept 2019 Discount',
					description: '50% off for 3 months',
					promoCode: 'DK0NT24WG',
					discountedPrice: 5.99,
					numberOfDiscountedPeriods: 3,
					discount: { amount: 50, durationMonths: 3 },
				},
			],
		};
		const billingPeriod = 'Monthly';

		expect(getSubscriptionAnnualValue(productPrice, billingPeriod)).toBe(12588);
	});
	it('should get a monthly subscriptions annual value without a promotion', () => {
		const productPrice: ProductPrice = {
			price: 11.99,
			currency: 'GBP',
			fixedTerm: false,
		};
		const billingPeriod = 'Monthly';

		expect(getSubscriptionAnnualValue(productPrice, billingPeriod)).toBe(14388);
	});
	it('should get an annual subscriptions annual value with a promotion', () => {
		const productPrice: ProductPrice = {
			price: 119,
			currency: 'GBP',
			fixedTerm: false,
			promotions: [
				{
					name: 'Introductory Promotion Global',
					description: '16% off for the first year',
					promoCode: 'ANNUAL-INTRO-GLOBAL',
					discountedPrice: 99,
					numberOfDiscountedPeriods: 1,
					discount: { amount: 16.81, durationMonths: 12 },
				},
			],
		};
		const billingPeriod = 'Annual';
		expect(getSubscriptionAnnualValue(productPrice, billingPeriod)).toBe(9900);
	});
	it('should get an annual subscriptions annual value without a promotion', () => {
		const productPrice: ProductPrice = {
			price: 119,
			currency: 'GBP',
			fixedTerm: false,
		};
		const billingPeriod = 'Annual';
		expect(getSubscriptionAnnualValue(productPrice, billingPeriod)).toBe(11900);
	});
	it('should get a fixed term subscriptions value', () => {
		const productPrice: ProductPrice = {
			price: 36,
			currency: 'GBP',
			fixedTerm: true,
		};
		const billingPeriod = 'Monthly';

		expect(getSubscriptionAnnualValue(productPrice, billingPeriod)).toBe(3600);
	});
});
