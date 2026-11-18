import { render, screen } from '@testing-library/react';
import {
	digitalPlusTermsLink,
	guardianAdLiteTermsLink,
	guardianWeeklyTermsLink,
	manageAccountLink,
	observerLinks,
	paperTermsLink,
	supporterPlusTermsLink,
} from 'helpers/legal';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getCancellationPolicy } from './cancellationPolicies';

const digitalMonthly =
	'Cancel anytime, via your account. Cancel within 14 days of sign-up and receive a full refund. See more about your cooling-off rights in your full pre-contract information here.';
const digitalAnnual = `Cancel anytime, via your account. Cancel within 14 days of sign-up or each renewal and receive a full refund of your last payment. See more about your cooling-off rights in your full pre-contract information here.`;
const studentAnnual =
	"You may cancel your All-access digital subscription within 14 days of taking out the subscription. If you do, you'll receive a full refund and your subscription will stop immediately. To cancel, go to Manage My Account or see our terms. This subscription does not auto-renew.";
const printDelivery =
	'Cancel anytime, via your account. Cancel within 14 days of receiving your first issue and receive a full refund. See more about your cooling-off rights in your full pre-contract information here.';
const printSubscription =
	'Cancel anytime, via your account. Cancel within 14 days of receiving your subscription card and receive a full refund. See more about your cooling-off rights in your full pre-contract information here.';
const printGift =
	"By proceeding, you are agreeing to our Terms & Conditions. This subscription does not auto-renew. If you cancel within 14 days of sign-up, you'll receive a full refund. To cancel within 14 days of sign-up and receive a refund contact Customer Service.";
const promotionDigitalMonthly = (firstPayment: number) =>
	`Cancel anytime, via your account. Cancel within 14 days of sign-up or your first payment at £${firstPayment} and receive a full refund of your last payment. See more about your cooling-off rights in your full pre-contract information here.`;
const promotionPrintDelivery =
	'Cancel anytime, via your account. Cancel within 14 days of receiving your first issue or your first payment at £7 and receive a full refund of that payment. See more about your cooling-off rights in your full pre-contract information here.';
const promotionPrintSubscription =
	'Cancel anytime, via your account. Cancel within 14 days of receiving your subscription card or your first payment at £7 and receive a full refund of that payment. See more about your cooling-off rights in your full pre-contract information here.';

type PolicyCase = readonly [
	product: ActiveProductKey,
	ratePlan: ActiveRatePlanKey,
	copy: string | undefined,
	promotionalCopy: string | undefined,
	termsLink: string | undefined,
];

