import { newspaperCountries } from './internationalisation/country';
import { gwDeliverableCountries } from './internationalisation/gwDeliverableCountries';

export const productCatalog = window.guardian.productCatalog;

export type ProductDescription = {
	label: string;
	benefits: Array<{ copy: string; tooltip?: string }>;
	benefitsSummary?: Array<string | { strong: boolean; copy: string }>;
	offers?: Array<{ copy: JSX.Element; tooltip?: string }>;
	offersSummary?: Array<string | { strong: boolean; copy: string }>;
	ratePlans: Record<string, { billingPeriod: 'Annual' | 'Month' | 'Quarter' }>;
	deliverableTo?: Record<string, string>;
};

export const productCatalogDescription: Record<string, ProductDescription> = {
	SupporterPlusWithGuardianWeekly: {
		label: 'Digital + print',
		benefitsSummary: [
			'The rewards from ',
			{ strong: true, copy: 'All-access digital' },
		],
		benefits: [
			{
				copy: 'Guardian Weekly print magazine delivered to your door every week  ',
				tooltip: `Guardian Weekly is a beautifully concise magazine featuring a handpicked selection of in-depth articles, global news, long reads, opinion and more. Delivered to you every week, wherever you are in the world.`,
			},
		],
		ratePlans: {
			MonthlyWithGuardianWeekly: {
				billingPeriod: 'Month',
			},
			AnnualWithGuardianWeekly: {
				billingPeriod: 'Annual',
			},
			MonthlyWithGuardianWeeklyInt: {
				billingPeriod: 'Month',
			},
			AnnualWithGuardianWeeklyInt: {
				billingPeriod: 'Annual',
			},
		},
		deliverableTo: gwDeliverableCountries,
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
		ratePlans: {
			Monthly: {
				billingPeriod: 'Month',
			},
			Annual: {
				billingPeriod: 'Annual',
			},
			ThreeMonthGift: {
				billingPeriod: 'Month',
			},
			OneYearGift: {
				billingPeriod: 'Annual',
			},
		},
	},
	NationalDelivery: {
		label: 'National Delivery',
		benefits: [],
		ratePlans: {
			Sixday: {
				billingPeriod: 'Month',
			},
			Weekend: {
				billingPeriod: 'Annual',
			},
			Everyday: {
				billingPeriod: 'Month',
			},
		},
		deliverableTo: newspaperCountries,
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
		ratePlans: {
			Monthly: {
				billingPeriod: 'Month',
			},
			Annual: {
				billingPeriod: 'Annual',
			},
		},
	},
	GuardianWeeklyRestOfWorld: {
		label: 'The Guardian Weekly',
		benefits: [],
		ratePlans: {
			Monthly: {
				billingPeriod: 'Month',
			},
			OneYearGift: {
				billingPeriod: 'Annual',
			},
			Annual: {
				billingPeriod: 'Annual',
			},
			SixWeekly: {
				billingPeriod: 'Month',
			},
			Quarterly: {
				billingPeriod: 'Quarter',
			},
			ThreeMonthGift: {
				billingPeriod: 'Month',
			},
		},
		deliverableTo: gwDeliverableCountries,
	},
	GuardianWeeklyDomestic: {
		label: 'The Guardian Weekly',
		benefits: [],
		ratePlans: {
			Monthly: {
				billingPeriod: 'Month',
			},
			OneYearGift: {
				billingPeriod: 'Annual',
			},
			Annual: {
				billingPeriod: 'Annual',
			},
			SixWeekly: {
				billingPeriod: 'Month',
			},
			Quarterly: {
				billingPeriod: 'Quarter',
			},
			ThreeMonthGift: {
				billingPeriod: 'Month',
			},
		},
		deliverableTo: gwDeliverableCountries,
	},
	SubscriptionCard: {
		label: 'Newspaper subscription',
		benefits: [],
		ratePlans: {
			Sixday: {
				billingPeriod: 'Month',
			},
			Everyday: {
				billingPeriod: 'Month',
			},
			Weekend: {
				billingPeriod: 'Month',
			},
			Sunday: {
				billingPeriod: 'Month',
			},
			Saturday: {
				billingPeriod: 'Month',
			},
		},
	},
	Contribution: {
		label: 'Support',
		benefits: [
			{
				copy: 'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
			},
		],
		ratePlans: {
			Monthly: {
				billingPeriod: 'Month',
			},
			Annual: {
				billingPeriod: 'Annual',
			},
		},
	},
	HomeDelivery: {
		label: 'Home Delivery',
		benefits: [],
		ratePlans: {
			Everyday: {
				billingPeriod: 'Month',
			},
			Sunday: {
				billingPeriod: 'Month',
			},
			Sixday: {
				billingPeriod: 'Month',
			},
			Weekend: {
				billingPeriod: 'Month',
			},
			Saturday: {
				billingPeriod: 'Month',
			},
		},
		deliverableTo: newspaperCountries,
	},
};

/** These `ratePlans` will eventually becomes part of the SupportPlus product in Zuora */
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

export const supporterPlusWithGuardianWeeklyAnnualPromos = {
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
	International: {
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

export const supporterPlusWithGuardianWeeklyMonthlyPromos = {
	GBPCountries: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_UK_MONTHLY',
		discountedPrice: 16,
		discount: {
			amount: 36,
			durationMonths: 12,
		},
	},
	EURCountries: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_EU_MONTHLY',
		discountedPrice: 28,
		discount: {
			amount: 23.29,
			durationMonths: 12,
		},
	},
	International: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_INT_MONTHLY',
		discountedPrice: 34,
		discount: {
			amount: 26.09,
			durationMonths: 12,
		},
	},
	UnitedStates: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_US_MONTHLY',
		discountedPrice: 35,
		discount: {
			amount: 18.6,
			durationMonths: 12,
		},
	},
	Canada: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_CA_MONTHLY',
		discountedPrice: 35,
		discount: {
			amount: 23.91,
			durationMonths: 12,
		},
	},
	NZDCountries: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_NZ_MONTHLY',
		discountedPrice: 51,
		discount: {
			amount: 23.88,
			durationMonths: 12,
		},
	},
	AUDCountries: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_AU_MONTHLY',
		discountedPrice: 45,
		discount: {
			amount: 21.05,
			durationMonths: 12,
		},
	},
};
