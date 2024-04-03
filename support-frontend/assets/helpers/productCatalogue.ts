import { newspaperCountries } from 'helpers/internationalisation/country';
import { gwDeliverableCountries } from 'helpers/internationalisation/gwDeliverableCountries';

export const productCatalogDescription = {
	GuardianWeeklyAndSupporterPlus: {
		label: 'Digital + print',
		benefitsSummary: 'The rewards from All-access digital',
		benefits: [
			{
				text: 'Guardian Weekly print magazine delivered to your door every week',
			},
		],
	},
	DigitalSubscription: {
		label: 'The Guardian Digital Edition',
		benefits: [
			{
				text: 'The Editions app. Enjoy the Guardian and Observer newspaper, reimagined for mobile and tablet',
			},
			{ text: 'Full access to our news app. Read our reporting on the go' },
			{ text: 'Ad-free reading. Avoid ads on all your devices' },
			{
				text: 'Free 14 day trial. Enjoy a free trial of your subscription, before you pay',
			},
		],
	},
	NationalDelivery: {
		label: 'National Delivery',
		delivery: true,
		addressCountries: newspaperCountries,
	},
	SupporterPlus: {
		label: 'All-access digital',
		benefits: [
			{ text: 'Unlimited access to the Guardian app' },
			{ text: 'Ad-free reading on all your devices' },
			{
				text: 'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
			},
			{ text: 'Far fewer asks for support' },
		],
	},
	GuardianWeeklyRestOfWorld: {
		label: 'The Guardian Weekly',
		delivery: true,
		addressCountries: gwDeliverableCountries,
	},
	GuardianWeeklyDomestic: {
		label: 'The Guardian Weekly',
		delivery: true,
		addressCountries: gwDeliverableCountries,
	},
	SubscriptionCard: {
		label: 'Newspaper subscription',
		delivery: true,
	},
	Contribution: {
		label: 'Support',
		benefits: [
			{
				text: 'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
			},
		],
	},
	HomeDelivery: {
		label: 'Home Delivery',
		delivery: true,
		addressCountries: newspaperCountries,
	},
};
