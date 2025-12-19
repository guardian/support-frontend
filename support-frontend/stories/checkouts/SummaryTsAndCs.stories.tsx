import type { SummaryTsAndCsProps } from 'pages/supporter-plus-landing/components/summaryTsAndCs';
import { SummaryTsAndCs } from 'pages/supporter-plus-landing/components/summaryTsAndCs';

export default {
	title: 'Checkouts/Ts&Cs Summary',
	component: SummaryTsAndCs,
	argTypes: {},
	decorators: [],
};

function Template(args: SummaryTsAndCsProps) {
	return <SummaryTsAndCs {...args} />;
}

Template.args = {} as Omit<SummaryTsAndCsProps, ''>;

export const GuardianAdLite = Template.bind({});
GuardianAdLite.args = {
	productKey: 'GuardianAdLite',
	ratePlanKey: 'Monthly',
	countryGroupId: 'GBPCountries',
	currency: 'GBP',
	amount: 0,
};

export const Contribution = Template.bind({});
Contribution.args = {
	productKey: 'Contribution',
	ratePlanKey: 'Monthly',
	countryGroupId: 'UnitedStates',
	currency: 'USD',
	amount: 5,
};

export const SupporterPlus = Template.bind({});
SupporterPlus.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Annual',
	countryGroupId: 'GBPCountries',
	currency: 'GBP',
	amount: 120,
};

export const DigitalSubscription = Template.bind({});
DigitalSubscription.args = {
	productKey: 'DigitalSubscription',
	ratePlanKey: 'Monthly',
	countryGroupId: 'UnitedStates',
	currency: 'USD',
	amount: 28,
};

export const TierThree = Template.bind({});
TierThree.args = {
	productKey: 'TierThree',
	ratePlanKey: 'Monthly',
	countryGroupId: 'GBPCountries',
	currency: 'GBP',
	amount: 27,
};

export const HomeDeliverySunday = Template.bind({});
HomeDeliverySunday.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'Sunday',
	countryGroupId: 'GBPCountries',
	ratePlanDescription: 'The Observer',
	currency: 'GBP',
	amount: 27.99,
};

export const SubscriptionCardWeekendPaperProduct = Template.bind({});
SubscriptionCardWeekendPaperProduct.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'WeekendPlus',
	countryGroupId: 'GBPCountries',
	ratePlanDescription: 'Weekend package',
	currency: 'GBP',
	amount: 27.99,
};

export const HomeDeliverySixdayPaperProduct = Template.bind({});
HomeDeliverySixdayPaperProduct.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'SixdayPlus',
	countryGroupId: 'GBPCountries',
	ratePlanDescription: 'Six day package',
	currency: 'GBP',
	amount: 73.99,
};
