import { getTestPricesAndPromotion } from 'helpers/productPrice/preContractInformationTestData';
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

const guardianAdLiteMonthly = getTestPricesAndPromotion(
	'GuardianAdLite',
	'Monthly',
);
export const GuardianAdLiteMonthly = Template.bind({});
GuardianAdLiteMonthly.args = {
	productKey: 'GuardianAdLite',
	ratePlanKey: 'Monthly',
	amount: guardianAdLiteMonthly.fullPrice,
};
export const GuardianAdLiteMonthlyWithPromotion = Template.bind({});
GuardianAdLiteMonthlyWithPromotion.args = {
	productKey: 'GuardianAdLite',
	ratePlanKey: 'Monthly',
	amount: guardianAdLiteMonthly.fullPrice,
	promotion: guardianAdLiteMonthly.promotion,
};

const contributionMonthly = getTestPricesAndPromotion(
	'Contribution',
	'Monthly',
);
const contributionAnnual = getTestPricesAndPromotion('Contribution', 'Annual');
export const ContributionMonthly = Template.bind({});
ContributionMonthly.args = {
	productKey: 'Contribution',
	ratePlanKey: 'Monthly',
	amount: contributionMonthly.fullPrice,
};
export const ContributionAnnual = Template.bind({});
ContributionAnnual.args = {
	productKey: 'Contribution',
	ratePlanKey: 'Annual',
	amount: contributionAnnual.fullPrice,
};

const supporterPlusMonthly = getTestPricesAndPromotion(
	'SupporterPlus',
	'Monthly',
);
const supporterPlusOneYearStudent = getTestPricesAndPromotion(
	'SupporterPlus',
	'OneYearStudent',
);
export const SupporterPlusMonthly = Template.bind({});
SupporterPlusMonthly.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Monthly',
	amount: supporterPlusMonthly.fullPrice,
};
export const SupporterPlusMonthlyWithPromotion = Template.bind({});
SupporterPlusMonthlyWithPromotion.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Monthly',
	amount: supporterPlusMonthly.fullPrice,
	promotion: supporterPlusMonthly.promotion,
};
export const SupporterPlusMonthlyWithContribution = Template.bind({});
SupporterPlusMonthlyWithContribution.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Monthly',
	amount: supporterPlusMonthly.fullPrice,
	contribution: 5,
};
const supporterPlusAnnual = getTestPricesAndPromotion(
	'SupporterPlus',
	'Annual',
);
export const SupporterPlusAnnual = Template.bind({});
SupporterPlusAnnual.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Annual',
	amount: supporterPlusAnnual.fullPrice,
};
export const SupporterPlusAnnualWithPromotion = Template.bind({});
SupporterPlusAnnualWithPromotion.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Annual',
	amount: supporterPlusAnnual.fullPrice,
	promotion: supporterPlusAnnual.promotion,
};
export const SupporterPlusOneYearStudent = Template.bind({});
SupporterPlusOneYearStudent.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'OneYearStudent',
	amount: supporterPlusOneYearStudent.fullPrice,
};

const digitalSubscriptionMonthly = getTestPricesAndPromotion(
	'DigitalSubscription',
	'Monthly',
);
export const DigitalSubscriptionMonthly = Template.bind({});
DigitalSubscriptionMonthly.args = {
	productKey: 'DigitalSubscription',
	ratePlanKey: 'Monthly',
	amount: digitalSubscriptionMonthly.fullPrice,
};
export const DigitalSubscriptionMonthlyWithPromotion = Template.bind({});
DigitalSubscriptionMonthlyWithPromotion.args = {
	productKey: 'DigitalSubscription',
	ratePlanKey: 'Monthly',
	amount: digitalSubscriptionMonthly.fullPrice,
	promotion: digitalSubscriptionMonthly.promotion,
};
const digitalSubscriptionAnnual = getTestPricesAndPromotion(
	'DigitalSubscription',
	'Annual',
);
export const DigitalSubscriptionAnnual = Template.bind({});
DigitalSubscriptionAnnual.args = {
	productKey: 'DigitalSubscription',
	ratePlanKey: 'Annual',
	amount: digitalSubscriptionAnnual.fullPrice,
};
export const DigitalSubscriptionAnnualWithPromotion = Template.bind({});
DigitalSubscriptionAnnualWithPromotion.args = {
	productKey: 'DigitalSubscription',
	ratePlanKey: 'Annual',
	amount: digitalSubscriptionAnnual.fullPrice,
	promotion: digitalSubscriptionAnnual.promotion,
};

