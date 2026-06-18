import type { OrderSummaryTsAndCsProps } from 'components/orderSummary/orderSummaryTsAndCs';
import { OrderSummaryTsAndCs } from 'components/orderSummary/orderSummaryTsAndCs';

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

export const WeeklyDigital = Template.bind({});
WeeklyDigital.args = {
	productKey: 'GuardianWeeklyRestOfWorld',
	ratePlanKey: 'QuarterlyPlus',
	countryGroupId: 'UnitedStates',
	thresholdAmount: 45,
	promotion: {
		name: '50% off for 3 months',
		description: 'Guardian Weekly United States Quarterly',
		promoCode: 'GUARDIAN_WEEKLY_DIGITAL_USA_QUARTERLY',
		numberOfDiscountedPeriods: 3,
		discountedPrice: 54,
	},
};

export const SubscriptionCardWeekend = Template.bind({});
SubscriptionCardWeekend.args = {
	productKey: 'SubscriptionCard',
	ratePlanKey: 'WeekendPlus',
	ratePlanDescription: 'Weekend',
	countryGroupId: 'GBPCountries',
};

export const HomeDeliverySixday = Template.bind({});
HomeDeliverySixday.args = {
	productKey: 'HomeDelivery',
	ratePlanKey: 'SixdayPlus',
	ratePlanDescription: 'Six day',
	countryGroupId: 'GBPCountries',
};
