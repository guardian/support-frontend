import { render, screen } from '@testing-library/react';
import {
	digitalPlusTermsLink,
	guardianAdLiteTermsLink,
	guardianWeeklyTermsLink,
	observerLinks,
	paperTermsLink,
	supporterPlusTermsLink,
} from 'helpers/legal';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { getCancellationPolicy } from './cancellationPolicies';
import { getTestPricesAndPromotion } from './preContractInformationTestData';

const digitalMonthlyAnnual =
	'Cooling-off rights: you can cancel with immediate effect within 14 days of sign-up: see more detail here.';
const studentAnnual =
	'This subscription does not auto-renew. If you cancel within 14 days of sign-up, you will receive a full refund and your subscription will stop immediately. To cancel, go to Manage My Account or see our Terms.';
const weekly =
	'Cooling-off rights: you can cancel with immediate effect anytime from sign-up until 14 days after you receive your first magazine: see more detail here.';
const paper =
	'Cooling-off rights: you can cancel with immediate effect anytime from sign-up until 14 days after you receive or are entitled to collect your first newspaper: see more detail here.';
const weeklyGift = `This subscription does not auto-renew. If you cancel within 14 days of sign-up, you'll receive a full refund and your subscription will stop immediately. To cancel, contact Customer Service.`;
const promotionWeekly =
	'Cooling-off rights: you can cancel with immediate effect anytime from sign-up until 14 days after you receive your first magazine. You can also cancel with immediate effect within 14 days of your first higher payment: see more detail here.';
const promotionPaper = `Cooling-off rights: you can cancel with immediate effect anytime from sign-up until 14 days after you receive or are entitled to collect your first newspaper. You can also cancel with immediate effect within 14 days of your first higher payment: see more detail here.`;
const sundayObserver =
	'Cancel anytime, via your account. Cancel within 14 days of receiving your first issue and receive a full refund. See more about your cooling-off rights in your full pre-contract information here.';
const sundaySubscriptionCard =
	'Cancel anytime, via your account. Cancel within 14 days of receiving your subscription card and receive a full refund. See more about your cooling-off rights in your full pre-contract information here.';

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
		digitalMonthlyAnnual,
		digitalMonthlyAnnual,
		guardianAdLiteTermsLink,
	],
	['GuardianAdLite', 'Annual', undefined, undefined, undefined],
	[
		'SupporterPlus',
		'Monthly',
		digitalMonthlyAnnual,
		digitalMonthlyAnnual,
		supporterPlusTermsLink,
	],
	[
		'SupporterPlus',
		'Annual',
		digitalMonthlyAnnual,
		digitalMonthlyAnnual,
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
		digitalMonthlyAnnual,
		digitalMonthlyAnnual,
		digitalPlusTermsLink,
	],
	[
		'DigitalSubscription',
		'Annual',
		digitalMonthlyAnnual,
		digitalMonthlyAnnual,
		digitalPlusTermsLink,
	],
	['DigitalSubscription', 'ThreeMonthGift', undefined, undefined, undefined],
	['DigitalSubscription', 'OneYearGift', undefined, undefined, undefined],
	[
		'GuardianWeeklyDomestic',
		'MonthlyPlus',
		weekly,
		promotionWeekly,
		guardianWeeklyTermsLink,
	],
	[
		'GuardianWeeklyDomestic',
		'QuarterlyPlus',
		weekly,
		promotionWeekly,
		guardianWeeklyTermsLink,
	],
	[
		'GuardianWeeklyDomestic',
		'AnnualPlus',
		weekly,
		promotionWeekly,
		guardianWeeklyTermsLink,
	],
	[
		'GuardianWeeklyDomestic',
		'ThreeMonthGift',
		weeklyGift,
		weeklyGift,
		undefined,
	],
	['GuardianWeeklyDomestic', 'OneYearGift', weeklyGift, weeklyGift, undefined],
	['HomeDelivery', 'EverydayPlus', paper, promotionPaper, paperTermsLink],
	['HomeDelivery', 'SixdayPlus', paper, promotionPaper, paperTermsLink],
	['HomeDelivery', 'WeekendPlus', paper, promotionPaper, paperTermsLink],
	['HomeDelivery', 'SaturdayPlus', paper, promotionPaper, paperTermsLink],
	[
		'HomeDelivery',
		'Sunday',
		sundayObserver,
		sundayObserver,
		observerLinks.TERMS,
	],
	['SubscriptionCard', 'EverydayPlus', paper, promotionPaper, paperTermsLink],
	['SubscriptionCard', 'SixdayPlus', paper, promotionPaper, paperTermsLink],
	['SubscriptionCard', 'WeekendPlus', paper, promotionPaper, paperTermsLink],
	['SubscriptionCard', 'SaturdayPlus', paper, promotionPaper, paperTermsLink],
	[
		'SubscriptionCard',
		'Sunday',
		sundaySubscriptionCard,
		sundaySubscriptionCard,
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
	expect(container.textContent).toMatchSnapshot();
	expect(container.textContent).toBe(copy);
	if (termsLink) {
		expect(
			screen.getByRole('link', { name: /^(here|Terms)$/ }),
		).toHaveAttribute('href', termsLink);
	}
};

describe('getCancellationPolicy', () => {
	it.each(policyCases)(
		'cancellation policy for product: %s ratePlan: %s',
		(product, ratePlan, copy, _promotionalCopy, termsLink) => {
			const result = getCancellationPolicy(product, ratePlan);
			expectPolicy(result, copy, termsLink);
		},
	);

	it.each(policyCases)(
		'promotional cancellation policy for product: %s ratePlan: %s',
		(product, ratePlan, _copy, promotionalCopy, termsLink) => {
			const { promotion } = getTestPricesAndPromotion(product, ratePlan);
			const result = getCancellationPolicy(product, ratePlan, promotion);
			expectPolicy(result, promotionalCopy, termsLink);
		},
	);
});
