import { BillingPeriod } from '@modules/product/billingPeriod';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { formatUserDate } from 'helpers/utilities/dateConversions';
import { monthlyEquivalentPrice } from './monthlyEquivalentPrice';
import type { Promotion } from './promotions';
import {
	getPromotionExpiryDate,
	getRenewalTermPolicy,
} from './renewalTermPolicies';

const contributionMonthly = (fullPrice: number) =>
	`We will attempt to take payment of £${fullPrice}, on the 3rd day of every month, from now until you cancel your payment. Payments may take up to 6 days to be recorded in your bank account. You can change how much you give or cancel your payment at any time.`;
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

const promoAnnual = (
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
const discountPrices: Partial<Record<ActiveRatePlanKey, number>> = {
	Monthly: 7,
	MonthlyPlus: 7,
	QuarterlyPlus: 30,
	Annual: 90,
	AnnualPlus: 90,
	EverydayPlus: 7,
	SixdayPlus: 7,
	WeekendPlus: 7,
	SaturdayPlus: 7,
	Sunday: 7,
};
const promotionMonthly: Promotion = {
	name: 'MONTHLY',
	description: '',
	promoCode: 'MONTHLY',
	isIntroductoryPricing: true,
	numberOfDiscountedPeriods: 6,
	discountedPrice: discountPrices['Monthly'],
};
const promotionQuarterly: Promotion = {
	name: 'QUARTERLY',
	description: '',
	promoCode: 'QUARTERLY',
	isIntroductoryPricing: true,
	numberOfDiscountedPeriods: 2,
	discountedPrice: discountPrices['QuarterlyPlus'],
};
const promotionAnnual: Promotion = {
	name: 'ANNUAL',
	description: '',
	promoCode: 'ANNUAL',
	isIntroductoryPricing: true,
	numberOfDiscountedPeriods: 1,
	discountedPrice: discountPrices['Annual'],
};
const promotions: Partial<Record<ActiveRatePlanKey, Promotion>> = {
	Monthly: promotionMonthly,
	MonthlyPlus: promotionMonthly,
	QuarterlyPlus: promotionQuarterly,
	Annual: promotionAnnual,
	AnnualPlus: promotionAnnual,
	EverydayPlus: promotionMonthly,
	SixdayPlus: promotionMonthly,
	WeekendPlus: promotionMonthly,
	SaturdayPlus: promotionMonthly,
	Sunday: promotionMonthly,
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
		'renewal term for product: %s ratePlan: %s',
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
		['SupporterPlus', 'Annual', promoAnnual],
		['DigitalSubscription', 'Monthly', promoDigitalMonthly],
		['DigitalSubscription', 'Annual', promoAnnual],
		['GuardianWeeklyDomestic', 'MonthlyPlus', promoPrintMonthly],
		['GuardianWeeklyDomestic', 'QuarterlyPlus', promoPrintQuarterly],
		['GuardianWeeklyDomestic', 'AnnualPlus', promoAnnual],
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
		'promotional renewal term for product: %s ratePlan: %s',
		(product, ratePlan, policy) => {
			const fullPrice = fullPrices[ratePlan] ?? 0;
			const promotion = promotions[ratePlan];
			const result = getRenewalTermPolicy(
				product,
				ratePlan,
				fullPrice,
				promotion,
			);
			const discountPrice = discountPrices[ratePlan] ?? 0;
			const expiry = getPromotionExpiryDate(
				product,
				ratePlan,
				promotion?.numberOfDiscountedPeriods ?? 0,
			);
			expect(result).toBe(
				policy(fullPrice, discountPrice, formatUserDate(expiry)),
			);
		},
	);
});
