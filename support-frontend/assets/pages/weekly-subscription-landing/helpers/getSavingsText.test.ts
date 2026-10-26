import { BillingPeriod } from '@modules/product/billingPeriod';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import {
	getWeeklyGiftSavingsText,
	getWeeklySavingsText,
} from './getSavingsText';

const makePromotion = (
	overrides: Partial<PromoWithCatalogInformation> = {},
): PromoWithCatalogInformation => ({
	promoCode: 'TESTPROMO',
	name: 'Test Promo',
	campaignCode: 'TESTCAMPAIGN',
	appliesTo: { productRatePlanIds: [], countries: [], catalogRatePlans: [] },
	startTimestamp: '2026-01-01T00:00:00.000Z',
	...overrides,
});

describe('getWeeklySavingsText', () => {
	it('returns null when there is no promotion', () => {
		expect(getWeeklySavingsText(undefined)).toBeNull();
	});

	it('returns null when the promotion has no discount', () => {
		const promotion = makePromotion({ discount: undefined });
		expect(getWeeklySavingsText(promotion)).toBeNull();
	});

	it('returns savings text for a 12-month discount', () => {
		const promotion = makePromotion({
			discount: { amount: 50, durationMonths: 12 },
		});
		expect(getWeeklySavingsText(promotion)).toBe('Save 50% for the first year');
	});
});

describe('getWeeklyGiftSavingsText', () => {
	describe('when a promotion is present', () => {
		it('returns the roundel text from the promotion landing page', () => {
			const promotion = makePromotion({
				landingPage: { roundelHtml: 'Custom roundel text' },
			});
			expect(
				getWeeklyGiftSavingsText(BillingPeriod.Annual, promotion, {}),
			).toBe('Custom roundel text');
		});

		it('returns null when promotion has no landingPage roundel', () => {
			const promotion = makePromotion({ landingPage: undefined });
			expect(
				getWeeklyGiftSavingsText(BillingPeriod.Annual, promotion, {}),
			).toBeNull();
		});
	});

	describe('when business as usual for Annual weekly gifting', () => {
		it('returns null for Quarterly billing period', () => {
			const allPrices = {
				[BillingPeriod.Quarterly]: 50,
				[BillingPeriod.Annual]: 160,
			};
			expect(
				getWeeklyGiftSavingsText(BillingPeriod.Quarterly, undefined, allPrices),
			).toBeNull();
		});

		it('returns null when Annual price is missing', () => {
			const allPrices = {
				[BillingPeriod.Quarterly]: 50,
			};
			expect(
				getWeeklyGiftSavingsText(BillingPeriod.Annual, undefined, allPrices),
			).toBeNull();
		});

		it('returns null when Quarterly price is missing', () => {
			const allPrices = {
				[BillingPeriod.Annual]: 190,
			};
			expect(
				getWeeklyGiftSavingsText(BillingPeriod.Annual, undefined, allPrices),
			).toBeNull();
		});

		it('returns null when no saving', () => {
			// 50 * 4 - 200 = 0, savingsPercentage = 0
			const allPrices = {
				[BillingPeriod.Quarterly]: 50,
				[BillingPeriod.Annual]: 200,
			};
			expect(
				getWeeklyGiftSavingsText(BillingPeriod.Annual, undefined, allPrices),
			).toBeNull();
		});

		it('returns savings text with correct percentage', () => {
			// ((50 * 4) - 150) = 50, savingsPercentage = round(50/(50 * 4) * 100) = 25
			const allPrices = {
				[BillingPeriod.Quarterly]: 50,
				[BillingPeriod.Annual]: 150,
			};
			expect(
				getWeeklyGiftSavingsText(BillingPeriod.Annual, undefined, allPrices),
			).toBe('Save 25% with a 12 month gift subscription');
		});

		it('rounds the savings percentage to the nearest integer', () => {
			// ((45 * 4) - 152) = 28, savingsPercentage = round(28/(45 * 4) * 100) = 15.556 = 16
			const allPrices = {
				[BillingPeriod.Quarterly]: 45,
				[BillingPeriod.Annual]: 152,
			};
			expect(
				getWeeklyGiftSavingsText(BillingPeriod.Annual, undefined, allPrices),
			).toBe('Save 16% with a 12 month gift subscription');
		});
	});
});
