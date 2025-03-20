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
	contributionType: 'MONTHLY',
	currency: 'GBP',
	amount: 0,
};

export const OneTimeContribution = Template.bind({});
OneTimeContribution.args = {
	productKey: 'OneTimeContribution',
	contributionType: 'ONE_OFF',
	currency: 'AUD',
	amount: 5,
};

export const Contribution = Template.bind({});
Contribution.args = {
	productKey: 'Contribution',
	contributionType: 'MONTHLY',
	currency: 'USD',
	amount: 5,
};

export const SupporterPlus = Template.bind({});
SupporterPlus.args = {
	productKey: 'SupporterPlus',
	contributionType: 'MONTHLY',
	currency: 'GBP',
	amount: 12,
};

export const TierThree = Template.bind({});
TierThree.args = {
	productKey: 'TierThree',
	contributionType: 'MONTHLY',
	currency: 'GBP',
	amount: 27,
};
