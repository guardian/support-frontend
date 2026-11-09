import { BillingPeriod } from '@modules/product/billingPeriod';
import {
	getPromotionDiscountedPeriods,
	getPromotionDiscountedPrice,
} from './promotionPricing';

describe('promotion pricing without a discount', () => {
	it('has no discounted price', () => {
		expect(
			getPromotionDiscountedPrice({}, 10, BillingPeriod.Monthly),
		).toBeUndefined();
	});

	it('has no discounted periods', () => {
		expect(
			getPromotionDiscountedPeriods({}, BillingPeriod.Monthly),
		).toBeUndefined();
	});
});
