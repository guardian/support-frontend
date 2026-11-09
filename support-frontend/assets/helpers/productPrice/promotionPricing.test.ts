import { BillingPeriod } from '@modules/product/billingPeriod';
import {
	getPromotionDiscountedPeriods,
	getPromotionDiscountedPrice,
} from './promotionPricing';

const discount = { amount: 25, durationMonths: 6 };

describe('getPromotionDiscountedPrice', () => {
	it('applies the discount to the price', () => {
		expect(
			getPromotionDiscountedPrice({ discount }, 10, BillingPeriod.Monthly),
		).toBe(7.5);
	});

	it('returns undefined when there is no discount', () => {
		expect(
			getPromotionDiscountedPrice({}, 10, BillingPeriod.Monthly),
		).toBeUndefined();
	});
});

describe('getPromotionDiscountedPeriods', () => {
	it('counts the billing periods the discount covers', () => {
		expect(
			getPromotionDiscountedPeriods({ discount }, BillingPeriod.Monthly),
		).toBe(6);
		expect(
			getPromotionDiscountedPeriods({ discount }, BillingPeriod.Annual),
		).toBe(1);
	});

	it('returns undefined when there is no discount', () => {
		expect(
			getPromotionDiscountedPeriods({}, BillingPeriod.Monthly),
		).toBeUndefined();
	});
});
