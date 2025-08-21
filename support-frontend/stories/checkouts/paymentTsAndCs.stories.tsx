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

export const oneYearStudentDiscount = {
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
	countryGroupId: 'GBPCountries',
};

export const DigitalSubscription = Template.bind({});
DigitalSubscription.args = {
	productKey: 'DigitalSubscription',
	ratePlanKey: 'Monthly',
	countryGroupId: 'GBPCountries',
};

export const Contribution = Template.bind({});
Contribution.args = {
	productKey: 'Contribution',
	ratePlanKey: 'Annual',
	countryGroupId: 'AUDCountries',
};

export const SupporterPlus = Template.bind({});
SupporterPlus.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Monthly',
	countryGroupId: 'GBPCountries',
	thresholdAmount: 12,
};

export const SupporterPlusOneYearStudent = Template.bind({});
SupporterPlusOneYearStudent.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'OneYearStudent',
	countryGroupId: 'GBPCountries',
	thresholdAmount: 120,
	studentDiscount: oneYearStudentDiscount,
};

export const SupporterPlusAUStudent = Template.bind({});
SupporterPlusAUStudent.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Monthly',
	countryGroupId: 'AUDCountries',
	thresholdAmount: 120,
	studentDiscount: auStudentDiscount,
};

export const TierThree = Template.bind({});
TierThree.args = {
	productKey: 'TierThree',
	ratePlanKey: 'Monthly',
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
	countryGroupId: 'GBPCountries',
};

export const NationalDelivery = Template.bind({});
NationalDelivery.args = {
	productKey: 'NationalDelivery',
	ratePlanKey: 'Monthly',
	countryGroupId: 'GBPCountries',
};

export const SubscriptionCard = Template.bind({});
SubscriptionCard.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'Monthly',
	countryGroupId: 'GBPCountries',
};

export const GuardianWeeklyDomestic = Template.bind({});
GuardianWeeklyDomestic.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'Monthly',
	countryGroupId: 'GBPCountries',
};

export const GuardianWeeklyRestOfWorldInclPromo = Template.bind({});
GuardianWeeklyRestOfWorldInclPromo.args = {
	productKey: 'GuardianWeeklyRestOfWorld',
	ratePlanKey: 'Annual',
	countryGroupId: 'UnitedStates',
	promotion: {
		name: '10% off for 12 months',
		description: 'Guardian Weekly United States Annual',
		promoCode: 'ANNUAL10',
		numberOfDiscountedPeriods: 12,
		discountedPrice: 324,
	},
};
