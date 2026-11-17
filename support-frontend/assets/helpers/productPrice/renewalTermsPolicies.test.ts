import { BillingPeriod } from '@modules/product/billingPeriod';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { monthlyEquivalentPrice } from './monthlyEquivalentPrice';
import type { Promotion } from './promotions';
import {
	getPromotionExpiryDate,
	getRenewalTermPolicy,
	promotionAnnual,
	promotionDigitalMonthly,
	promotionPrintMonthly,
	promotionPrintQuarterly,
} from './renewalTermPolicies';

const policyContributionMonthly = (firstPayment: number) =>
	`We will attempt to take payment of £${firstPayment}, on the 3rd day of every month, from now until you cancel your payment. Payments may take up to 6 days to be recorded in your bank account. You can change how much you give or cancel your payment at any time.`;
const policyDigitalAndPrintMonthly = (firstPayment: number) =>
	`Subscription auto-renews monthly. Pay £${firstPayment}/month, unless you cancel. We'll remind you every 6 months, 2 weeks before your renewal date.`;
const policyDigitalAndPrintAnnual = (firstPayment: number) =>
	`Subscription auto-renews annually. Pay £${firstPayment}/year, unless you cancel. Equivalent to £${monthlyEquivalentPrice(
		firstPayment,
		BillingPeriod.Annual,
	)}/month. We'll remind you every year, 2 weeks before your renewal date.`;
const policyPrintQuarterly = (firstPayment: number) =>
	`Subscription auto-renews quarterly. Pay £${firstPayment}/quarter, unless you cancel. Equivalent to £${monthlyEquivalentPrice(
		firstPayment,
		BillingPeriod.Quarterly,
	)}/month for each quarter. We'll remind you every 6 months, 2 weeks before your renewal date.`;

// const promotionDigitalMonthlyPolicyCopy =
// 	"Subscription auto-renews monthly. Pay £{discountedPrice}/month for {periods} {periodName}, then £{fullPrice}/month from {expiry}, unless you cancel. We'll remind you 2 weeks before {expiry} then every 6 months, 2 weeks before your renewal date.";
// const promotionPrintMonthlyPolicyCopy =
// 	"Subscription auto-renews monthly. Pay £{discountedPrice}/month for the first {periods} {periodName}, then £{{fullPrice}}/month from {expiry}, unless you cancel. We'll remind you 2 weeks before {expiry} then every 6 months, 2 weeks before your renewal date.";
// const promotionPrintQuarterlyPolicyCopy =
// 	"Subscription auto-renews quarterly. Pay £{discountedPrice}/quarter for {periods} ${periodName}, then £{fullPrice}/quarter from {expiry}, unless you cancel. Equivalent to £{discountMonthlyEquivalent}/month for {periods} ${periodName}, then £{fullPrice}/month for each quarter after. We'll remind you 2 weeks before {expiry} then every 6 months, 2 weeks before your renewal date.";
// const promotionAnnualPolicyCopy = (firstPayment: number) =>
// 	`Subscription auto-renews annually. Pay £${firstPayment}/year for {periods} {periodName}, then £{fullPrice}/year from {expiry}, unless you cancel. Equivalent to £{discountMonthlyEquivalent}/month for {periods} {periodName}, then £{monthlyEquivalent}/month for each year after. We'll remind you every year, 2 weeks before your renewal date.`;

const testPrices: Partial<Record<ActiveRatePlanKey, number>> = {
	Monthly: 14,
	MonthlyPlus: 14,
	Quarterly: 60,
	QuarterlyPlus: 60,
	Annual: 140,
	AnnualPlus: 140,
	EverydayPlus: 14,
	SixdayPlus: 14,
	Sunday: 14,
};

const digitalMonthlyFullPrice = 14;
const digitalQuarterlyFullPrice = 57;
const digitalAnnualFullPrice = 140;
const digitalStudentFullPrice = 9;
const printMonthlyFullPrice = 19;
const printQuarterlyFullPrice = 57;
const printAnnualFullPrice = 300;

