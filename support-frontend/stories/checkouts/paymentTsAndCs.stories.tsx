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

export const GuardianAdLite = Template.bind({});
GuardianAdLite.args = {
	productKey: 'GuardianAdLite',
	ratePlanKey: 'Montly',
	contributionType: 'MONTHLY',
	countryGroupId: 'GBPCountries',
};

export const DigitalSubscription = Template.bind({});
DigitalSubscription.args = {
	productKey: 'DigitalSubscription',
	ratePlanKey: 'Montly',
	contributionType: 'MONTHLY',
	countryGroupId: 'GBPCountries',
};

export const OneTimeContribution = Template.bind({});
OneTimeContribution.args = {
	productKey: 'OneTimeContribution',
	ratePlanKey: '',
	contributionType: 'ONE_OFF',
	countryGroupId: 'UnitedStates',
};

export const Contribution = Template.bind({});
Contribution.args = {
	productKey: 'Contribution',
	ratePlanKey: 'Annual',
	contributionType: 'ANNUAL',
	countryGroupId: 'AUDCountries',
};

export const SupporterPlus = Template.bind({});
SupporterPlus.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Monthly',
	contributionType: 'MONTHLY',
	countryGroupId: 'GBPCountries',
	thresholdAmount: 12,
};

export const TierThree = Template.bind({});
TierThree.args = {
	productKey: 'TierThree',
	ratePlanKey: 'Monthly',
	contributionType: 'MONTHLY',
	countryGroupId: 'UnitedStates',
	thresholdAmount: 45,
	promotion: {
		name: '$8 off for 12 months',
		description: 'Tier Three United States Monthly',
		promoCode: 'TIER_THREE_USA_MONTHLY',
		numberOfDiscountedPeriods: 12,
		discountedPrice: 37,
	},
};

export const HomeDelivery = Template.bind({});
HomeDelivery.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'Monthly',
	contributionType: 'MONTHLY',
	countryGroupId: 'GBPCountries',
};

export const NationalDelivery = Template.bind({});
NationalDelivery.args = {
	productKey: 'NationalDelivery',
	ratePlanKey: 'Monthly',
	contributionType: 'MONTHLY',
	countryGroupId: 'GBPCountries',
};

export const SubscriptionCard = Template.bind({});
SubscriptionCard.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'Monthly',
	contributionType: 'MONTHLY',
	countryGroupId: 'GBPCountries',
};

export const GuardianWeeklyDomestic = Template.bind({});
GuardianWeeklyDomestic.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'Monthly',
	contributionType: 'MONTHLY',
	countryGroupId: 'GBPCountries',
};

export const GuardianWeeklyRestOfWorldInclPromo = Template.bind({});
GuardianWeeklyRestOfWorldInclPromo.args = {
	productKey: 'GuardianWeeklyRestOfWorld',
	ratePlanKey: 'Annual',
	contributionType: 'ANNUAL',
	countryGroupId: 'UnitedStates',
	promotion: {
		name: '10% off for 12 months',
		description: 'Guardian Weekly United States Annual',
		promoCode: 'ANNUAL10',
		numberOfDiscountedPeriods: 12,
		discountedPrice: 324,
	},
};