const guardianWeeklyDomesticMonthly = getTestPricesAndPromotion(
	'GuardianWeeklyDomestic',
	'MonthlyPlus',
);
const guardianWeeklyDomesticQuarterly = getTestPricesAndPromotion(
	'GuardianWeeklyDomestic',
	'QuarterlyPlus',
);
const guardianWeeklyDomesticAnnual = getTestPricesAndPromotion(
	'GuardianWeeklyDomestic',
	'AnnualPlus',
);
const guardianWeeklyDomesticThreeMonthGift = getTestPricesAndPromotion(
	'GuardianWeeklyDomestic',
	'ThreeMonthGift',
);
const guardianWeeklyDomesticOneYearGift = getTestPricesAndPromotion(
	'GuardianWeeklyDomestic',
	'OneYearGift',
);
export const GuardianWeeklyDomesticMonthly = Template.bind({});
GuardianWeeklyDomesticMonthly.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'MonthlyPlus',
	amount: guardianWeeklyDomesticMonthly.fullPrice,
};
export const GuardianWeeklyDomesticMonthlyWithPromotion = Template.bind({});
GuardianWeeklyDomesticMonthlyWithPromotion.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'MonthlyPlus',
	amount: guardianWeeklyDomesticMonthly.fullPrice,
	promotion: guardianWeeklyDomesticMonthly.promotion,
};
export const GuardianWeeklyDomesticQuarterly = Template.bind({});
GuardianWeeklyDomesticQuarterly.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'QuarterlyPlus',
	amount: guardianWeeklyDomesticQuarterly.fullPrice,
};
export const GuardianWeeklyDomesticQuarterlyWithPromotion = Template.bind({});
GuardianWeeklyDomesticQuarterlyWithPromotion.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'QuarterlyPlus',
	amount: guardianWeeklyDomesticQuarterly.fullPrice,
	promotion: guardianWeeklyDomesticQuarterly.promotion,
};
export const GuardianWeeklyDomesticAnnual = Template.bind({});
GuardianWeeklyDomesticAnnual.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'AnnualPlus',
	amount: guardianWeeklyDomesticAnnual.fullPrice,
};
export const GuardianWeeklyDomesticAnnualWithPromotion = Template.bind({});
GuardianWeeklyDomesticAnnualWithPromotion.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'AnnualPlus',
	amount: guardianWeeklyDomesticAnnual.fullPrice,
	promotion: guardianWeeklyDomesticAnnual.promotion,
};
export const GuardianWeeklyDomesticThreeMonthGift = Template.bind({});
GuardianWeeklyDomesticThreeMonthGift.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'ThreeMonthGift',
	amount: guardianWeeklyDomesticThreeMonthGift.fullPrice,
};
export const GuardianWeeklyDomesticOneYearGift = Template.bind({});
GuardianWeeklyDomesticOneYearGift.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'OneYearGift',
	amount: guardianWeeklyDomesticOneYearGift.fullPrice,
};

const homeDeliveryEverydayPlus = getTestPricesAndPromotion(
	'HomeDelivery',
	'EverydayPlus',
);
const homeDeliverySixdayPlus = getTestPricesAndPromotion(
	'HomeDelivery',
	'SixdayPlus',
);
const homeDeliveryWeekendPlus = getTestPricesAndPromotion(
	'HomeDelivery',
	'WeekendPlus',
);
const homeDeliverySaturdayPlus = getTestPricesAndPromotion(
	'HomeDelivery',
	'SaturdayPlus',
);
const homeDeliverySunday = getTestPricesAndPromotion('HomeDelivery', 'Sunday');
export const HomeDeliveryEverydayPlus = Template.bind({});
HomeDeliveryEverydayPlus.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'EverydayPlus',
	amount: homeDeliveryEverydayPlus.fullPrice,
};
export const HomeDeliveryEverydayPlusWithPromotion = Template.bind({});
HomeDeliveryEverydayPlusWithPromotion.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'EverydayPlus',
	amount: homeDeliveryEverydayPlus.fullPrice,
	promotion: homeDeliveryEverydayPlus.promotion,
};
export const HomeDeliverySixdayPlus = Template.bind({});
HomeDeliverySixdayPlus.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'SixdayPlus',
	amount: homeDeliverySixdayPlus.fullPrice,
};
export const HomeDeliverySixdayPlusWithPromotion = Template.bind({});
HomeDeliverySixdayPlusWithPromotion.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'SixdayPlus',
	amount: homeDeliverySixdayPlus.fullPrice,
	promotion: homeDeliverySixdayPlus.promotion,
};
export const HomeDeliveryWeekendPlus = Template.bind({});
HomeDeliveryWeekendPlus.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'WeekendPlus',
	amount: homeDeliveryWeekendPlus.fullPrice,
};
export const HomeDeliveryWeekendPlusWithPromotion = Template.bind({});
HomeDeliveryWeekendPlusWithPromotion.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'WeekendPlus',
	amount: homeDeliveryWeekendPlus.fullPrice,
	promotion: homeDeliveryWeekendPlus.promotion,
};
export const HomeDeliverySaturdayPlus = Template.bind({});
HomeDeliverySaturdayPlus.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'SaturdayPlus',
	amount: homeDeliverySaturdayPlus.fullPrice,
};
export const HomeDeliverySaturdayPlusWithPromotion = Template.bind({});
HomeDeliverySaturdayPlusWithPromotion.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'SaturdayPlus',
	amount: homeDeliverySaturdayPlus.fullPrice,
	promotion: homeDeliverySaturdayPlus.promotion,
};
export const HomeDeliverySunday = Template.bind({});
HomeDeliverySunday.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'Sunday',
	amount: homeDeliverySunday.fullPrice,
};
export const HomeDeliverySundayWithPromotion = Template.bind({});
HomeDeliverySundayWithPromotion.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'Sunday',
	amount: homeDeliverySunday.fullPrice,
	promotion: homeDeliverySunday.promotion,
};

