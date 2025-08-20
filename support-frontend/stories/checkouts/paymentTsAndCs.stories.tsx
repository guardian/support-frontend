import { StudentDiscount } from 'pages/[countryGroupId]/student/helpers/discountDetails';
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

const studentDiscount: StudentDiscount = {
	amount: 9,
	periodNoun: 'year',
	fullPriceWithCurrency: '£9',
	discountPriceWithCurrency: '£120',
};

Template.args = {} as Omit<PaymentTsAndCsProps, ''>;
export const GuardianAdLite = Template.bind({});
GuardianAdLite.args = {
	productKey: 'GuardianAdLite',
	ratePlanKey: 'Monthly',
	countryGroupId: 'GBPCountries',
	studentDiscount: studentDiscount,
};

export const DigitalSubscription = Template.bind({});
DigitalSubscription.args = {
	productKey: 'DigitalSubscription',
	ratePlanKey: 'Monthly',
	countryGroupId: 'GBPCountries',
	studentDiscount: studentDiscount,
};

export const Contribution = Template.bind({});
Contribution.args = {
	productKey: 'Contribution',
	ratePlanKey: 'Annual',
	countryGroupId: 'AUDCountries',
	studentDiscount: studentDiscount,
};

export const SupporterPlus = Template.bind({});
SupporterPlus.args = {
	productKey: 'SupporterPlus',
	ratePlanKey: 'Monthly',
	countryGroupId: 'GBPCountries',
	thresholdAmount: 12,
	studentDiscount: studentDiscount,
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
	studentDiscount: studentDiscount,
};

export const HomeDelivery = Template.bind({});
HomeDelivery.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'Monthly',
	countryGroupId: 'GBPCountries',
	studentDiscount: studentDiscount,
};

export const NationalDelivery = Template.bind({});
NationalDelivery.args = {
	productKey: 'NationalDelivery',
	ratePlanKey: 'Monthly',
	countryGroupId: 'GBPCountries',
	studentDiscount: studentDiscount,
};

export const SubscriptionCard = Template.bind({});
SubscriptionCard.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'Monthly',
	countryGroupId: 'GBPCountries',
	studentDiscount: studentDiscount,
};

export const GuardianWeeklyDomestic = Template.bind({});
GuardianWeeklyDomestic.args = {
	productKey: 'GuardianWeeklyDomestic',
	ratePlanKey: 'Monthly',
	countryGroupId: 'GBPCountries',
	studentDiscount: studentDiscount,
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
	studentDiscount: studentDiscount,
};
