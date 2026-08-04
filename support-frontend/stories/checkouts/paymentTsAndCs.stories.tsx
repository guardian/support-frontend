import type { PaymentTsAndCsProps } from 'pages/supporter-plus-landing/components/paymentTsAndCs';
import { PaymentTsAndCs } from 'pages/supporter-plus-landing/components/paymentTsAndCs';

export default {
	title: 'Checkouts/Ts&Cs Payment',
	component: PaymentTsAndCs,
	argTypes: {},
	decorators: [],
};

const oneYearStudentDiscount = {
	amount: 9,
	periodNoun: 'year',
	discountPriceWithCurrency: '£9',
	fullPriceWithCurrency: '£120',
};
const auStudentDiscount = {
	amount: 0,
	periodNoun: 'month',
	discountPriceWithCurrency: '$0',
	fullPriceWithCurrency: '$20',
	promoCode: 'UTS_STUDENT',
	promoDuration: 'two years',
	discountSummary: '$0/month for two years, then $20/month',
};

function Template(args: PaymentTsAndCsProps) {
	return <PaymentTsAndCs {...args} />;
}

Template.args = {} as Omit<PaymentTsAndCsProps, ''>;

export const GuardianAdLite = Template.bind({});
GuardianAdLite.args = {
	productKey: 'GuardianAdLite',
	ratePlanKey: 'Monthly',
	supportRegionId: 'uk',
};

export const DigitalSubscription = Template.bind({});
DigitalSubscription.args = {
	productKey: 'DigitalSubscription',
	ratePlanKey: 'Monthly',
	supportRegionId: 'uk',
};

export const DigitalSubscriptionUS = Template.bind({});
DigitalSubscriptionUS.args = {
	productKey: 'DigitalSubscription',
	ratePlanKey: 'Monthly',
	supportRegionId: 'us',
	thresholdAmount: 28,
};

export const ContributionAU = Template.bind({});
ContributionAU.args = {
	productKey: 'Contribution',
	ratePlanKey: 'Annual',
	supportRegionId: 'au',
};

export const SupporterPlus = Template.bind({});
SupporterPlus.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Monthly',
	supportRegionId: 'uk',
	thresholdAmount: 12,
};

export const SupporterPlusUS = Template.bind({});
SupporterPlusUS.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Monthly',
	supportRegionId: 'us',
	thresholdAmount: 15,
};

export const SupporterPlusOneYearStudent = Template.bind({});
SupporterPlusOneYearStudent.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'OneYearStudent',
	supportRegionId: 'uk',
	thresholdAmount: 120,
	studentDiscount: oneYearStudentDiscount,
};

export const SupporterPlusAUStudent = Template.bind({});
SupporterPlusAUStudent.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Monthly',
	supportRegionId: 'au',
	thresholdAmount: 120,
	studentDiscount: auStudentDiscount,
};

export const HomeDelivery = Template.bind({});
HomeDelivery.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'EverydayPlus',
	supportRegionId: 'uk',
};

export const NationalDelivery = Template.bind({});
NationalDelivery.args = {
	productKey: 'NationalDelivery',
	ratePlanKey: 'EverydayPlus',
	supportRegionId: 'uk',
};

export const SubscriptionCard = Template.bind({});
SubscriptionCard.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'EverydayPlus',
	supportRegionId: 'uk',
};

export const WeeklyDigitalDomestic = Template.bind({});
WeeklyDigitalDomestic.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'MonthlyPlus',
	supportRegionId: 'uk',
};

export const WeeklyDigitalRestOfWorldInclPromo = Template.bind({});
WeeklyDigitalRestOfWorldInclPromo.args = {
	productKey: 'GuardianWeeklyRestOfWorld',
	ratePlanKey: 'AnnualPlus',
	supportRegionId: 'us',
	promotion: {
		name: '10% off for 12 months',
		description: 'Guardian Weekly Digital United States Annual',
		promoCode: 'ANNUAL10',
		numberOfDiscountedPeriods: 12,
		discountedPrice: 324,
		isIntroductoryPricing: false,
	},
};
