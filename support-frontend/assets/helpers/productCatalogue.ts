import { newspaperCountries } from 'helpers/internationalisation/country';
import { gwDeliverableCountries } from 'helpers/internationalisation/gwDeliverableCountries';

export const productCatalogDescription = {
	GuardianWeeklyAndSupporterPlus: {
		label: 'Digital + print',
		benefitsSummary: 'The rewards from All-access digital',
		benefits: [
			{
				copy: 'Guardian Weekly print magazine delivered to your door every week',
			},
		],
	},
	DigitalSubscription: {
		label: 'The Guardian Digital Edition',
		benefits: [
			{
				copy: 'The Editions app. Enjoy the Guardian and Observer newspaper, reimagined for mobile and tablet',
			},
			{ copy: 'Full access to our news app. Read our reporting on the go' },
			{ copy: 'Ad-free reading. Avoid ads on all your devices' },
			{
				copy: 'Free 14 day trial. Enjoy a free trial of your subscription, before you pay',
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
			{
				copy: 'Unlimited access to the Guardian app',
				tooltip: `Read beyond our 20 article-per-month limit, enjoy offline access and personalised recommendations, and access our full archive of journalism. Never miss a story with the Guardian News app – a beautiful, intuitive reading experience.`,
			},
			{ copy: 'Ad-free reading on all your devices' },
			{
				copy: 'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
			},
			{
				copy: 'Far fewer asks for support',
				tooltip: `You'll see far fewer financial support asks at the bottom of articles or in pop-up banners.`,
			},
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
				copy: 'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
			},
		],
	},
	HomeDelivery: {
		label: 'Home Delivery',
		delivery: true,
		addressCountries: newspaperCountries,
	},
};

export const supporterPlusWithGuardianWeekly = {
	ratePlans: {
		MonthlyWithGuardianWeekly: {
			id: '',
			pricing: {
				USD: 43,
				NZD: 67,
				EUR: 36.5,
				GBP: 25,
				CAD: 46,
				AUD: 57,
			},
			charges: {
				Subscription: {
					id: '',
				},
			},
		},
		AnnualWithGuardianWeekly: {
			id: '',
			pricing: {
				USD: 480,
				NZD: 760,
				EUR: 413,
				GBP: 275,
				CAD: 516,
				AUD: 640,
			},
			charges: {
				Contribution: {
					id: '',
				},
			},
		},
		MonthlyWithGuardianWeeklyInt: {
			id: '',
			pricing: {
				USD: 46,
			},
			charges: {
				Subscription: {
					id: '',
				},
			},
		},
		AnnualWithGuardianWeeklyInt: {
			id: '',
			pricing: {
				USD: 516,
			},
			charges: {
				Subscription: {
					id: '',
				},
			},
		},
	},
} as const;

export const supporterPlusWithGuardianWeeklyPromos = {
	GBPCountries: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_UK_ANNUAL',
		discountedPrice: 173,
		discount: {
			amount: 37.09,
			durationMonths: 12,
		},
	},
	EURCountries: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_EU_ANNUAL',
		discountedPrice: 302,
		discount: {
			amount: 26.88,
			durationMonths: 12,
		},
	},
	Internaltional: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_INT_ANNUAL',
		discountedPrice: 367,
		discount: {
			amount: 28.88,
			durationMonths: 12,
		},
	},
	UnitedStates: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_US_ANNUAL',
		discountedPrice: 378,
		discount: {
			amount: 21.25,
			durationMonths: 12,
		},
	},
	Canada: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_CA_ANNUAL',
		discountedPrice: 378,
		discount: {
			amount: 26.74,
			durationMonths: 12,
		},
	},
	NZDCountries: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_NZ_ANNUAL',
		discountedPrice: 551,
		discount: {
			amount: 27.5,
			durationMonths: 12,
		},
	},
	AUDCountries: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_AU_ANNUAL',
		discountedPrice: 486,
		discount: {
			amount: 24.06,
			durationMonths: 12,
		},
	},
};
