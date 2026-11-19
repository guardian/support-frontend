import { BillingPeriod } from '@modules/product/billingPeriod';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { formatUserDate } from 'helpers/utilities/dateConversions';
import { getDateWithOrdinal } from 'helpers/utilities/dateFormatting';
import {
	promoCatalogDigitalAnnual,
	promoCatalogDigitalMonthly,
	promoCatalogPrintMonthly,
	promoCatalogWeeklyAnnual,
	promoCatalogWeeklyQuarterly,
} from '../../../stories/checkouts/preContactInformation.stories';
import { ratePlanToBillingPeriod } from './billingPeriods';
import { monthlyEquivalentPrice } from './monthlyEquivalentPrice';
import { getPromotionDiscountedPrice } from './promotionPricing';
import {
	getPromotionExpiryDate,
	getRenewalTermPolicy,
} from './renewalTermPolicies';

const contributionMonthly = (fullPrice: number) =>
	`We will attempt to take payment of £${fullPrice}, on the ${getDateWithOrdinal(
		new Date(),
	)} day of every month, from now until you cancel your payment. Payments may take up to 6 days to be recorded in your bank account. You can change how much you give or cancel your payment at any time.`;
const digitalAndPrintMonthly = (fullPrice: number) =>
	`Subscription auto-renews monthly. Pay £${fullPrice}/month, unless you cancel. We'll remind you every 6 months, 2 weeks before your renewal date.`;
const digitalAndPrintAnnual = (fullPrice: number) =>
	`Subscription auto-renews annually. Pay £${fullPrice}/year, unless you cancel. Equivalent to £${monthlyEquivalentPrice(
		fullPrice,
		BillingPeriod.Annual,
	)}/month. We'll remind you every year, 2 weeks before your renewal date.`;
const printQuarterly = (fullPrice: number) =>
	`Subscription auto-renews quarterly. Pay £${fullPrice}/quarter, unless you cancel. Equivalent to £${monthlyEquivalentPrice(
		fullPrice,
		BillingPeriod.Quarterly,
	)}/month for each quarter. We'll remind you every 6 months, 2 weeks before your renewal date.`;

const promoDigitalMonthly = (
	fullPrice: number,
	discountPrice: number,
	expiry: string,
) =>
	`Subscription auto-renews monthly. Pay £${discountPrice}/month for 6 months, then £${fullPrice}/month from ${expiry}, unless you cancel. We'll remind you 2 weeks before ${expiry} then every 6 months, 2 weeks before your renewal date.`;
const promoPrintMonthly = (
	fullPrice: number,
	discountPrice: number,
	expiry: string,
) =>
	`Subscription auto-renews monthly. Pay £${discountPrice}/month for the first 6 months, then £${fullPrice}/month from ${expiry}, unless you cancel. We'll remind you 2 weeks before ${expiry} then every 6 months, 2 weeks before your renewal date.`;
const promoPrintQuarterly = (
	fullPrice: number,
	discountPrice: number,
	expiry: string,
) =>
	`Subscription auto-renews quarterly. Pay £${discountPrice}/quarter for 2 quarters, then £${fullPrice}/quarter from ${expiry}, unless you cancel. Equivalent to £${monthlyEquivalentPrice(
		discountPrice,
		BillingPeriod.Quarterly,
	)}/month for 2 quarters, then £${monthlyEquivalentPrice(
		fullPrice,
		BillingPeriod.Quarterly,
	)}/month for each quarter after. We'll remind you 2 weeks before ${expiry} then every 6 months, 2 weeks before your renewal date.`;

const promotionAnnual = (
	fullPrice: number,
	discountPrice: number,
	expiry: string,
) =>
	`Subscription auto-renews annually. Pay £${discountPrice}/year for 1 year, then £${fullPrice}/year from ${expiry}, unless you cancel. Equivalent to £${monthlyEquivalentPrice(
		discountPrice,
		BillingPeriod.Annual,
	)}/month for 1 year, then £${monthlyEquivalentPrice(
		fullPrice,
		BillingPeriod.Annual,
	)}/month for each year after. We'll remind you every year, 2 weeks before your renewal date.`;

const fullPrices: Partial<Record<ActiveRatePlanKey, number>> = {
	Monthly: 14,
	MonthlyPlus: 14,
	QuarterlyPlus: 60,
	Annual: 140,
	AnnualPlus: 140,
	EverydayPlus: 14,
	SixdayPlus: 14,
	WeekendPlus: 14,
	SaturdayPlus: 14,
	Sunday: 14,
};

