import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type { PreContractInformationProps } from 'pages/supporter-plus-landing/components/preContractInformation';
import { PreContractInformation } from 'pages/supporter-plus-landing/components/preContractInformation';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Checkouts/Pre Contract Information',
	component: PreContractInformation,
	decorators: [withCenterAlignment, withSourceReset],
};

function Template(args: PreContractInformationProps) {
	return <PreContractInformation {...args} />;
}

Template.args = {} as Omit<PreContractInformationProps, ''>;

const monthlyPromotion: PromoWithCatalogInformation = {
	name: '50% off for 6 months',
	description: 'Monthly subscription promotion',
	promoCode: 'MONTHLY50',
	discount: {
		durationMonths: 6,
		amount: 7,
	},
	isIntroductoryPricing: true,
	campaignCode: 'TEST_CAMPAIGN',
	appliesTo: { productRatePlanIds: [], countries: [], catalogRatePlans: [] },
	startTimestamp: '2026-01-01T00:00:00.000Z',
};

const quarterlyPromotion: PromoWithCatalogInformation = {
	name: '50% off for 2 quarters',
	description: 'Quarterly subscription promotion',
	promoCode: 'QUARTERLY50',
	discount: {
		durationMonths: 6,
		amount: 30,
	},
	isIntroductoryPricing: true,
	campaignCode: 'TEST_CAMPAIGN',
	appliesTo: { productRatePlanIds: [], countries: [], catalogRatePlans: [] },
	startTimestamp: '2026-01-01T00:00:00.000Z',
};

const annualPromotion: PromoWithCatalogInformation = {
	name: 'Discounted first year',
	description: 'Annual subscription promotion',
	promoCode: 'ANNUALDISCOUNT',
	discount: {
		durationMonths: 12,
		amount: 90,
	},
	isIntroductoryPricing: true,
	campaignCode: 'TEST_CAMPAIGN',
	appliesTo: { productRatePlanIds: [], countries: [], catalogRatePlans: [] },
	startTimestamp: '2026-01-01T00:00:00.000Z',
};

export const GuardianAdLiteMonthly = Template.bind({});
GuardianAdLiteMonthly.args = {
	productKey: 'GuardianAdLite',
	ratePlanKey: 'Monthly',
	amount: 14,
};

export const GuardianAdLiteMonthlyWithPromotion = Template.bind({});
GuardianAdLiteMonthlyWithPromotion.args = {
	productKey: 'GuardianAdLite',
	ratePlanKey: 'Monthly',
	amount: 14,
	promotion: monthlyPromotion,
};

export const ContributionMonthly = Template.bind({});
ContributionMonthly.args = {
	productKey: 'Contribution',
	ratePlanKey: 'Monthly',
	amount: 10,
};

export const ContributionAnnual = Template.bind({});
ContributionAnnual.args = {
	productKey: 'Contribution',
	ratePlanKey: 'Annual',
	amount: 120,
};

export const SupporterPlusMonthly = Template.bind({});
SupporterPlusMonthly.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Monthly',
	amount: 14,
};

export const SupporterPlusMonthlyWithPromotion = Template.bind({});
SupporterPlusMonthlyWithPromotion.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Monthly',
	amount: 14,
	promotion: monthlyPromotion,
};

export const SupporterPlusMonthlyWithContribution = Template.bind({});
SupporterPlusMonthlyWithContribution.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Monthly',
	amount: 14,
	contribution: 5,
};

export const SupporterPlusAnnual = Template.bind({});
SupporterPlusAnnual.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Annual',
	amount: 140,
};

export const SupporterPlusAnnualWithPromotion = Template.bind({});
SupporterPlusAnnualWithPromotion.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Annual',
	amount: 140,
	promotion: annualPromotion,
};

export const SupporterPlusOneYearStudent = Template.bind({});
SupporterPlusOneYearStudent.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'OneYearStudent',
	amount: 120,
};

export const DigitalSubscriptionMonthly = Template.bind({});
DigitalSubscriptionMonthly.args = {
	productKey: 'DigitalSubscription',
	ratePlanKey: 'Monthly',
	amount: 14,
};

export const DigitalSubscriptionMonthlyWithPromotion = Template.bind({});
DigitalSubscriptionMonthlyWithPromotion.args = {
	productKey: 'DigitalSubscription',
	ratePlanKey: 'Monthly',
	amount: 14,
	promotion: monthlyPromotion,
};

export const DigitalSubscriptionAnnual = Template.bind({});
DigitalSubscriptionAnnual.args = {
	productKey: 'DigitalSubscription',
	ratePlanKey: 'Annual',
	amount: 140,
};

export const DigitalSubscriptionAnnualWithPromotion = Template.bind({});
DigitalSubscriptionAnnualWithPromotion.args = {
	productKey: 'DigitalSubscription',
	ratePlanKey: 'Annual',
	amount: 140,
	promotion: annualPromotion,
};

export const GuardianWeeklyDomesticMonthly = Template.bind({});
GuardianWeeklyDomesticMonthly.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'MonthlyPlus',
	amount: 19,
};

