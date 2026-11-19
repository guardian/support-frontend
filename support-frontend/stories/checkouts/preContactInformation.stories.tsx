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

export const promoCatalogDigitalMonthly: PromoWithCatalogInformation = {
	name: 'MONTHLY DIGITAL',
	description: '',
	promoCode: 'MONTHLY DIGITAL',
	isIntroductoryPricing: true,
	discount: {
		amount: 57.12,
		durationMonths: 6,
	},
	campaignCode: 'TEST_CAMPAIGN',
	appliesTo: { productRatePlanIds: [], countries: [], catalogRatePlans: [] },
	startTimestamp: '2026-01-01T00:00:00.000Z',
};
export const promoCatalogPrintMonthly: PromoWithCatalogInformation = {
	name: 'MONTHLY PRINT 50%',
	description: '',
	promoCode: 'MONTHLY PRINT',
	isIntroductoryPricing: true,
	discount: {
		amount: 50,
		durationMonths: 6,
	},
	campaignCode: 'TEST_CAMPAIGN',
	appliesTo: { productRatePlanIds: [], countries: [], catalogRatePlans: [] },
	startTimestamp: '2026-01-01T00:00:00.000Z',
};
export const promoCatalogWeeklyQuarterly: PromoWithCatalogInformation = {
	name: 'QUARTERLY 25%',
	description: '',
	promoCode: 'QUARTERLY',
	isIntroductoryPricing: true,
	discount: {
		amount: 25,
		durationMonths: 6,
	},
	campaignCode: 'TEST_CAMPAIGN',
	appliesTo: { productRatePlanIds: [], countries: [], catalogRatePlans: [] },
	startTimestamp: '2026-01-01T00:00:00.000Z',
};
export const promoCatalogDigitalAnnual: PromoWithCatalogInformation = {
	name: 'ANNUAL',
	description: '',
	promoCode: 'ANNUAL',
	isIntroductoryPricing: true,
	discount: {
		amount: 14.285714,
		durationMonths: 12,
	},
	campaignCode: 'TEST_CAMPAIGN',
	appliesTo: { productRatePlanIds: [], countries: [], catalogRatePlans: [] },
	startTimestamp: '2026-01-01T00:00:00.000Z',
};
export const promoCatalogWeeklyAnnual: PromoWithCatalogInformation = {
	name: 'ANNUAL WEEKLY 25%',
	description: '',
	promoCode: 'ANNUAL WEEKLY',
	isIntroductoryPricing: true,
	discount: {
		amount: 25,
		durationMonths: 12,
	},
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
	promotion: promoCatalogDigitalMonthly,
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
	promotion: promoCatalogDigitalMonthly,
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
	promotion: promoCatalogDigitalAnnual,
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
	promotion: promoCatalogDigitalMonthly,
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
	promotion: promoCatalogDigitalAnnual,
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
	promotion: promoCatalogPrintMonthly,
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
	promotion: promoCatalogWeeklyQuarterly,
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
	promotion: promoCatalogWeeklyAnnual,
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
	promotion: promoCatalogPrintMonthly,
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
	promotion: promoCatalogPrintMonthly,
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
	promotion: promoCatalogPrintMonthly,
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
	promotion: promoCatalogPrintMonthly,
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
	promotion: promoCatalogPrintMonthly,
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
	promotion: promoCatalogPrintMonthly,
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
	promotion: promoCatalogPrintMonthly,
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
	promotion: promoCatalogPrintMonthly,
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
	promotion: promoCatalogPrintMonthly,
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
	promotion: promoCatalogPrintMonthly,
};