const subscriptionCardEverydayPlus = getTestPricesAndPromotion(
	'SubscriptionCard',
	'EverydayPlus',
);
const subscriptionCardSixdayPlus = getTestPricesAndPromotion(
	'SubscriptionCard',
	'SixdayPlus',
);
const subscriptionCardWeekendPlus = getTestPricesAndPromotion(
	'SubscriptionCard',
	'WeekendPlus',
);
const subscriptionCardSaturdayPlus = getTestPricesAndPromotion(
	'SubscriptionCard',
	'SaturdayPlus',
);
const subscriptionCardSunday = getTestPricesAndPromotion(
	'SubscriptionCard',
	'Sunday',
);
export const SubscriptionCardEverydayPlus = Template.bind({});
SubscriptionCardEverydayPlus.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'EverydayPlus',
	amount: subscriptionCardEverydayPlus.fullPrice,
};
export const SubscriptionCardEverydayPlusWithPromotion = Template.bind({});
SubscriptionCardEverydayPlusWithPromotion.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'EverydayPlus',
	amount: subscriptionCardEverydayPlus.fullPrice,
	promotion: subscriptionCardEverydayPlus.promotion,
};
export const SubscriptionCardSixdayPlus = Template.bind({});
SubscriptionCardSixdayPlus.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'SixdayPlus',
	amount: subscriptionCardSixdayPlus.fullPrice,
};
export const SubscriptionCardSixdayPlusWithPromotion = Template.bind({});
SubscriptionCardSixdayPlusWithPromotion.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'SixdayPlus',
	amount: subscriptionCardSixdayPlus.fullPrice,
	promotion: subscriptionCardSixdayPlus.promotion,
};
export const SubscriptionCardWeekendPlus = Template.bind({});
SubscriptionCardWeekendPlus.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'WeekendPlus',
	amount: subscriptionCardWeekendPlus.fullPrice,
};
export const SubscriptionCardWeekendPlusWithPromotion = Template.bind({});
SubscriptionCardWeekendPlusWithPromotion.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'WeekendPlus',
	amount: subscriptionCardWeekendPlus.fullPrice,
	promotion: subscriptionCardWeekendPlus.promotion,
};
export const SubscriptionCardSaturdayPlus = Template.bind({});
SubscriptionCardSaturdayPlus.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'SaturdayPlus',
	amount: subscriptionCardSaturdayPlus.fullPrice,
};
export const SubscriptionCardSaturdayPlusWithPromotion = Template.bind({});
SubscriptionCardSaturdayPlusWithPromotion.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'SaturdayPlus',
	amount: subscriptionCardSaturdayPlus.fullPrice,
	promotion: subscriptionCardSaturdayPlus.promotion,
};
export const SubscriptionCardSunday = Template.bind({});
SubscriptionCardSunday.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'Sunday',
	amount: subscriptionCardSunday.fullPrice,
};
export const SubscriptionCardSundayWithPromotion = Template.bind({});
SubscriptionCardSundayWithPromotion.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'Sunday',
	amount: subscriptionCardSunday.fullPrice,
	promotion: subscriptionCardSunday.promotion,
};
