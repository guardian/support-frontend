import {
	PaymentTsAndCs,
	PaymentTsAndCsProps,
} from 'pages/supporter-plus-landing/components/paymentTsAndCs';

export default {
	title: 'Checkouts/Ts&Cs Payment',
	component: PaymentTsAndCs,
	argTypes: {},
	decorators: [],
};

function Template(args: PaymentTsAndCsProps) {
	return <PaymentTsAndCs {...args} />;
}

Template.args = {} as Omit<PaymentTsAndCsProps, ''>;

export const SupporterPlus = Template.bind({});
SupporterPlus.args = {
	productKey: 'SupporterPlus',
	contributionType: 'MONTHLY',
	currency: 'GBP',
	amount: 0,
	countryGroupId: 'GBPCountries',
	amountIsAboveThreshold: true,
};

export const TierThree = Template.bind({});
TierThree.args = {
	productKey: 'TierThree',
	contributionType: 'MONTHLY',
	currency: 'GBP',
	amount: 0,
	countryGroupId: 'GBPCountries',
	amountIsAboveThreshold: true,
};
