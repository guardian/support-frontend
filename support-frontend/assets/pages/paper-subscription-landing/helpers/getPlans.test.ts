import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import { productCatalogFixture } from 'fixtures/productCatalogFixture';
import { getPlans } from './getPlans';

const makePromotion = (
	promoCode: string,
	productKey: 'HomeDelivery' | 'SubscriptionCard',
	productRatePlanKey: string,
	durationMonths: number,
): PromoWithCatalogInformation =>
	({
		promoCode,
		name: promoCode,
		campaignCode: 'CAMPAIGN',
		appliesTo: {
			productRatePlanIds: [],
			countries: ['GB'],
			catalogRatePlans: [{ productKey, productRatePlanKey }],
		},
		startTimestamp: '2026-01-01T00:00:00.000Z',
		endTimestamp: '2099-01-01T00:00:00.000Z',
		discount: { amount: 25, durationMonths },
	} as PromoWithCatalogInformation);

const getPlan = (
	productOption: string,
	{
		fulfilmentOption = 'Collection',
		promotions = [],
		promoCode,
	}: {
		fulfilmentOption?: 'Collection' | 'HomeDelivery';
		promotions?: PromoWithCatalogInformation[];
		promoCode?: string;
	} = {},
) => {
	const plan = getPlans({
		fulfilmentOption,
		productCatalog: productCatalogFixture,
		promotions,
		promoCode,
	}).find((plan) => plan.href.includes(`ratePlan=${productOption}`));
	if (!plan) {
		throw new Error(`No plan found for ${productOption}`);
	}
	return plan;
};

describe('getPlans', () => {
	it('returns the Plus products and Sunday', () => {
		const plans = getPlans({
			fulfilmentOption: 'Collection',
			productCatalog: productCatalogFixture,
			promotions: [],
		});

		expect(plans.map((plan) => plan.href.match(/ratePlan=(\w+)/)?.[1])).toEqual(
			['SixdayPlus', 'SaturdayPlus', 'EverydayPlus', 'WeekendPlus', 'Sunday'],
		);
	});

	it('uses the product catalog price and saving vs retail', () => {
		const plan = getPlan('EverydayPlus');

		expect(plan.price).toBe('£73.99');
		expect(plan.savingsText).toBe('Save 37% on retail price');
		expect(plan.offerCopy).toBe('');
		expect(plan.promotion).toBeUndefined();
		expect(plan.href).not.toContain('promoCode');
	});

	it('uses the HomeDelivery prices for the HomeDelivery tab', () => {
		const plan = getPlan('EverydayPlus', { fulfilmentOption: 'HomeDelivery' });

		expect(plan.price).toBe('£88.99');
		expect(plan.href).toContain('product=HomeDelivery');
	});

	it('does not show a saving when saving vs retail is negative', () => {
		const plan = getPlan('SaturdayPlus', { fulfilmentOption: 'HomeDelivery' });

		expect(plan.savingsText).toBeNull();
	});

	it('applies a promotion to the price, offer and savings text', () => {
		const promotion = makePromotion(
			'PAPER25',
			'SubscriptionCard',
			'EverydayPlus',
			6,
		);
		const plan = getPlan('EverydayPlus', {
			promotions: [promotion],
			promoCode: 'PAPER25',
		});

		expect(plan.price).toBe('£55.49');
		expect(plan.offerCopy).toBe(
			'£55.49/month for 6 months, then £73.99/month*',
		);
		expect(plan.savingsText).toBe('Save 53% on retail price');
		expect(plan.promotion).toBe(promotion);
		expect(plan.href).toContain('promoCode=PAPER25');
	});

	it('describes a single month discount as the first month', () => {
		const plan = getPlan('EverydayPlus', {
			promotions: [
				makePromotion('PAPER25', 'SubscriptionCard', 'EverydayPlus', 1),
			],
		});

		expect(plan.offerCopy).toBe(
			'£55.49/month for the first month, then £73.99/month*',
		);
	});

	it('does not add an asterisk to the Sunday offer text', () => {
		const plan = getPlan('Sunday', {
			promotions: [makePromotion('SUNDAY25', 'SubscriptionCard', 'Sunday', 6)],
		});

		expect(plan.offerCopy).toMatch(/\/month$/);
	});

	it('does not apply a promotion for a different product', () => {
		const plan = getPlan('EverydayPlus', {
			fulfilmentOption: 'HomeDelivery',
			promotions: [
				makePromotion('PAPER25', 'SubscriptionCard', 'EverydayPlus', 6),
			],
		});

		expect(plan.price).toBe('£88.99');
		expect(plan.promotion).toBeUndefined();
	});
});