describe('getRenewalTermPolicyCopy', () => {
	it.each([
		['Contribution', 'Monthly', policyContributionMonthly],
		['Contribution', 'Annual', policyDigitalAndPrintAnnual],
		['GuardianAdLite', 'Monthly', policyDigitalAndPrintMonthly],
		['SupporterPlus', 'Monthly', policyDigitalAndPrintMonthly],
		['SupporterPlus', 'Annual', policyDigitalAndPrintAnnual],
		['DigitalSubscription', 'Monthly', policyDigitalAndPrintMonthly],
		['DigitalSubscription', 'Annual', policyDigitalAndPrintAnnual],
		['GuardianWeeklyDomestic', 'MonthlyPlus', policyDigitalAndPrintMonthly],
		['GuardianWeeklyDomestic', 'QuarterlyPlus', policyPrintQuarterly],
		['GuardianWeeklyDomestic', 'AnnualPlus', policyDigitalAndPrintAnnual],
		['HomeDelivery', 'SixdayPlus', policyDigitalAndPrintMonthly],
		['HomeDelivery', 'Sunday', policyDigitalAndPrintMonthly],
		['SubscriptionCard', 'EverydayPlus', policyDigitalAndPrintMonthly],
	] as const)(
		'renewal term for product: %s ratePlan: %s',
		(product, ratePlan, policy) => {
			const fullPrice = testPrices[ratePlan] ?? 0;
			const result =
				getRenewalTermPolicy(
					product as ActiveProductKey,
					ratePlan as ActiveRatePlanKey,
					fullPrice,
				) ?? '';
			expect(result).toBe(policy(fullPrice));
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
		[
			'Contribution',
			'Monthly',
			digitalMonthlyFullPrice,
			promotionMonthly,
			undefined,
		],
		['Contribution', 'Annual', digitalAnnualFullPrice, promoAnnual, undefined],
		[
			'GuardianAdLite',
			'Monthly',
			digitalMonthlyFullPrice,
			promotionMonthly,
			promotionDigitalMonthly,
		],
		[
			'SupporterPlus',
			'Monthly',
			digitalMonthlyFullPrice,
			promotionMonthly,
			promotionDigitalMonthly,
		],
		[
			'SupporterPlus',
			'MonthlyTaxExclusive',
			digitalMonthlyFullPrice,
			promotionMonthly,
			promotionDigitalMonthly,
		],
		[
			'SupporterPlus',
			'Annual',
			digitalAnnualFullPrice,
			promoAnnual,
			promotionAnnual,
		],
		[
			'SupporterPlus',
			'AnnualTaxExclusive',
			digitalAnnualFullPrice,
			promoAnnual,
			promotionAnnual,
		],
		[
			'SupporterPlus',
			'OneYearStudent',
			digitalStudentFullPrice,
			promoAnnual,
			undefined,
		],
		[
			'DigitalSubscription',
			'Monthly',
			digitalMonthlyFullPrice,
			promotionMonthly,
			promotionDigitalMonthly,
		],
		[
			'DigitalSubscription',
			'MonthlyTaxExclusive',
			digitalMonthlyFullPrice,
			promotionMonthly,
			promotionDigitalMonthly,
		],
		[
			'DigitalSubscription',
			'Annual',
			digitalAnnualFullPrice,
			promoAnnual,
			promotionAnnual,
		],
		[
			'DigitalSubscription',
			'AnnualTaxExclusive',
			digitalAnnualFullPrice,
			promoAnnual,
			promotionAnnual,
		],
		[
			'DigitalSubscription',
			'ThreeMonthGift',
			digitalQuarterlyFullPrice,
			promotionQuarterly,
			undefined,
		],
		[
			'DigitalSubscription',
			'OneYearGift',
			digitalAnnualFullPrice,
			promoAnnual,
			undefined,
		],
		[
			'GuardianWeeklyDomestic',
			'MonthlyPlus',
			printMonthlyFullPrice,
			promotionMonthly,
			promotionPrintMonthly,
		],
		[
			'GuardianWeeklyDomestic',
			'QuarterlyPlus',
			printQuarterlyFullPrice,
			promotionQuarterly,
			promotionPrintQuarterly,
		],
		[
			'GuardianWeeklyDomestic',
			'AnnualPlus',
			printAnnualFullPrice,
			promoAnnual,
			promotionAnnual,
		],
		[
			'GuardianWeeklyDomestic',
			'ThreeMonthGift',
			printQuarterlyFullPrice,
			promotionQuarterly,
			undefined,
		],
		[
			'GuardianWeeklyDomestic',
			'OneYearGift',
			printAnnualFullPrice,
			promoAnnual,
			undefined,
		],
		[
			'GuardianWeeklyRestOfWorld',
			'MonthlyPlus',
			printAnnualFullPrice,
			promotionMonthly,
			promotionPrintMonthly,
		],
		[
			'GuardianWeeklyRestOfWorld',
			'QuarterlyPlus',
			printQuarterlyFullPrice,
			promotionQuarterly,
			promotionPrintQuarterly,
		],
		[
			'GuardianWeeklyRestOfWorld',
			'AnnualPlus',
			printAnnualFullPrice,
			promoAnnual,
			promotionAnnual,
		],
		[
			'GuardianWeeklyRestOfWorld',
			'ThreeMonthGift',
			printQuarterlyFullPrice,
			promotionQuarterly,
			undefined,
		],
		[
			'GuardianWeeklyRestOfWorld',
			'OneYearGift',
			printAnnualFullPrice,
			promoAnnual,
			undefined,
		],
		[
			'HomeDelivery',
			'EverydayPlus',
			printMonthlyFullPrice,
			promotionMonthly,
			promotionPrintMonthly,
		],
		[
			'HomeDelivery',
			'SixdayPlus',
			printMonthlyFullPrice,
			promotionMonthly,
			promotionPrintMonthly,
		],
		[
			'HomeDelivery',
			'WeekendPlus',
			printMonthlyFullPrice,
			promotionMonthly,
			promotionPrintMonthly,
		],
		[
			'HomeDelivery',
			'SaturdayPlus',
			printMonthlyFullPrice,
			promotionMonthly,
			promotionPrintMonthly,
		],
		[
			'HomeDelivery',
			'Sunday',
			printMonthlyFullPrice,
			promotionMonthly,
			promotionPrintMonthly,
		],
		[
			'SubscriptionCard',
			'EverydayPlus',
			printMonthlyFullPrice,
			promotionMonthly,
			promotionPrintMonthly,
		],
		[
			'SubscriptionCard',
			'SixdayPlus',
			printMonthlyFullPrice,
			promotionMonthly,
			promotionPrintMonthly,
		],
		[
			'SubscriptionCard',
			'WeekendPlus',
			printMonthlyFullPrice,
			promotionMonthly,
			promotionPrintMonthly,
		],
		[
			'SubscriptionCard',
			'SaturdayPlus',
			printMonthlyFullPrice,
			promotionMonthly,
			promotionPrintMonthly,
		],
		[
			'SubscriptionCard',
			'Sunday',
			printMonthlyFullPrice,
			promotionMonthly,
			promotionPrintMonthly,
		],
		[
			'NationalDelivery',
			'EverydayPlus',
			printMonthlyFullPrice,
			promotionMonthly,
			undefined,
		],
		[
			'OneTimeContribution',
			'OneTime',
			printMonthlyFullPrice,
			promotionMonthly,
			undefined,
		],
	] as const)(
		'promotional renewal term for product: %s ratePlan: %s amount: %d',
		(product, ratePlan, amount, promotion, expectedPolicy) => {
			const result = getRenewalTermPolicy(product, ratePlan, amount, promotion);
			const expiry = getPromotionExpiryDate(
				product,
				ratePlan,
				promotion.numberOfDiscountedPeriods ?? 0,
			);
			expect(result).toBe(expectedPolicy?.(amount, expiry, promotion));
		},
	);
});
