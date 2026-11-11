import { BillingPeriod } from '@modules/product/billingPeriod';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import {
	getPromotionDiscountedPeriods,
	getPromotionDiscountedPrice,
} from './promotionPricing';

const promotionWithoutDiscount: PromoWithCatalogInformation = {
	promoCode: 'NO_DISCOUNT',
	name: 'No discount',
	campaignCode: 'TEST_CAMPAIGN',
	appliesTo: { productRatePlanIds: [], countries: [], catalogRatePlans: [] },
	startTimestamp: '2026-01-01T00:00:00.000Z',
};

describe('promotion pricing without a discount', () => {
	it('has no discounted price', () => {
		expect(
			getPromotionDiscountedPrice(
				promotionWithoutDiscount,
				10,
				BillingPeriod.Monthly,
			),
		).toBeUndefined();
	});

	it('has no discounted periods', () => {
		expect(
			getPromotionDiscountedPeriods(
				promotionWithoutDiscount,
				BillingPeriod.Monthly,
			),
		).toBeUndefined();
	});
});
