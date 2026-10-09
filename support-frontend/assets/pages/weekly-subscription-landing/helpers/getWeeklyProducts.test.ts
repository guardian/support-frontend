import type { CountryCode } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { ProductRatePlanKey } from '@modules/product-catalog/productCatalog';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import { productCatalogFixture } from 'fixtures/productCatalogFixture';
import {
	weeklyBillingPeriods,
	weeklyGiftBillingPeriods,
} from 'helpers/productPrice/billingPeriods';
import { logException } from 'helpers/utilities/logger';
import { getWeeklyProducts } from './getWeeklyProducts';

jest.mock('helpers/utilities/logger', () => ({ logException: jest.fn() }));

const makePromotion = (
	promoCode: string,
	productRatePlanKey: ProductRatePlanKey<'GuardianWeeklyDomestic'>,
	amount: number,
	durationMonths: number,
): PromoWithCatalogInformation => ({
	promoCode,
	name: promoCode,
	campaignCode: 'CAMPAIGN',
	appliesTo: {
		productRatePlanIds: [],
		countries: ['GB'],
		catalogRatePlans: [
			{ productKey: 'GuardianWeeklyDomestic', productRatePlanKey },
		],
	},
	startTimestamp: '2026-01-01T00:00:00.000Z',
	discount: { amount, durationMonths },
});

const getProducts = ({
	promotions = [],
	promoCode,
	isGift = false,
	countryId = 'GB',
	countryGroupId = 'GBPCountries',
}: {
	promotions?: PromoWithCatalogInformation[];
	promoCode?: string;
	isGift?: boolean;
	countryId?: CountryCode;
	countryGroupId?: CountryGroupId;
}) =>
	getWeeklyProducts({
		countryId,
		countryGroupId,
		productCatalog: productCatalogFixture,
		promotions,
		promoCode,
		billingPeriods: isGift ? weeklyGiftBillingPeriods : weeklyBillingPeriods,
		isGift,
	});

describe('getWeeklyProducts', () => {
	it('uses the Plus rate plan prices from the product catalog', () => {
		const products = getProducts({});

		expect(products.map((product) => product.price)).toEqual([
			'£19',
			'£57',
			'£228',
		]);
		expect(products.map((product) => product.discountedPrice)).toEqual([
			undefined,
			undefined,
			undefined,
		]);
		expect(products[1]?.href).toContain('ratePlan=QuarterlyPlus');
	});

	it('uses the GuardianWeeklyRestOfWorld prices for International', () => {
		const [monthly] = getProducts({
			countryId: 'BR',
			countryGroupId: 'International',
		});

		expect(monthly?.price).toBe('$38');
	});

	it('applies a promotion to the rate plan it applies to', () => {
		const [monthly, quarterly] = getProducts({
			promotions: [makePromotion('50OFF3', 'QuarterlyPlus', 50, 3)],
		});

		expect(monthly?.discountedPrice).toBeUndefined();
		expect(quarterly?.price).toBe('£57');
		expect(quarterly?.discountedPrice).toBe('£28.50');
		expect(quarterly?.hasPromotion).toBe(true);
		expect(quarterly?.href).toContain('promoCode=50OFF3');
	});

	it('prefers the promotion matching the promo code', () => {
		const [, quarterly] = getProducts({
			promotions: [
				makePromotion('DEFAULT', 'QuarterlyPlus', 10, 3),
				makePromotion('QUERY', 'QuarterlyPlus', 50, 3),
			],
			promoCode: 'QUERY',
		});

		expect(quarterly?.href).toContain('promoCode=QUERY');
	});

	it('shows the discounted price as the gift price', () => {
		const [quarterly, annual] = getProducts({
			promotions: [makePromotion('GIFT20', 'OneYearGift', 20, 12)],
			isGift: true,
		});

		expect(quarterly?.price).toBe('£49.50');
		expect(quarterly?.priceCopy).toBe('for 3 months');
		expect(annual?.price).toBe('£126.72');
		expect(annual?.priceCopy).toBe('for 12 months');
		expect(annual?.href).toContain('ratePlan=OneYearGift');
	});

	it('omits and logs billing periods with no price', () => {
		const productCatalog = JSON.parse(
			JSON.stringify(productCatalogFixture),
		) as typeof productCatalogFixture;
		delete productCatalog.GuardianWeeklyDomestic?.ratePlans.AnnualPlus;

		const products = getWeeklyProducts({
			countryId: 'GB',
			countryGroupId: 'GBPCountries',
			productCatalog,
			promotions: [],
			billingPeriods: [BillingPeriod.Monthly, BillingPeriod.Annual],
		});

		expect(products.map((product) => product.billingPeriod)).toEqual([
			BillingPeriod.Monthly,
		]);
		expect(logException).toHaveBeenCalledWith(
			'No price found for GuardianWeeklyDomestic billing period Annual',
		);
	});
});