export const GuardianWeeklyDomesticMonthlyWithPromotion = Template.bind({});
GuardianWeeklyDomesticMonthlyWithPromotion.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'MonthlyPlus',
	amount: 19,
	promotion: monthlyPromotion,
};

export const GuardianWeeklyDomesticQuarterly = Template.bind({});
GuardianWeeklyDomesticQuarterly.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'QuarterlyPlus',
	amount: 57,
};

export const GuardianWeeklyDomesticQuarterlyWithPromotion = Template.bind({});
GuardianWeeklyDomesticQuarterlyWithPromotion.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'QuarterlyPlus',
	amount: 57,
	promotion: quarterlyPromotion,
};

export const GuardianWeeklyDomesticAnnual = Template.bind({});
GuardianWeeklyDomesticAnnual.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'AnnualPlus',
	amount: 228,
};

export const GuardianWeeklyDomesticAnnualWithPromotion = Template.bind({});
GuardianWeeklyDomesticAnnualWithPromotion.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'AnnualPlus',
	amount: 228,
	promotion: annualPromotion,
};

export const GuardianWeeklyDomesticThreeMonthGift = Template.bind({});
GuardianWeeklyDomesticThreeMonthGift.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'ThreeMonthGift',
	amount: 49.5,
};

export const GuardianWeeklyDomesticOneYearGift = Template.bind({});
GuardianWeeklyDomesticOneYearGift.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'OneYearGift',
	amount: 158.4,
};

export const HomeDeliveryEverydayPlus = Template.bind({});
HomeDeliveryEverydayPlus.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'EverydayPlus',
	amount: 88.99,
};

export const HomeDeliveryEverydayPlusWithPromotion = Template.bind({});
HomeDeliveryEverydayPlusWithPromotion.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'EverydayPlus',
	amount: 88.99,
	promotion: monthlyPromotion,
};

export const HomeDeliverySixdayPlus = Template.bind({});
HomeDeliverySixdayPlus.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'SixdayPlus',
	amount: 77.99,
};

export const HomeDeliverySixdayPlusWithPromotion = Template.bind({});
HomeDeliverySixdayPlusWithPromotion.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'SixdayPlus',
	amount: 77.99,
	promotion: monthlyPromotion,
};

export const HomeDeliveryWeekendPlus = Template.bind({});
HomeDeliveryWeekendPlus.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'WeekendPlus',
	amount: 36.99,
};

export const HomeDeliveryWeekendPlusWithPromotion = Template.bind({});
HomeDeliveryWeekendPlusWithPromotion.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'WeekendPlus',
	amount: 36.99,
	promotion: monthlyPromotion,
};

export const HomeDeliverySaturdayPlus = Template.bind({});
HomeDeliverySaturdayPlus.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'SaturdayPlus',
	amount: 21.99,
};

export const HomeDeliverySaturdayPlusWithPromotion = Template.bind({});
HomeDeliverySaturdayPlusWithPromotion.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'SaturdayPlus',
	amount: 21.99,
	promotion: monthlyPromotion,
};

export const HomeDeliverySunday = Template.bind({});
HomeDeliverySunday.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'Sunday',
	amount: 23,
};

export const HomeDeliverySundayWithPromotion = Template.bind({});
HomeDeliverySundayWithPromotion.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'Sunday',
	amount: 23,
	promotion: monthlyPromotion,
};

export const SubscriptionCardEverydayPlus = Template.bind({});
SubscriptionCardEverydayPlus.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'EverydayPlus',
	amount: 72.99,
};

export const SubscriptionCardEverydayPlusWithPromotion = Template.bind({});
SubscriptionCardEverydayPlusWithPromotion.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'EverydayPlus',
	amount: 72.99,
	promotion: monthlyPromotion,
};

export const SubscriptionCardSixdayPlus = Template.bind({});
SubscriptionCardSixdayPlus.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'SixdayPlus',
	amount: 64.99,
};

export const SubscriptionCardSixdayPlusWithPromotion = Template.bind({});
SubscriptionCardSixdayPlusWithPromotion.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'SixdayPlus',
	amount: 64.99,
	promotion: monthlyPromotion,
};

export const SubscriptionCardWeekendPlus = Template.bind({});
SubscriptionCardWeekendPlus.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'WeekendPlus',
	amount: 29.99,
};

export const SubscriptionCardWeekendPlusWithPromotion = Template.bind({});
SubscriptionCardWeekendPlusWithPromotion.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'WeekendPlus',
	amount: 29.99,
	promotion: monthlyPromotion,
};

export const SubscriptionCardSaturdayPlus = Template.bind({});
SubscriptionCardSaturdayPlus.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'SaturdayPlus',
	amount: 16.99,
};

export const SubscriptionCardSaturdayPlusWithPromotion = Template.bind({});
SubscriptionCardSaturdayPlusWithPromotion.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'SaturdayPlus',
	amount: 16.99,
	promotion: monthlyPromotion,
};

export const SubscriptionCardSunday = Template.bind({});
SubscriptionCardSunday.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'Sunday',
	amount: 18,
};

export const SubscriptionCardSundayWithPromotion = Template.bind({});
SubscriptionCardSundayWithPromotion.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'Sunday',
	amount: 18,
	promotion: monthlyPromotion,
};
