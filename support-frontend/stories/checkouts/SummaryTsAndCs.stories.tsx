import {
	SummaryTsAndCs,
	SummaryTsAndCsProps,
} from 'pages/supporter-plus-landing/components/summaryTsAndCs';

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
	billingPeriod: 'Monthly',
	countryGroupId: 'GBPCountries',
	currency: 'GBP',
	amount: 0,
};

export const Contribution = Template.bind({});
Contribution.args = {
	productKey: 'Contribution',
	ratePlanKey: 'Monthly',
	billingPeriod: 'Monthly',
	countryGroupId: 'UnitedStates',
	currency: 'USD',
	amount: 5,
};

export const SupporterPlus = Template.bind({});
SupporterPlus.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Monthly',
	billingPeriod: 'Monthly',
	countryGroupId: 'GBPCountries',
	currency: 'GBP',
	amount: 12,
};

export const TierThree = Template.bind({});
TierThree.args = {
	productKey: 'TierThree',
	ratePlanKey: 'Monthly',
	billingPeriod: 'Monthly',
	countryGroupId: 'GBPCountries',
	currency: 'GBP',
	amount: 27,
};
