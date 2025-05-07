import {
	OrderSummaryTsAndCs,
	OrderSummaryTsAndCsProps,
} from 'components/orderSummary/orderSummaryTsAndCs';
import { Annual, Monthly } from 'helpers/productPrice/billingPeriods';

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
	billingPeriod: Monthly,
	countryGroupId: 'GBPCountries',
};

export const Contribution = Template.bind({});
Contribution.args = {
	productKey: 'Contribution',
	billingPeriod: Annual,
	countryGroupId: 'AUDCountries',
};

export const SupporterPlus = Template.bind({});
SupporterPlus.args = {
	productKey: 'SupporterPlus',
	billingPeriod: Monthly,
	countryGroupId: 'GBPCountries',
	thresholdAmount: 12,
};

export const TierThree = Template.bind({});
TierThree.args = {
	productKey: 'TierThree',
	billingPeriod: Monthly,
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
