import {
	OrderSummaryTsAndCs,
	OrderSummaryTsAndCsProps,
} from 'components/orderSummary/orderSummaryTsAndCs';

export default {
	title: 'Checkouts/Ts&Cs Order Summary',
	component: OrderSummaryTsAndCs,
	argTypes: {},
	decorators: [],
};

function Template(args: OrderSummaryTsAndCsProps) {
	return <OrderSummaryTsAndCs {...args} />;
}

Template.args = {} as Omit<OrderSummaryTsAndCsProps, ''>;

export const GuardianAdLite = Template.bind({});
GuardianAdLite.args = {
	productKey: 'GuardianAdLite',
	contributionType: 'MONTHLY',
	countryGroupId: 'GBPCountries',
};

export const Contribution = Template.bind({});
Contribution.args = {
	productKey: 'Contribution',
	contributionType: 'MONTHLY',
	countryGroupId: 'UnitedStates',
};

export const SupporterPlus = Template.bind({});
SupporterPlus.args = {
	productKey: 'SupporterPlus',
	contributionType: 'MONTHLY',
	countryGroupId: 'GBPCountries',
	thresholdAmount: 12,
};

export const TierThree = Template.bind({});
TierThree.args = {
	productKey: 'TierThree',
	contributionType: 'MONTHLY',
	countryGroupId: 'GBPCountries',
	thresholdAmount: 27,
};
