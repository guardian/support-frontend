import { BillingPeriod } from '@modules/product/billingPeriod';
import { render, screen } from '@testing-library/react';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { ActivePaperProductOptions } from 'helpers/productCatalogToProductOption';
import { formatUserDate } from 'helpers/utilities/dateConversions';
import { getDateWithOrdinal } from 'helpers/utilities/dateFormatting';
import { monthlyEquivalentPrice } from './monthlyEquivalentPrice';
import { getTestPricesAndPromotion } from './preContractInformationTestData';
import {
	getFirstDeliveryDateInclDigitalSubscription,
	getPromotionExpiryDate,
	getRenewalTermPolicy,
} from './renewalTermPolicies';

type RenewalTestProps = {
	fullPrice: number;
	discountPrice: number;
	expiryDate: string;
	deliveryDate: string;
};
const contributionMonthly = (test: RenewalTestProps) =>
	`We will attempt to take payment of £${
		test.fullPrice
	}, on the ${getDateWithOrdinal(
		new Date(),
	)} day of every month, from now until you cancel your payment. Payments may take up to 6 days to be recorded in your bank account. You can change how much you give or cancel your payment at any time.`;

const digitalMonthly = (test: RenewalTestProps) =>
	`Subscription auto-renews monthly. Pay £${test.fullPrice}/month, unless you cancel. We'll remind you every 6 months, 1 week before your subscription auto-renews. To stop auto-renewal, cancel via Manage My Account before your next renewal date.`;
const printMonthly = (test: RenewalTestProps) =>
	`Subscription auto-renews monthly. Your first payment will be taken on ${test.deliveryDate}. You'll pay £${test.fullPrice}/month, unless you cancel. We'll remind you every 6 months, 1 week before your subscription auto-renews. To stop auto-renewal, cancel via Manage My Account before your next renewal date.`;
const digitalAnnual = (test: RenewalTestProps) =>
	`Subscription auto-renews annually. Pay £${
		test.fullPrice
	}/year, unless you cancel (if payments were due monthly this would be £${monthlyEquivalentPrice(
		test.fullPrice,
		BillingPeriod.Annual,
	)}/month). We'll send you a reminder 14 and 7 days before each renewal. To stop auto-renewal, cancel via Manage My Account before your next renewal date.`;
const printAnnual = (test: RenewalTestProps) =>
	`Subscription auto-renews annually. Your first payment will be taken on ${
		test.deliveryDate
	}. You'll pay £${
		test.fullPrice
	}/year, unless you cancel (if payments were due monthly this would be £${monthlyEquivalentPrice(
		test.fullPrice,
		BillingPeriod.Annual,
	)}/month). We'll send you a reminder 14 and 7 days before each renewal. To stop auto-renewal, cancel via Manage My Account before your next renewal date.`;
const printQuarterly = (test: RenewalTestProps) =>
	`Subscription auto-renews quarterly. Your first payment will be taken on ${
		test.deliveryDate
	}. You'll pay £${
		test.fullPrice
	}/quarter, unless you cancel (if payments were due monthly this would be £${monthlyEquivalentPrice(
		test.fullPrice,
		BillingPeriod.Quarterly,
	)}/month). We'll remind you every 6 months, 1 week before your subscription auto-renews. To stop auto-renewal, cancel via Manage My Account before your next renewal date.`;

const promoDigitalMonthly = (test: RenewalTestProps) =>
	`Subscription auto-renews monthly. Pay £${test.discountPrice}/month for 6 months, then £${test.fullPrice}/month from ${test.expiryDate}, unless you cancel. We'll remind you 1 week before your first higher payment, then every 6 months, 1 week before your subscription auto-renews. To stop auto-renewal, cancel via Manage My Account before your next renewal date.`;
