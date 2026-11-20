import { BillingPeriod } from '@modules/product/billingPeriod';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { formatUserDate } from 'helpers/utilities/dateConversions';
import { getDateWithOrdinal } from 'helpers/utilities/dateFormatting';
import { monthlyEquivalentPrice } from './monthlyEquivalentPrice';
import { getTestPricesAndPromotion } from './preContractInformationTestData';
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
			const { fullPrice } = getTestPricesAndPromotion(product, ratePlan);
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
			const { fullPrice, discountedPrice, promotion } =
				getTestPricesAndPromotion(product, ratePlan);
			if (!promotion) {
				throw new Error(
					`Missing promotion for product ${product} rate plan: ${ratePlan}`,
				);
			}
			const result = getRenewalTermPolicy(
				product,
				ratePlan,
				fullPrice,
				promotion,
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

	it.each([
		['Monthly', promoDigitalMonthly],
		['Annual', promotionAnnual],
	] as const)(
		'adds contribution to discounted SupporterPlus %s renewal terms after discounting',
		(ratePlan, policy) => {
			const contribution = 5;
			const { fullPrice, discountedPrice, promotion } =
				getTestPricesAndPromotion('SupporterPlus', ratePlan);
			if (!promotion) {
				throw new Error(`Missing promotion for SupporterPlus ${ratePlan}`);
			}
			const expiry = formatUserDate(
				getPromotionExpiryDate(
					'SupporterPlus',
					ratePlan,
					promotion.discount?.durationMonths ?? 0,
				),
			);
			const result = getRenewalTermPolicy(
				'SupporterPlus',
				ratePlan,
				fullPrice,
				promotion,
				contribution,
			);
			expect(result).toBe(
				policy(fullPrice + contribution, discountedPrice + contribution, expiry),
			);
		},
	);

	describe('getPromotionExpiryDate', () => {
		const startDate = new Date(2026, 11, 1);
		const sixMonths = new Date(2027, 5, 1);
		const sixMonthsPlus15days = new Date(2027, 5, 16);
		const oneYear = new Date(2027, 11, 1);
		const oneYearPlus15days = new Date(2027, 11, 16);
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
			['GuardianAdLite', 'Monthly', sixMonthsPlus15days],
			['SupporterPlus', 'Monthly', sixMonths],
			['SupporterPlus', 'Annual', oneYear],
			['DigitalSubscription', 'Monthly', sixMonthsPlus15days],
			['DigitalSubscription', 'Annual', oneYearPlus15days],
			['GuardianWeeklyDomestic', 'MonthlyPlus', weeklySixMonths],
			['GuardianWeeklyDomestic', 'QuarterlyPlus', weeklySixMonths],
			['GuardianWeeklyDomestic', 'AnnualPlus', weeklyAnnual],
			['HomeDelivery', 'EverydayPlus', homeDeliveryMon],
			['HomeDelivery', 'SixdayPlus', homeDeliveryMon],
			['HomeDelivery', 'WeekendPlus', homeDeliverySat],
			['HomeDelivery', 'SaturdayPlus', homeDeliverySat],
			['HomeDelivery', 'Sunday', homeDeliverySun],
			['SubscriptionCard', 'EverydayPlus', subsCardMon],
			['SubscriptionCard', 'SixdayPlus', subsCardMon],
			['SubscriptionCard', 'WeekendPlus', subsCardSat],
			['SubscriptionCard', 'SaturdayPlus', subsCardSat],
			['SubscriptionCard', 'Sunday', subsCardSun],
		] as const)(
			`calculate promotion expiry date for product:%s rateplan:%s`,
			(...[product, ratePlan, promoExpiryDate]) => {
				const { promotion } = getTestPricesAndPromotion(product, ratePlan);
				if (!promotion) {
					throw new Error(
						`Missing promotion for product ${product} rate plan: ${ratePlan}`,
					);
				}
				const result = getPromotionExpiryDate(
					product,
					ratePlan,
					promotion.discount?.durationMonths ?? 0,
				);
				expect(result).toEqual(promoExpiryDate);
			},
		);
	});
	describe('getPromotionExpiryDate (month end)', () => {
		const monthEndDate = new Date(2026, 7, 31);
		const sixMonths = new Date(2027, 1, 28);

		beforeEach(() => {
			jest.useFakeTimers().setSystemTime(monthEndDate);
		});

		afterEach(() => {
			jest.useRealTimers();
		});
		it.each([['SupporterPlus', 'Monthly', sixMonths]] as const)(
			`calculate promotion expiry date for product:%s rateplan:%s`,
			(...[product, ratePlan, promoExpiryDate]) => {
				const { promotion } = getTestPricesAndPromotion(product, ratePlan);
				if (!promotion) {
					throw new Error(
						`Missing promotion for product ${product} rate plan: ${ratePlan}`,
					);
				}
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
