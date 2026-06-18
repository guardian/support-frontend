import type { BenefitsCheckListData } from 'components/checkoutBenefits/benefitsCheckList';

const ContributionBenefits = [
	{
		isChecked: true,
		text: 'Give to the Guardian every month with Support',
	},
	{
		isChecked: false,
		maybeGreyedOut: {
			name: expect.any(String) as string,
			styles: expect.any(String) as string,
			next: undefined,
		},
		text: 'Far fewer asks for support',
	},
	{
		isChecked: false,
		maybeGreyedOut: {
			name: expect.any(String) as string,
			styles: expect.any(String) as string,
			next: undefined,
		},
		text: 'Ad-free reading on all your devices',
	},
	{
		isChecked: false,
		maybeGreyedOut: {
			name: expect.any(String) as string,
			styles: expect.any(String) as string,
			next: undefined,
		},
		text: 'Unlimited access to the Guardian app',
	},
	{
		isChecked: false,
		maybeGreyedOut: {
			name: expect.any(String) as string,
			styles: expect.any(String) as string,
			next: undefined,
		},
		text: 'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
	},
	{
		isChecked: false,
		maybeGreyedOut: {
			name: expect.any(String) as string,
			styles: expect.any(String) as string,
			next: undefined,
		},
		text: 'Unlimited access to the Guardian Feast app',
	},
];
const ContributionBenefitsUS = [
	{
		isChecked: true,
		text: 'Regular dispatches from the newsroom to see the impact of your support',
	},
	{
		isChecked: false,
		maybeGreyedOut: {
			name: expect.any(String) as string,
			styles: expect.any(String) as string,
			next: undefined,
		},
		text: 'Far fewer asks for support',
	},
	{
		isChecked: false,
		maybeGreyedOut: {
			name: expect.any(String) as string,
			styles: expect.any(String) as string,
			next: undefined,
		},
		text: 'Ad-free reading on all your devices',
	},
	{
		isChecked: false,
		maybeGreyedOut: {
			name: expect.any(String) as string,
			styles: expect.any(String) as string,
			next: undefined,
		},
		text: 'Unlimited access to the Guardian app',
	},
	{
		isChecked: false,
		maybeGreyedOut: {
			name: expect.any(String) as string,
			styles: expect.any(String) as string,
			next: undefined,
		},
		text: 'Regular dispatches from the newsroom to see the impact of your support',
	},
	{
		isChecked: false,
		maybeGreyedOut: {
			name: expect.any(String) as string,
			styles: expect.any(String) as string,
			next: undefined,
		},
		text: 'Unlimited access to the Guardian Feast app',
	},
];
const ContributionBenefitsAUD = [
	{
		isChecked: true,
		text: 'Give to the Guardian every month with Support',
	},
	{
		isChecked: false,
		text: 'Far fewer asks for support',
		maybeGreyedOut: {
			name: expect.any(String) as string,
			styles: expect.any(String) as string,
			next: undefined,
		},
	},
	{
		isChecked: false,
		text: 'Ad-free reading on all your devices',
		maybeGreyedOut: {
			name: expect.any(String) as string,
			styles: expect.any(String) as string,
			next: undefined,
		},
	},
	{
		isChecked: false,
		text: 'Unlimited access to the Guardian app',
		maybeGreyedOut: {
			name: expect.any(String) as string,
			styles: expect.any(String) as string,
			next: undefined,
		},
	},
	{
		isChecked: false,
		text: 'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
		maybeGreyedOut: {
			name: expect.any(String) as string,
			styles: expect.any(String) as string,
			next: undefined,
		},
	},
	{
		isChecked: false,
		text: 'Exclusive access to partner offers',
		maybeGreyedOut: {
			name: expect.any(String) as string,
			styles: expect.any(String) as string,
			next: undefined,
		},
	},
	{
		isChecked: false,
		text: 'Unlimited access to the Guardian Feast app',
		maybeGreyedOut: {
			name: expect.any(String) as string,
			styles: expect.any(String) as string,
			next: undefined,
		},
	},
];
const SupporterPlusBenefits = [
	{ isChecked: true, text: 'Far fewer asks for support' },
	{ isChecked: true, text: 'Ad-free reading on all your devices' },
	{ isChecked: true, text: 'Unlimited access to the Guardian app' },
	{
		isChecked: true,
		text: 'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
	},
	{ isChecked: true, text: 'Unlimited access to the Guardian Feast app' },
];
const SupporterPlusBenefitsUS = [
	{ isChecked: true, text: 'Far fewer asks for support' },
	{ isChecked: true, text: 'Ad-free reading on all your devices' },
	{ isChecked: true, text: 'Unlimited access to the Guardian app' },
	{
		isChecked: true,
		text: 'Regular dispatches from the newsroom to see the impact of your support',
	},
	{ isChecked: true, text: 'Unlimited access to the Guardian Feast app' },
];
const SupporterPlusBenefitsAUD = [
	{ isChecked: true, text: 'Far fewer asks for support' },
	{ isChecked: true, text: 'Ad-free reading on all your devices' },
	{ isChecked: true, text: 'Unlimited access to the Guardian app' },
	{
		isChecked: true,
		text: 'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
	},
	{ isChecked: true, text: 'Exclusive access to partner offers' },
	{
		isChecked: true,
		text: 'Unlimited access to the Guardian Feast app',
	},
];
const DigitalSubscriptionBenefits = [
	{ isChecked: true, text: 'Guardian Weekly e-magazine' },
	{ isChecked: true, text: 'The Long Read e-magazine' },
	{
		isChecked: true,
		text: 'Digital access to the Guardian’s 200 year newspaper archive',
	},
	{ isChecked: true, text: 'Far fewer asks for support' },
	{ isChecked: true, text: 'Ad-free reading on all your devices' },
	{ isChecked: true, text: 'Unlimited access to the Guardian app' },
	{
		isChecked: true,
		text: 'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
	},
	{
		isChecked: true,
		text: 'Unlimited access to the Guardian Feast app',
	},
];
const DigitalSubscriptionBenefitsAUD = [
	{ isChecked: true, text: 'Guardian Weekly e-magazine' },
	{ isChecked: true, text: 'The Long Read e-magazine' },
	{
		isChecked: true,
		text: 'Digital access to the Guardian’s 200 year newspaper archive',
	},
	{ isChecked: true, text: 'Far fewer asks for support' },
	{ isChecked: true, text: 'Ad-free reading on all your devices' },
	{ isChecked: true, text: 'Unlimited access to the Guardian app' },
	{
		isChecked: true,
		text: 'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
	},
	{ isChecked: true, text: 'Exclusive access to partner offers' },
	{
		isChecked: true,
		text: 'Unlimited access to the Guardian Feast app',
	},
];
const DigitalSubscriptionBenefitsUS = [
	{ isChecked: true, text: 'Guardian Weekly e-magazine' },
	{ isChecked: true, text: 'The Long Read e-magazine' },
	{
		isChecked: true,
		text: 'Digital access to the Guardian’s 200 year newspaper archive',
	},
	{ isChecked: true, text: 'Far fewer asks for support' },
	{ isChecked: true, text: 'Ad-free reading on all your devices' },
	{ isChecked: true, text: 'Unlimited access to the Guardian app' },
	{
		isChecked: true,
		text: 'Regular dispatches from the newsroom to see the impact of your support',
	},
	{
		isChecked: true,
		text: 'Unlimited access to the Guardian Feast app',
	},
];
const DigitalSubscriptionBenefitsGBP = [
	{ isChecked: true, text: 'Guardian Weekly e-magazine' },
	{ isChecked: true, text: 'The Long Read e-magazine' },
	{
		isChecked: true,
		text: 'Digital access to the Guardian’s 200 year newspaper archive',
	},
	{ isChecked: true, text: 'Daily digital Guardian newspaper' },
	{ isChecked: true, text: 'Far fewer asks for support' },
	{ isChecked: true, text: 'Ad-free reading on all your devices' },
	{ isChecked: true, text: 'Unlimited access to the Guardian app' },
	{
		isChecked: true,
		text: 'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
	},
	{
		isChecked: true,
		text: 'Unlimited access to the Guardian Feast app',
	},
];
export const expectedDefaultBenefits: Record<
	string,
	Record<string, BenefitsCheckListData[]>
> = {
	Contribution: {
		GBPCountries: ContributionBenefits,
		UnitedStates: ContributionBenefitsUS,
		AUDCountries: ContributionBenefitsAUD,
		EURCountries: ContributionBenefits,
		International: ContributionBenefits,
		NZDCountries: ContributionBenefits,
		Canada: ContributionBenefits,
	},
	SupporterPlus: {
		GBPCountries: SupporterPlusBenefits,
		UnitedStates: SupporterPlusBenefitsUS,
		AUDCountries: SupporterPlusBenefitsAUD,
		EURCountries: SupporterPlusBenefits,
		International: SupporterPlusBenefits,
		NZDCountries: SupporterPlusBenefits,
		Canada: SupporterPlusBenefits,
	},
	DigitalSubscription: {
		GBPCountries: DigitalSubscriptionBenefitsGBP,
		UnitedStates: DigitalSubscriptionBenefitsUS,
		AUDCountries: DigitalSubscriptionBenefitsAUD,
		EURCountries: DigitalSubscriptionBenefits,
		International: DigitalSubscriptionBenefits,
		NZDCountries: DigitalSubscriptionBenefits,
		Canada: DigitalSubscriptionBenefits,
	},
};