const promoPrintMonthly = (test: RenewalTestProps) =>
	`Subscription auto-renews monthly. Your first payment will be taken on ${test.deliveryDate}. You'll pay £${test.discountPrice}/month for 6 months, then £${test.fullPrice}/month from ${test.expiryDate}, unless you cancel. We'll remind you 1 week before your first higher payment, then every 6 months, 1 week before your subscription auto-renews. To stop auto-renewal, cancel via Manage My Account before your next renewal date.`;
const promoPrintQuarterly = (test: RenewalTestProps) =>
	`Subscription auto-renews quarterly. Your first payment will be taken on ${
		test.deliveryDate
	}. You'll pay £${test.discountPrice}/quarter for 2 quarters, then £${
		test.fullPrice
	}/quarter from ${
		test.expiryDate
	}, unless you cancel (if payments were due monthly this would be £${monthlyEquivalentPrice(
		test.discountPrice,
		BillingPeriod.Quarterly,
	)}/month for 2 quarters, then £${monthlyEquivalentPrice(
		test.fullPrice,
		BillingPeriod.Quarterly,
	)}/month). We'll remind you 1 week before your first higher payment, then every 6 months, 1 week before your subscription auto-renews. To stop auto-renewal, cancel via Manage My Account before your next renewal date.`;

const promoDigitalAnnual = (test: RenewalTestProps) =>
	`Subscription auto-renews annually. Pay £${
		test.discountPrice
	}/year for 1 year, then £${test.fullPrice}/year from ${
		test.expiryDate
	}, unless you cancel (if payments were due monthly this would be £${monthlyEquivalentPrice(
		test.discountPrice,
		BillingPeriod.Annual,
	)}/month for 1 year, then £${monthlyEquivalentPrice(
		test.fullPrice,
		BillingPeriod.Annual,
	)}/month). We'll send you a reminder 14 and 7 days before each renewal. To stop auto-renewal, cancel via Manage My Account before your next renewal date.`;

const promoPrintAnnual = (test: RenewalTestProps) =>
	`Subscription auto-renews annually. Your first payment will be taken on ${
		test.deliveryDate
	}. You'll pay £${test.discountPrice}/year for 1 year, then £${
		test.fullPrice
	}/year from ${
		test.expiryDate
	}, unless you cancel (if payments were due monthly this would be £${monthlyEquivalentPrice(
		test.discountPrice,
		BillingPeriod.Annual,
	)}/month for 1 year, then £${monthlyEquivalentPrice(
		test.fullPrice,
		BillingPeriod.Annual,
	)}/month). We'll send you a reminder 14 and 7 days before each renewal. To stop auto-renewal, cancel via Manage My Account before your next renewal date.`;

const expectPolicy = (
	policy: JSX.Element | undefined,
	copy?: string,
	termsLink?: string,
) => {
	if (copy === undefined) {
		expect(policy).toBeUndefined();
		return;
	}

	const { container } = render(policy);
	expect(container.textContent).toMatchSnapshot();
	expect(container.textContent).toBe(copy);
	if (termsLink) {
		expect(
			screen.getByRole('link', { name: /^(here|terms|Terms & Conditions)$/ }),
		).toHaveAttribute('href', termsLink);
	}
};

