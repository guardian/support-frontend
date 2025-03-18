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
	countryGroupId: 'GBPCountries',
};

export const GuardianAdLite = Template.bind({});
GuardianAdLite.args = {
	productKey: 'GuardianAdLite',
	contributionType: 'MONTHLY',
	countryGroupId: 'GBPCountries',
};

export const OneTimeContribution = Template.bind({});
OneTimeContribution.args = {
	productKey: 'OneTimeContribution',
	contributionType: 'ONE_OFF',
	countryGroupId: 'AUDCountries',
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
	supporterPlusPrice: 12,
};

export const TierThree = Template.bind({});
TierThree.args = {
	productKey: 'TierThree',
	contributionType: 'MONTHLY',
	countryGroupId: 'GBPCountries',
	supporterPlusPrice: 12,
};
