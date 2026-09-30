import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import { getAppliedPromotion } from './appliedPromotion';

const promotion = (
	promoCode: string,
	catalogRatePlans: PromoWithCatalogInformation['appliesTo']['catalogRatePlans'],
): PromoWithCatalogInformation => ({
	promoCode,
	name: promoCode,
	campaignCode: 'TEST_CAMPAIGN',
	appliesTo: { productRatePlanIds: [], countries: ['GB'], catalogRatePlans },
	startTimestamp: '2026-01-01T00:00:00.000Z',
});

const monthlyPromo = promotion('MONTHLY', [
	{ productKey: 'GuardianWeeklyDomestic', productRatePlanKey: 'MonthlyPlus' },
]);
const monthlyAndAnnualPromo = promotion('MONTHLYANDANNUAL', [
	{ productKey: 'GuardianWeeklyDomestic', productRatePlanKey: 'MonthlyPlus' },
	{ productKey: 'GuardianWeeklyDomestic', productRatePlanKey: 'AnnualPlus' },
]);
const restOfWorldPromo = promotion('ROW', [
	{
		productKey: 'GuardianWeeklyRestOfWorld',
		productRatePlanKey: 'MonthlyPlus',
	},
]);

describe('getAppliedPromotion', () => {
	it('returns the first promotion which applies to the rate plan', () => {
		expect(
			getAppliedPromotion(
				[restOfWorldPromo, monthlyPromo, monthlyAndAnnualPromo],
				'GuardianWeeklyDomestic',
				'MonthlyPlus',
			),
		).toBe(monthlyPromo);
	});

	it('prefers the promotion matching the promo code', () => {
		expect(
			getAppliedPromotion(
				[monthlyPromo, monthlyAndAnnualPromo],
				'GuardianWeeklyDomestic',
				'MonthlyPlus',
				'MONTHLYANDANNUAL',
			),
		).toBe(monthlyAndAnnualPromo);
	});

	it('ignores a promo code promotion which does not apply to the rate plan', () => {
		expect(
			getAppliedPromotion(
				[monthlyPromo, monthlyAndAnnualPromo],
				'GuardianWeeklyDomestic',
				'AnnualPlus',
				'MONTHLY',
			),
		).toBe(monthlyAndAnnualPromo);
	});

	it('matches on product as well as rate plan', () => {
		expect(
			getAppliedPromotion(
				[restOfWorldPromo],
				'GuardianWeeklyDomestic',
				'MonthlyPlus',
			),
		).toBeUndefined();
	});
});
