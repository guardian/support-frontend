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
import {
	getDiscountPrice,
	getFullPrices,
	getPromotions,
} from '../../../stories/checkouts/preContactInformation.stories';
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
const promotionPrintDelivery = (firstPayment: number) =>
	`Cancel anytime, via your account. Cancel within 14 days of receiving your first issue or your first payment at £${firstPayment} and receive a full refund of that payment. See more about your cooling-off rights in your full pre-contract information here.`;
const promotionPrintSubscription = (firstPayment: number) =>
	`Cancel anytime, via your account. Cancel within 14 days of receiving your subscription card or your first payment at £${firstPayment} and receive a full refund of that payment. See more about your cooling-off rights in your full pre-contract information here.`;

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
		promotionDigitalMonthly(getDiscountPrice('GuardianAdLite', 'Monthly')),
		guardianAdLiteTermsLink,
	],
	['GuardianAdLite', 'Annual', undefined, undefined, undefined],
	[
		'SupporterPlus',
		'Monthly',
		digitalMonthly,
		promotionDigitalMonthly(getDiscountPrice('SupporterPlus', 'Monthly')),
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
		'OneYearStudent',
		studentAnnual,
		studentAnnual,
		supporterPlusTermsLink,
	],
	[
		'DigitalSubscription',
		'Monthly',
		digitalMonthly,
		promotionDigitalMonthly(getDiscountPrice('DigitalSubscription', 'Monthly')),
		digitalPlusTermsLink,
	],
	[
		'DigitalSubscription',
		'Annual',
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
		promotionPrintDelivery(
			getDiscountPrice('GuardianWeeklyDomestic', 'MonthlyPlus'),
		),
		guardianWeeklyTermsLink,
	],
	[
		'GuardianWeeklyDomestic',
		'QuarterlyPlus',
		printDelivery,
		promotionPrintDelivery(
			getDiscountPrice('GuardianWeeklyDomestic', 'QuarterlyPlus'),
		),
		guardianWeeklyTermsLink,
	],
	[
		'GuardianWeeklyDomestic',
		'AnnualPlus',
		printDelivery,
		promotionPrintDelivery(
			getDiscountPrice('GuardianWeeklyDomestic', 'AnnualPlus'),
		),
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
		'HomeDelivery',
		'EverydayPlus',
		printDelivery,
		promotionPrintDelivery(getDiscountPrice('HomeDelivery', 'EverydayPlus')),
		paperTermsLink,
	],
	[
		'HomeDelivery',
		'SixdayPlus',
		printDelivery,
		promotionPrintDelivery(getDiscountPrice('HomeDelivery', 'SixdayPlus')),
		paperTermsLink,
	],
	[
		'HomeDelivery',
		'WeekendPlus',
		printDelivery,
		promotionPrintDelivery(getDiscountPrice('HomeDelivery', 'WeekendPlus')),
		paperTermsLink,
	],
	[
		'HomeDelivery',
		'SaturdayPlus',
		printDelivery,
		promotionPrintDelivery(getDiscountPrice('HomeDelivery', 'SaturdayPlus')),
		paperTermsLink,
	],
	['HomeDelivery', 'Sunday', printDelivery, printDelivery, observerLinks.TERMS],
	[
		'SubscriptionCard',
		'EverydayPlus',
		printSubscription,
		promotionPrintSubscription(
			getDiscountPrice('SubscriptionCard', 'EverydayPlus'),
		),
		paperTermsLink,
	],
	[
		'SubscriptionCard',
		'SixdayPlus',
		printSubscription,
		promotionPrintSubscription(
			getDiscountPrice('SubscriptionCard', 'SixdayPlus'),
		),
		paperTermsLink,
	],
	[
		'SubscriptionCard',
		'WeekendPlus',
		printSubscription,
		promotionPrintSubscription(
			getDiscountPrice('SubscriptionCard', 'WeekendPlus'),
		),
		paperTermsLink,
	],
	[
		'SubscriptionCard',
		'SaturdayPlus',
		printSubscription,
		promotionPrintSubscription(
			getDiscountPrice('SubscriptionCard', 'SaturdayPlus'),
		),
		paperTermsLink,
	],
	[
		'SubscriptionCard',
		'Sunday',
		printSubscription,
		printSubscription,
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
			const result = getCancellationPolicy(
				product,
				ratePlan,
				getFullPrices(product, ratePlan),
			);
			expectPolicy(result[product]?.[ratePlan], copy, termsLink);
		},
	);

	it.each(policyCases)(
		'promotional cancellation policy for product: %s ratePlan: %s',
		(product, ratePlan, _copy, promotionalCopy, termsLink) => {
			const result = getCancellationPolicy(
				product,
				ratePlan,
				getFullPrices(product, ratePlan),
				getPromotions(product, ratePlan),
			);
			expectPolicy(result[product]?.[ratePlan], promotionalCopy, termsLink);
		},
	);
});