describe('getRenewalTermPolicyCopy', () => {
	it.each([
		['Contribution', 'Monthly', contributionMonthly],
		['Contribution', 'Annual', digitalAnnual],
		['GuardianAdLite', 'Monthly', digitalMonthly],
		['SupporterPlus', 'Monthly', digitalMonthly],
		['SupporterPlus', 'Annual', digitalAnnual],
		['DigitalSubscription', 'Monthly', digitalMonthly],
		['DigitalSubscription', 'Annual', digitalAnnual],
		['GuardianWeeklyDomestic', 'MonthlyPlus', printMonthly],
		['GuardianWeeklyDomestic', 'QuarterlyPlus', printQuarterly],
		['GuardianWeeklyDomestic', 'AnnualPlus', printAnnual],
		['HomeDelivery', 'EverydayPlus', printMonthly],
		['HomeDelivery', 'SixdayPlus', printMonthly],
		['HomeDelivery', 'WeekendPlus', printMonthly],
		['HomeDelivery', 'SaturdayPlus', printMonthly],
		['HomeDelivery', 'Sunday', printMonthly],
		['SubscriptionCard', 'EverydayPlus', printMonthly],
		['SubscriptionCard', 'SixdayPlus', printMonthly],
		['SubscriptionCard', 'WeekendPlus', printMonthly],
		['SubscriptionCard', 'SaturdayPlus', printMonthly],
		['SubscriptionCard', 'Sunday', printMonthly],
	] as const)(
		'renewal term for product:%s ratePlan:%s',
		(product, ratePlan, policy) => {
			const { fullPrice } = getTestPricesAndPromotion(product, ratePlan);
			const deliveryDate = formatUserDate(
				getFirstDeliveryDateInclDigitalSubscription(
					product,
					ratePlan as ActivePaperProductOptions,
				) ?? new Date(),
			);
			const result = getRenewalTermPolicy(
				product as ActiveProductKey,
				ratePlan as ActiveRatePlanKey,
				fullPrice,
			);
			expectPolicy(
				result,
				policy({
					fullPrice,
					discountPrice: fullPrice,
					expiryDate: deliveryDate,
					deliveryDate,
				}),
			);
		},
	);

	it.each([
		['GuardianAdLite', 'Monthly', promoDigitalMonthly],
		['SupporterPlus', 'Monthly', promoDigitalMonthly],
		['SupporterPlus', 'Annual', promoDigitalAnnual],
		['DigitalSubscription', 'Monthly', promoDigitalMonthly],
		['DigitalSubscription', 'Annual', promoDigitalAnnual],
		['GuardianWeeklyDomestic', 'MonthlyPlus', promoPrintMonthly],
		['GuardianWeeklyDomestic', 'QuarterlyPlus', promoPrintQuarterly],
		['GuardianWeeklyDomestic', 'AnnualPlus', promoPrintAnnual],
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
			const {
				fullPrice,
				discountedPrice: discountPrice,
				promotion,
			} = getTestPricesAndPromotion(product, ratePlan);
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
			const expiryDate = formatUserDate(
				getPromotionExpiryDate(
					product,
					ratePlan,
					promotion.discount?.durationMonths ?? 0,
				),
			);
			const deliveryDate = formatUserDate(
				getFirstDeliveryDateInclDigitalSubscription(
					product,
					ratePlan as ActivePaperProductOptions,
				) ?? new Date(),
			);
			expectPolicy(
				result,
				policy({
					fullPrice,
					discountPrice,
					expiryDate,
					deliveryDate,
				}),
			);
		},
	);

	it.each([
		['Monthly', promoDigitalMonthly],
		['Annual', promoDigitalAnnual],
	] as const)(
		'adds contribution to discounted SupporterPlus %s renewal terms after discounting',
		(ratePlan, policy) => {
			const contribution = 5;
			const { fullPrice, discountedPrice, promotion } =
				getTestPricesAndPromotion('SupporterPlus', ratePlan);
			if (!promotion) {
				throw new Error(`Missing promotion for SupporterPlus ${ratePlan}`);
			}
			const expiryDate = formatUserDate(
				getPromotionExpiryDate(
					'SupporterPlus',
					ratePlan,
					promotion.discount?.durationMonths ?? 0,
				),
			);
			const deliveryDate = formatUserDate(
				getFirstDeliveryDateInclDigitalSubscription(
					'SupporterPlus',
					ratePlan as ActivePaperProductOptions,
				) ?? new Date(),
			);
			const result = getRenewalTermPolicy(
				'SupporterPlus',
				ratePlan,
				fullPrice,
				promotion,
				contribution,
			);
			expectPolicy(
				result,
				policy({
					fullPrice: fullPrice + contribution,
					discountPrice: discountedPrice + contribution,
					expiryDate,
					deliveryDate,
				}),
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
