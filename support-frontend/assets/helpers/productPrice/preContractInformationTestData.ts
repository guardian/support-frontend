import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { ratePlanToBillingPeriod } from './billingPeriods';
import { getPromotionDiscountedPrice } from './promotionPricing';

// 2026 : uk test prices
type PricePromotion = {
	fullPrice: number;
	discountedPrice: number;
	promotion?: PromoWithCatalogInformation;
};
export const getTestPricesAndPromotion = (
	productKey: ActiveProductKey,
	ratePlan: ActiveRatePlanKey,
): PricePromotion => {
	const fullPrice = getFullPrices(productKey, ratePlan);
	const promotion = getPromotions(productKey, ratePlan);
	const discountedPrice = getTestDiscountPrice(productKey, ratePlan);
	return { fullPrice, discountedPrice, promotion };
};

export const getTestDiscountPrice = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
) => {
	const fullPrice = getFullPrices(productKey, ratePlanKey);
	const promotion = getPromotions(productKey, ratePlanKey);
	if (!promotion) {
		return fullPrice;
	}
	return getPromotionDiscountedPrice(
		promotion,
		fullPrice,
		ratePlanToBillingPeriod(ratePlanKey),
	);
};

const getFullPrices = (
	productKey: ActiveProductKey,
	ratePlan: ActiveRatePlanKey,
) => {
	return fullPrices[productKey]?.[ratePlan] ?? 0;
};
const fullPrices: Partial<
	Record<ActiveProductKey, Partial<Record<ActiveRatePlanKey, number>>>
> = {
	GuardianAdLite: { Monthly: 5 },
	Contribution: { Monthly: 4, Annual: 50 },
	SupporterPlus: { Monthly: 14, Annual: 140, OneYearStudent: 9 },
	DigitalSubscription: { Monthly: 18, Annual: 180 },
	GuardianWeeklyDomestic: {
		MonthlyPlus: 19,
		QuarterlyPlus: 57,
		AnnualPlus: 228,
		OneYearGift: 158.4,
		ThreeMonthGift: 49.5,
	},
	HomeDelivery: {
		EverydayPlus: 88.99,
		SixdayPlus: 77.99,
		WeekendPlus: 36.99,
		SaturdayPlus: 21.99,
		Sunday: 23,
	},
	SubscriptionCard: {
		EverydayPlus: 72.99,
		SixdayPlus: 64.99,
		WeekendPlus: 29.99,
		SaturdayPlus: 16.99,
		Sunday: 18,
	},
};

const promoCatalogDigitalMonthly: PromoWithCatalogInformation = {
	name: 'MONTHLY DIGITAL',
	description: '',
	promoCode: 'MONTHLY DIGITAL',
	isIntroductoryPricing: true,
	discount: {
		amount: 57.12,
		durationMonths: 6,
	},
	campaignCode: 'TEST_CAMPAIGN',
	appliesTo: { productRatePlanIds: [], countries: [], catalogRatePlans: [] },
	startTimestamp: '2026-01-01T00:00:00.000Z',
};
const promoCatalogPrintMonthly: PromoWithCatalogInformation = {
	name: 'MONTHLY PRINT 50%',
	description: '',
	promoCode: 'MONTHLY PRINT',
	isIntroductoryPricing: true,
	discount: {
		amount: 50,
		durationMonths: 6,
	},
	campaignCode: 'TEST_CAMPAIGN',
	appliesTo: { productRatePlanIds: [], countries: [], catalogRatePlans: [] },
	startTimestamp: '2026-01-01T00:00:00.000Z',
};
const promoCatalogWeeklyQuarterly: PromoWithCatalogInformation = {
	name: 'QUARTERLY 25%',
	description: '',
	promoCode: 'QUARTERLY',
	isIntroductoryPricing: true,
	discount: {
		amount: 25,
		durationMonths: 6,
	},
	campaignCode: 'TEST_CAMPAIGN',
	appliesTo: { productRatePlanIds: [], countries: [], catalogRatePlans: [] },
	startTimestamp: '2026-01-01T00:00:00.000Z',
};
const promoCatalogDigitalAnnual: PromoWithCatalogInformation = {
	name: 'ANNUAL',
	description: '',
	promoCode: 'ANNUAL',
	isIntroductoryPricing: true,
	discount: {
		amount: 14.285714,
		durationMonths: 12,
	},
	campaignCode: 'TEST_CAMPAIGN',
	appliesTo: { productRatePlanIds: [], countries: [], catalogRatePlans: [] },
	startTimestamp: '2026-01-01T00:00:00.000Z',
};
const promoCatalogWeeklyAnnual: PromoWithCatalogInformation = {
	name: 'ANNUAL WEEKLY 25%',
	description: '',
	promoCode: 'ANNUAL WEEKLY',
	isIntroductoryPricing: true,
	discount: {
		amount: 25,
		durationMonths: 12,
	},
	campaignCode: 'TEST_CAMPAIGN',
	appliesTo: { productRatePlanIds: [], countries: [], catalogRatePlans: [] },
	startTimestamp: '2026-01-01T00:00:00.000Z',
};

const getPromotions = (
	productKey: ActiveProductKey,
	ratePlan: ActiveRatePlanKey,
): PromoWithCatalogInformation | undefined => {
	return promotions[productKey]?.[ratePlan];
};
const promotions: Partial<
	Record<
		ActiveProductKey,
		Partial<Record<ActiveRatePlanKey, PromoWithCatalogInformation>>
	>
> = {
	GuardianAdLite: { Monthly: promoCatalogDigitalMonthly },
	SupporterPlus: {
		Monthly: promoCatalogDigitalMonthly,
		Annual: promoCatalogDigitalAnnual,
	},
	DigitalSubscription: {
		Monthly: promoCatalogDigitalMonthly,
		Annual: promoCatalogDigitalAnnual,
	},
	GuardianWeeklyDomestic: {
		MonthlyPlus: promoCatalogPrintMonthly,
		QuarterlyPlus: promoCatalogWeeklyQuarterly,
		AnnualPlus: promoCatalogWeeklyAnnual,
	},
	HomeDelivery: {
		EverydayPlus: promoCatalogPrintMonthly,
		SixdayPlus: promoCatalogPrintMonthly,
		WeekendPlus: promoCatalogPrintMonthly,
		SaturdayPlus: promoCatalogPrintMonthly,
		Sunday: promoCatalogPrintMonthly,
	},
	SubscriptionCard: {
		EverydayPlus: promoCatalogPrintMonthly,
		SixdayPlus: promoCatalogPrintMonthly,
		WeekendPlus: promoCatalogPrintMonthly,
		SaturdayPlus: promoCatalogPrintMonthly,
		Sunday: promoCatalogPrintMonthly,
	},
};
