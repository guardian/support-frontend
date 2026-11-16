import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from './promotions';
import {
	contributionMonthly,
	digitalAndPrintAnnual,
	digitalAndPrintMonthly,
	getPromotionExpiryDate,
	getRenewalTermsPolicyCopy,
	printQuarterly,
	promotionAnnual,
	promotionDigitalMonthly,
	promotionPrintMonthly,
	promotionPrintQuarterly,
} from './renewalTermsPolicyCopy';

describe('getRenewalTermsPolicyCopy', () => {
	it.each([
		['Contribution', 'Monthly', 4, contributionMonthly],
		['Contribution', 'Annual', 50, digitalAndPrintAnnual],
		['GuardianAdLite', 'Monthly', 5, digitalAndPrintMonthly],
		['SupporterPlus', 'Monthly', 14, digitalAndPrintMonthly],
		['SupporterPlus', 'Annual', 140, digitalAndPrintAnnual],
		['SupporterPlus', 'OneTimeStudent', 9, undefined],
		['DigitalSubscription', 'Monthly', 18, digitalAndPrintMonthly],
		['DigitalSubscription', 'Annual', 180, digitalAndPrintAnnual],
		['GuardianWeeklyDomestic', 'MonthlyPlus', 19, digitalAndPrintMonthly],
		['GuardianWeeklyDomestic', 'QuarterlyPlus', 57, printQuarterly],
		['GuardianWeeklyDomestic', 'AnnualPlus', 228, digitalAndPrintAnnual],
		['GuardianWeeklyDomestic', 'ThreeMonthGift', 49.5, undefined],
		['GuardianWeeklyDomestic', 'OneYearGift', 158.4, undefined],
		['HomeDelivery', 'SixdayPlus', 77.99, digitalAndPrintMonthly],
		['HomeDelivery', 'Sunday', 77.99, digitalAndPrintMonthly],
		['SubscriptionCard', 'EverydayPlus', 88.99, digitalAndPrintMonthly],
	] as const)(
		'renewal terms for product: %s ratePlan: %s amount: %d',
		(product, ratePlan, amount, policy) => {
			const result =
				getRenewalTermsPolicyCopy(
					product as ActiveProductKey,
					ratePlan as ActiveRatePlanKey,
					amount,
				) ?? '';
			const policyResult = policy?.(amount) ?? '';
			expect(result).toBe(policyResult);
		},
	);

	const promotionMonthly: Promotion = {
		name: 'MONTHLY',
		description: '',
		promoCode: 'MONTHLY',
		isIntroductoryPricing: true,
		numberOfDiscountedPeriods: 6,
		discountedPrice: 7,
	};
	const promotionQuarterly: Promotion = {
		name: 'QUARTERLY',
		description: '',
		promoCode: 'QUARTERLY',
		isIntroductoryPricing: true,
		numberOfDiscountedPeriods: 2,
		discountedPrice: 30,
	};
	const promoAnnual: Promotion = {
		name: 'ANNUAL',
		description: '',
		promoCode: 'ANNUAL',
		isIntroductoryPricing: true,
		numberOfDiscountedPeriods: 1,
		discountedPrice: 90,
	};
	it.each([
		['Contribution', 'Monthly', 4, promotionMonthly, undefined],
		['Contribution', 'Annual', 50, promoAnnual, undefined],
		['GuardianAdLite', 'Monthly', 5, promotionMonthly, promotionDigitalMonthly],
		['SupporterPlus', 'Monthly', 14, promotionMonthly, promotionDigitalMonthly],
		[
			'SupporterPlus',
			'MonthlyTaxExclusive',
			14,
			promotionMonthly,
			promotionDigitalMonthly,
		],
		['SupporterPlus', 'Annual', 120, promoAnnual, promotionAnnual],
		['SupporterPlus', 'AnnualTaxExclusive', 120, promoAnnual, promotionAnnual],
		['SupporterPlus', 'OneYearStudent', 90, promoAnnual, undefined],
		[
			'DigitalSubscription',
			'Monthly',
			18,
			promotionMonthly,
			promotionDigitalMonthly,
		],
		[
			'DigitalSubscription',
			'MonthlyTaxExclusive',
			18,
			promotionMonthly,
			promotionDigitalMonthly,
		],
		['DigitalSubscription', 'Annual', 180, promoAnnual, promotionAnnual],
		[
			'DigitalSubscription',
			'AnnualTaxExclusive',
			180,
			promoAnnual,
			promotionAnnual,
		],
		[
			'DigitalSubscription',
			'ThreeMonthGift',
			54,
			promotionQuarterly,
			undefined,
		],
		['DigitalSubscription', 'OneYearGift', 180, promoAnnual, undefined],
		[
			'GuardianWeeklyDomestic',
			'MonthlyPlus',
			19,
			promotionMonthly,
			promotionPrintMonthly,
		],
		[
			'GuardianWeeklyDomestic',
			'QuarterlyPlus',
			57,
			promotionQuarterly,
			promotionPrintQuarterly,
		],
		['GuardianWeeklyDomestic', 'AnnualPlus', 228, promoAnnual, promotionAnnual],
		[
			'GuardianWeeklyDomestic',
			'ThreeMonthGift',
			49.5,
			promotionQuarterly,
			undefined,
		],
		['GuardianWeeklyDomestic', 'OneYearGift', 158.4, promoAnnual, undefined],
		[
			'GuardianWeeklyRestOfWorld',
			'MonthlyPlus',
			25,
			promotionMonthly,
			promotionPrintMonthly,
		],
		[
			'GuardianWeeklyRestOfWorld',
			'QuarterlyPlus',
			75,
			promotionQuarterly,
			promotionPrintQuarterly,
		],
		[
			'GuardianWeeklyRestOfWorld',
			'AnnualPlus',
			300,
			promoAnnual,
			promotionAnnual,
		],
		[
			'GuardianWeeklyRestOfWorld',
			'ThreeMonthGift',
			60,
			promotionQuarterly,
			undefined,
		],
		['GuardianWeeklyRestOfWorld', 'OneYearGift', 240, promoAnnual, undefined],
		[
			'HomeDelivery',
			'EverydayPlus',
			88.99,
			promotionMonthly,
			promotionPrintMonthly,
		],
		[
			'HomeDelivery',
			'SixdayPlus',
			77.99,
			promotionMonthly,
			promotionPrintMonthly,
		],
		[
			'HomeDelivery',
			'WeekendPlus',
			35.99,
			promotionMonthly,
			promotionPrintMonthly,
		],
		[
			'HomeDelivery',
			'SaturdayPlus',
			25.99,
			promotionMonthly,
			promotionPrintMonthly,
		],
		['HomeDelivery', 'Sunday', 19.99, promotionMonthly, promotionPrintMonthly],
		[
			'SubscriptionCard',
			'EverydayPlus',
			88.99,
			promotionMonthly,
			promotionPrintMonthly,
		],
		[
			'SubscriptionCard',
			'SixdayPlus',
			77.99,
			promotionMonthly,
			promotionPrintMonthly,
		],
		[
			'SubscriptionCard',
			'WeekendPlus',
			35.99,
			promotionMonthly,
			promotionPrintMonthly,
		],
		[
			'SubscriptionCard',
			'SaturdayPlus',
			25.99,
			promotionMonthly,
			promotionPrintMonthly,
		],
		[
			'SubscriptionCard',
			'Sunday',
			19.99,
			promotionMonthly,
			promotionPrintMonthly,
		],
		['NationalDelivery', 'EverydayPlus', 88.99, promotionMonthly, undefined],
		['OneTimeContribution', 'OneTime', 10, promotionMonthly, undefined],
	] as const)(
		'promotional renewal terms for product: %s ratePlan: %s amount: %d',
		(product, ratePlan, amount, promotion, expectedPolicy) => {
			const result = getRenewalTermsPolicyCopy(
				product,
				ratePlan,
				amount,
				promotion,
			);
			const expiry = getPromotionExpiryDate(
				product,
				ratePlan,
				promotion.numberOfDiscountedPeriods ?? 0,
			);
			expect(result).toBe(expectedPolicy?.(amount, expiry, promotion));
		},
	);
});