const promotions: Partial<
	Record<ActiveRatePlanKey, PromoWithCatalogInformation>
> = {
	Monthly: promoCatalogDigitalMonthly,
	MonthlyPlus: promoCatalogDigitalMonthly,
	QuarterlyPlus: promoCatalogWeeklyQuarterly,
	Annual: promoCatalogDigitalAnnual,
	AnnualPlus: promoCatalogDigitalAnnual,
	EverydayPlus: promoCatalogPrintMonthly,
	SixdayPlus: promoCatalogPrintMonthly,
	WeekendPlus: promoCatalogPrintMonthly,
	SaturdayPlus: promoCatalogPrintMonthly,
	Sunday: promoCatalogPrintMonthly,
};

describe('getRenewalTermPolicyCopy', () => {
	it.each([
		['Contribution', 'Monthly', contributionMonthly],
		['Contribution', 'Annual', digitalAndPrintAnnual],
		['GuardianAdLite', 'Monthly', digitalAndPrintMonthly],
		['SupporterPlus', 'Monthly', digitalAndPrintMonthly],
		['SupporterPlus', 'Annual', digitalAndPrintAnnual],
		['DigitalSubscription', 'Monthly', digitalAndPrintMonthly],
		['DigitalSubscription', 'Annual', digitalAndPrintAnnual],
		['GuardianWeeklyDomestic', 'MonthlyPlus', digitalAndPrintMonthly],
		['GuardianWeeklyDomestic', 'QuarterlyPlus', printQuarterly],
		['GuardianWeeklyDomestic', 'AnnualPlus', digitalAndPrintAnnual],
		['HomeDelivery', 'EverydayPlus', digitalAndPrintMonthly],
		['HomeDelivery', 'SixdayPlus', digitalAndPrintMonthly],
		['HomeDelivery', 'WeekendPlus', digitalAndPrintMonthly],
		['HomeDelivery', 'SaturdayPlus', digitalAndPrintMonthly],
		['HomeDelivery', 'Sunday', digitalAndPrintMonthly],
		['SubscriptionCard', 'EverydayPlus', digitalAndPrintMonthly],
		['SubscriptionCard', 'SixdayPlus', digitalAndPrintMonthly],
		['SubscriptionCard', 'WeekendPlus', digitalAndPrintMonthly],
		['SubscriptionCard', 'SaturdayPlus', digitalAndPrintMonthly],
		['SubscriptionCard', 'Sunday', digitalAndPrintMonthly],
	] as const)(
		'renewal term for product:%s ratePlan:%s',
		(product, ratePlan, policy) => {
			const fullPrice = fullPrices[ratePlan] ?? 0;
			const result =
				getRenewalTermPolicy(
					product as ActiveProductKey,
					ratePlan as ActiveRatePlanKey,
					fullPrice,
				) ?? '';
			expect(result).toBe(policy(fullPrice));
		},
	);

	it.each([
		['GuardianAdLite', 'Monthly', promoDigitalMonthly],
		['SupporterPlus', 'Monthly', promoDigitalMonthly],
		['SupporterPlus', 'Annual', promotionAnnual],
		['DigitalSubscription', 'Monthly', promoDigitalMonthly],
		['DigitalSubscription', 'Annual', promotionAnnual],
		['GuardianWeeklyDomestic', 'MonthlyPlus', promoPrintMonthly],
		['GuardianWeeklyDomestic', 'QuarterlyPlus', promoPrintQuarterly],
		['GuardianWeeklyDomestic', 'AnnualPlus', promotionAnnual],
		['HomeDelivery', 'EverydayPlus', promoPrintMonthly],
		['HomeDelivery', 'SixdayPlus', promoPrintMonthly],
		['HomeDelivery', 'WeekendPlus', promoPrintMonthly],
		['HomeDelivery', 'SaturdayPlus', promoPrintMonthly],
		['HomeDelivery', 'Sunday', promoPrintMonthly],
		['SubscriptionCard', 'EverydayPlus', promoPrintMonthly],
		['SubscriptionCard', 'SixdayPlus', promoPrintMonthly],
		['SubscriptionCard', 'WeekendPlus', promoPrintMonthly],
		['SubscriptionCard', 'SaturdayPlus', promoPrintMonthly],
		['SubscriptionCard', 'Sunday', promoPrintMonthly],
	] as const)(
		'promotional renewal term for product:%s ratePlan:%s',
		(product, ratePlan, policy) => {
			const fullPrice = fullPrices[ratePlan] ?? 0;
			const promotion = promotions[ratePlan];
			if (!promotion) {
				throw new Error(`Missing promotion for rate plan: ${ratePlan}`);
			}
			const result = getRenewalTermPolicy(
				product,
				ratePlan,
				fullPrice,
				promotion,
			);
			const discountedPrice = getPromotionDiscountedPrice(
				promotion,
				fullPrice,
				ratePlanToBillingPeriod(ratePlan),
			);
			const expiry = getPromotionExpiryDate(
				product,
				ratePlan,
				promotion.discount?.durationMonths ?? 0,
			);
			expect(result).toBe(
				policy(fullPrice, discountedPrice, formatUserDate(expiry)),
			);
		},
	);

	describe('getPromotionExpiryDate', () => {
		const startDate = new Date(2026, 11, 1);
		const sixMonths = new Date(2027, 5, 1);
		const sixMonthsPlus15days = new Date(2027, 5, 16);
		const oneYear = new Date(2027, 11, 1);
		const weeklySixMonths = new Date(2027, 5, 11);
		const weeklyAnnual = new Date(2027, 11, 11);
		const homeDeliveryMon = new Date(2027, 5, 4);
		const homeDeliverySat = new Date(2027, 5, 5);
		const homeDeliverySun = new Date(2027, 5, 6);
		const subsCardMon = new Date(2027, 5, 10);
		const subsCardSat = new Date(2027, 5, 12);
		const subsCardSun = new Date(2027, 5, 13);

		beforeEach(() => {
			jest.useFakeTimers().setSystemTime(startDate);
		});

		afterEach(() => {
			jest.useRealTimers();
		});
		it.each([
			[
				'GuardianAdLite',
				'Monthly',
				promoCatalogDigitalMonthly,
				sixMonthsPlus15days,
			],
			['SupporterPlus', 'Monthly', promoCatalogDigitalMonthly, sixMonths],
			['SupporterPlus', 'Annual', promoCatalogDigitalAnnual, oneYear],
			['DigitalSubscription', 'Monthly', promoCatalogDigitalMonthly, sixMonths],
			['DigitalSubscription', 'Annual', promoCatalogDigitalAnnual, oneYear],
			[
				'GuardianWeeklyDomestic',
				'MonthlyPlus',
				promoCatalogPrintMonthly,
				weeklySixMonths,
			],
			[
				'GuardianWeeklyDomestic',
				'QuarterlyPlus',
				promoCatalogWeeklyQuarterly,
				weeklySixMonths,
			],
			[
				'GuardianWeeklyDomestic',
				'AnnualPlus',
				promoCatalogWeeklyAnnual,
				weeklyAnnual,
			],
			[
				'HomeDelivery',
				'EverydayPlus',
				promoCatalogPrintMonthly,
				homeDeliveryMon,
			],
			['HomeDelivery', 'SixdayPlus', promoCatalogPrintMonthly, homeDeliveryMon],
			[
				'HomeDelivery',
				'WeekendPlus',
				promoCatalogPrintMonthly,
				homeDeliverySat,
			],
			[
				'HomeDelivery',
				'SaturdayPlus',
				promoCatalogPrintMonthly,
				homeDeliverySat,
			],
			['HomeDelivery', 'Sunday', promoCatalogPrintMonthly, homeDeliverySun],
			[
				'SubscriptionCard',
				'EverydayPlus',
				promoCatalogPrintMonthly,
				subsCardMon,
			],
			['SubscriptionCard', 'SixdayPlus', promoCatalogPrintMonthly, subsCardMon],
			[
				'SubscriptionCard',
				'WeekendPlus',
				promoCatalogPrintMonthly,
				subsCardSat,
			],
			[
				'SubscriptionCard',
				'SaturdayPlus',
				promoCatalogPrintMonthly,
				subsCardSat,
			],
			['SubscriptionCard', 'Sunday', promoCatalogPrintMonthly, subsCardSun],
		] as const)(
			`calculate promotion expiry date for product:%s rateplan:%s`,
			(...[product, ratePlan, promotion, promoExpiryDate]) => {
				const result = getPromotionExpiryDate(
					product,
					ratePlan,
					promotion.discount?.durationMonths ?? 0,
				);
				expect(result).toEqual(promoExpiryDate);
			},
		);
	});
});
