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

export const DigitalSubscription = Template.bind({});
DigitalSubscription.args = {
	productKey: 'DigitalSubscription',
	contributionType: 'MONTHLY',
	currency: 'GBP',
	amount: 0,
	countryGroupId: 'GBPCountries',
	amountIsAboveThreshold: true,
};

export const GuardianAdLite = Template.bind({});
GuardianAdLite.args = {
	productKey: 'GuardianAdLite',
	contributionType: 'MONTHLY',
	currency: 'GBP',
	amount: 0,
	countryGroupId: 'GBPCountries',
	amountIsAboveThreshold: false,
};

export const OneTimeContribution = Template.bind({});
OneTimeContribution.args = {
	productKey: 'OneTimeContribution',
	contributionType: 'ONE_OFF',
	currency: 'AUD',
	amount: 5,
	countryGroupId: 'AUDCountries',
	amountIsAboveThreshold: false,
};

export const Contribution = Template.bind({});
Contribution.args = {
	productKey: 'Contribution',
	contributionType: 'MONTHLY',
	currency: 'USD',
	amount: 5,
	countryGroupId: 'UnitedStates',
	amountIsAboveThreshold: false,
};

export const SupporterPlus = Template.bind({});
SupporterPlus.args = {
	productKey: 'SupporterPlus',
	contributionType: 'MONTHLY',
	currency: 'GBP',
	amount: 12,
	countryGroupId: 'GBPCountries',
	amountIsAboveThreshold: true,
};

export const TierThree = Template.bind({});
TierThree.args = {
	productKey: 'TierThree',
	contributionType: 'MONTHLY',
	currency: 'GBP',
	amount: 27,
	countryGroupId: 'GBPCountries',
	amountIsAboveThreshold: true,
};