const policyCases: PolicyCase[] = [
	['Contribution', 'Monthly', undefined, undefined, undefined],
	['Contribution', 'Annual', undefined, undefined, undefined],
	['OneTimeContribution', 'OneTime', undefined, undefined, undefined],
	['NationalDelivery', 'EverydayPlus', undefined, undefined, undefined],
	[
		'GuardianAdLite',
		'Monthly',
		digitalMonthly,
		promotionDigitalMonthly(7),
		guardianAdLiteTermsLink,
	],
	['GuardianAdLite', 'Annual', undefined, undefined, undefined],
	[
		'SupporterPlus',
		'Monthly',
		digitalMonthly,
		promotionDigitalMonthly(7),
		supporterPlusTermsLink,
	],
	[
		'SupporterPlus',
		'MonthlyTaxExclusive',
		digitalMonthly,
		promotionDigitalMonthly(7),
		supporterPlusTermsLink,
	],
	[
		'SupporterPlus',
		'Annual',
		digitalAnnual,
		digitalAnnual,
		supporterPlusTermsLink,
	],
	[
		'SupporterPlus',
		'AnnualTaxExclusive',
		digitalAnnual,
		digitalAnnual,
		supporterPlusTermsLink,
	],
	[
		'SupporterPlus',
		'OneYearStudent',
		studentAnnual,
		studentAnnual,
		supporterPlusTermsLink,
	],
	[
		'DigitalSubscription',
		'Monthly',
		digitalMonthly,
		promotionDigitalMonthly(7),
		digitalPlusTermsLink,
	],
	[
		'DigitalSubscription',
		'MonthlyTaxExclusive',
		digitalMonthly,
		promotionDigitalMonthly(7),
		digitalPlusTermsLink,
	],
	[
		'DigitalSubscription',
		'Annual',
		digitalAnnual,
		digitalAnnual,
		digitalPlusTermsLink,
	],
	[
		'DigitalSubscription',
		'AnnualTaxExclusive',
		digitalAnnual,
		digitalAnnual,
		digitalPlusTermsLink,
	],
	['DigitalSubscription', 'ThreeMonthGift', undefined, undefined, undefined],
	['DigitalSubscription', 'OneYearGift', undefined, undefined, undefined],
	[
		'GuardianWeeklyDomestic',
		'MonthlyPlus',
		printDelivery,
		promotionPrintDelivery,
		guardianWeeklyTermsLink,
	],
	[
		'GuardianWeeklyDomestic',
		'QuarterlyPlus',
		printDelivery,
		promotionPrintDelivery,
		guardianWeeklyTermsLink,
	],
	[
		'GuardianWeeklyDomestic',
		'AnnualPlus',
		printDelivery,
		promotionPrintDelivery,
		guardianWeeklyTermsLink,
	],
	[
		'GuardianWeeklyDomestic',
		'ThreeMonthGift',
		printGift,
		printGift,
		guardianWeeklyTermsLink,
	],
	[
		'GuardianWeeklyDomestic',
		'OneYearGift',
		printGift,
		printGift,
		guardianWeeklyTermsLink,
	],
	[
		'GuardianWeeklyRestOfWorld',
		'MonthlyPlus',
		printDelivery,
		promotionPrintDelivery,
		guardianWeeklyTermsLink,
	],
	[
		'GuardianWeeklyRestOfWorld',
		'QuarterlyPlus',
		printDelivery,
		promotionPrintDelivery,
		guardianWeeklyTermsLink,
	],
	[
		'GuardianWeeklyRestOfWorld',
		'AnnualPlus',
		printDelivery,
		promotionPrintDelivery,
		guardianWeeklyTermsLink,
	],
	[
		'GuardianWeeklyRestOfWorld',
		'ThreeMonthGift',
		printGift,
		printGift,
		guardianWeeklyTermsLink,
	],
	[
		'GuardianWeeklyRestOfWorld',
		'OneYearGift',
		printGift,
		printGift,
		guardianWeeklyTermsLink,
	],
	[
		'HomeDelivery',
		'EverydayPlus',
		printDelivery,
		promotionPrintDelivery,
		paperTermsLink,
	],
	[
		'HomeDelivery',
		'SixdayPlus',
		printDelivery,
		promotionPrintDelivery,
		paperTermsLink,
	],
	[
		'HomeDelivery',
		'WeekendPlus',
		printDelivery,
		promotionPrintDelivery,
		paperTermsLink,
	],
	[
		'HomeDelivery',
		'SaturdayPlus',
		printDelivery,
		promotionPrintDelivery,
		paperTermsLink,
	],
	['HomeDelivery', 'Sunday', printDelivery, printDelivery, observerLinks.TERMS],
	['HomeDelivery', 'SundayPlus', printDelivery, undefined, observerLinks.TERMS],
	[
		'SubscriptionCard',
		'EverydayPlus',
		printSubscription,
		promotionPrintSubscription,
		paperTermsLink,
	],
	[
		'SubscriptionCard',
		'SixdayPlus',
		printSubscription,
		promotionPrintSubscription,
		paperTermsLink,
	],
	[
		'SubscriptionCard',
		'WeekendPlus',
		printSubscription,
		promotionPrintSubscription,
		paperTermsLink,
	],
	[
		'SubscriptionCard',
		'SaturdayPlus',
		printSubscription,
		promotionPrintSubscription,
		paperTermsLink,
	],
	[
		'SubscriptionCard',
		'Sunday',
		printSubscription,
		printSubscription,
		observerLinks.TERMS,
	],
	[
		'SubscriptionCard',
		'SundayPlus',
		printSubscription,
		undefined,
		observerLinks.TERMS,
	],
];

const expectPolicy = (
	policy: JSX.Element | undefined,
	copy: string | undefined,
	termsLink: string | undefined,
) => {
	if (copy === undefined) {
		expect(policy).toBeUndefined();
		return;
	}

	const { container } = render(policy);
	expect(container.textContent).toBe(copy);
	expect(
		screen.getByRole('link', { name: /^(here|terms|Terms & Conditions)$/ }),
	).toHaveAttribute('href', termsLink);
	if (copy !== printGift) {
		expect(
			screen.getByRole('link', { name: /^(your account|Manage My Account)$/ }),
		).toHaveAttribute('href', manageAccountLink);
	}
};

describe('getCancellationPolicy', () => {
	it.each(policyCases)(
		'cancellation policy for product: %s ratePlan: %s',
		(product, ratePlan, copy, _promotionalCopy, termsLink) => {
			const result = getCancellationPolicy(product, ratePlan);
			expectPolicy(result[product]?.[ratePlan], copy, termsLink);
		},
	);

	const promotion: Promotion = {
		name: 'INTRODUCTORY',
		description: '',
		promoCode: 'INTRODUCTORY',
		isIntroductoryPricing: true,
		numberOfDiscountedPeriods: 6,
		discountedPrice: 7,
	};
	it.each([
		...policyCases.map(
			([product, ratePlan, , promotionalCopy, termsLink]) =>
				[product, ratePlan, promotion, promotionalCopy, termsLink] as const,
		),
		[
			'SupporterPlus',
			'Monthly',
			{ ...promotion, discountedPrice: undefined },
			promotionDigitalMonthly(0),
			supporterPlusTermsLink,
		],
		[
			'SupporterPlus',
			'Monthly',
			{ ...promotion, discountedPrice: 0 },
			promotionDigitalMonthly(0),
			supporterPlusTermsLink,
		],
	] as const)(
		'promotional cancellation policy for product: %s ratePlan: %s promotion: %j',
		(product, ratePlan, promotion, copy, termsLink) => {
			const result = getCancellationPolicy(product, ratePlan, promotion);
			expectPolicy(result[product]?.[ratePlan], copy, termsLink);
		},
	);
});
