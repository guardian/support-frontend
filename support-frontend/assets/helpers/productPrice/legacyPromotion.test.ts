import { BillingPeriod } from '@modules/product/billingPeriod';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import { getLegacyPromotion, toLegacyPromotion } from './legacyPromotion';

const promotion: PromoWithCatalogInformation = {
	promoCode: 'SPLUS_ANNUAL',
	name: 'Supporter Plus annual',
	campaignCode: 'TEST_CAMPAIGN',
	description: 'A discount',
	appliesTo: {
		productRatePlanIds: [],
		countries: ['GB'],
		catalogRatePlans: [
			{ productKey: 'SupporterPlus', productRatePlanKey: 'Annual' },
		],
	},
	startTimestamp: '2026-01-01T00:00:00.000Z',
	endTimestamp: '2026-12-31T00:00:00.000Z',
	discount: { amount: 25, durationMonths: 12 },
	landingPage: { title: 'Title', roundelHtml: '25% off' },
	isIntroductoryPricing: false,
};

describe('toLegacyPromotion', () => {
	it('converts a promotion with a discount', () => {
		expect(toLegacyPromotion(promotion, 120, BillingPeriod.Annual)).toEqual({
			name: 'Supporter Plus annual',
			description: 'A discount',
			promoCode: 'SPLUS_ANNUAL',
			isIntroductoryPricing: false,
			discountedPrice: 90,
			numberOfDiscountedPeriods: 1,
			discount: { amount: 25, durationMonths: 12 },
			landingPage: {
				title: 'Title',
				description: undefined,
				roundel: '25% off',
			},
			starts: '2026-01-01T00:00:00.000Z',
			expires: '2026-12-31T00:00:00.000Z',
		});
	});

	it('converts a promotion without a discount or landing page', () => {
		const result = toLegacyPromotion(
			{
				...promotion,
				discount: undefined,
				landingPage: undefined,
				description: undefined,
				isIntroductoryPricing: undefined,
			},
			120,
			BillingPeriod.Annual,
		);
		expect(result.discountedPrice).toBeUndefined();
		expect(result.numberOfDiscountedPeriods).toBeUndefined();
		expect(result.landingPage).toBeUndefined();
		expect(result.description).toBe('');
		expect(result.isIntroductoryPricing).toBe(false);
	});
});

describe('getLegacyPromotion', () => {
	it('returns the promotion for the rate plan', () => {
		expect(
			getLegacyPromotion({
				promotions: [promotion],
				productKey: 'SupporterPlus',
				ratePlanKey: 'Annual',
				price: 120,
				billingPeriod: BillingPeriod.Annual,
			})?.promoCode,
		).toBe('SPLUS_ANNUAL');
	});

	it('returns undefined if no promotion applies to the rate plan', () => {
		expect(
			getLegacyPromotion({
				promotions: [promotion],
				productKey: 'SupporterPlus',
				ratePlanKey: 'OneYearStudent',
				price: 120,
				billingPeriod: BillingPeriod.Annual,
			}),
		).toBeUndefined();
	});
});
