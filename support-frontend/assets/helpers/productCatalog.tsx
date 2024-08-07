import type { ProductKey } from '@guardian/support-service-lambdas/modules/product-catalog/src/productCatalog';
import { typeObject } from '@guardian/support-service-lambdas/modules/product-catalog/src/typeObject';
import { OfferFeast } from 'components/offer/offer';
import { newspaperCountries } from './internationalisation/country';
import type { CountryGroupId } from './internationalisation/countryGroup';
import { gwDeliverableCountries } from './internationalisation/gwDeliverableCountries';

export type { ProductKey };

export const productCatalog = window.guardian.productCatalog;

type ProductBenefit = {
	copy: string;
	tooltip?: string;
	specificToRegions?: CountryGroupId[];
};

export type ProductDescription = {
	label: string;
	benefits: ProductBenefit[];
	benefitsAdditional?: ProductBenefit[];
	benefitsMissing?: ProductBenefit[];
	benefitsSummary?: Array<string | { strong: boolean; copy: string }>;
	offers?: Array<{ copy: JSX.Element; tooltip?: string }>;
	offersSummary?: Array<string | { strong: boolean; copy: string }>;
	deliverableTo?: Record<string, string>;
	ratePlans: Record<
		string,
		{
			billingPeriod: 'Annual' | 'Monthly' | 'Quarterly';
		}
	>;
};

export function filterBenefitByRegion(
	benefit: {
		specificToRegions?: CountryGroupId[];
	},
	countryGroupId: CountryGroupId,
) {
	if (benefit.specificToRegions !== undefined) {
		return benefit.specificToRegions.includes(countryGroupId);
	}

	return true;
}

export const productKeys = Object.keys(typeObject) as ProductKey[];
export function isProductKey(val: unknown): val is ProductKey {
	return productKeys.includes(val as ProductKey);
}

export const productCatalogDescription: Record<ProductKey, ProductDescription> =
	{
		TierThree: {
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
			/** These are just the SupporterPlus benefits */
			benefitsAdditional: [
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
				{
					copy: 'Exclusive access to partner offers',
					tooltip:
						'Access to special offers (such as free and discounted tickets) from our values-aligned partners, including museums, festivals and cultural institutions.',
					specificToRegions: ['AUDCountries'],
				},
			],
			deliverableTo: gwDeliverableCountries,
			ratePlans: {
				DomesticMonthly: {
					billingPeriod: 'Monthly',
				},
				DomesticAnnual: {
					billingPeriod: 'Annual',
				},
				RestOfWorldMonthly: {
					billingPeriod: 'Monthly',
				},
				RestOfWorldAnnual: {
					billingPeriod: 'Annual',
				},
			},
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
					billingPeriod: 'Monthly',
				},
				Annual: {
					billingPeriod: 'Annual',
				},
				ThreeMonthGift: {
					billingPeriod: 'Monthly',
				},
				OneYearGift: {
					billingPeriod: 'Annual',
				},
			},
		},
		NationalDelivery: {
			label: 'National Delivery',
			benefits: [],
			deliverableTo: newspaperCountries,
			ratePlans: {
				Sixday: {
					billingPeriod: 'Monthly',
				},
				Weekend: {
					billingPeriod: 'Annual',
				},
				Everyday: {
					billingPeriod: 'Monthly',
				},
			},
		},
		SupporterPlus: {
			label: 'All-access digital',
			/** These are duplicated in the TierThree benefitsAdditional */
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
				{
					copy: 'Exclusive access to partner offers',
					tooltip:
						'Access to special offers (such as free and discounted tickets) from our values-aligned partners, including museums, festivals and cultural institutions.',
					specificToRegions: ['AUDCountries'],
				},
			],
			offers: [
				{
					copy: <OfferFeast></OfferFeast>,
				},
			],
			ratePlans: {
				Monthly: {
					billingPeriod: 'Monthly',
				},
				Annual: {
					billingPeriod: 'Annual',
				},
			},
		},
		GuardianWeeklyRestOfWorld: {
			label: 'The Guardian Weekly',
			benefits: [],
			deliverableTo: gwDeliverableCountries,
			ratePlans: {
				Monthly: {
					billingPeriod: 'Monthly',
				},
				OneYearGift: {
					billingPeriod: 'Annual',
				},
				Annual: {
					billingPeriod: 'Annual',
				},
				SixWeekly: {
					billingPeriod: 'Monthly',
				},
				Quarterly: {
					billingPeriod: 'Quarterly',
				},
				ThreeMonthGift: {
					billingPeriod: 'Monthly',
				},
			},
		},
		GuardianWeeklyDomestic: {
			label: 'The Guardian Weekly',
			benefits: [],
			deliverableTo: gwDeliverableCountries,
			ratePlans: {
				Monthly: {
					billingPeriod: 'Monthly',
				},
				OneYearGift: {
					billingPeriod: 'Annual',
				},
				Annual: {
					billingPeriod: 'Annual',
				},
				SixWeekly: {
					billingPeriod: 'Monthly',
				},
				Quarterly: {
					billingPeriod: 'Quarterly',
				},
				ThreeMonthGift: {
					billingPeriod: 'Monthly',
				},
			},
		},
		SubscriptionCard: {
			label: 'Newspaper subscription',
			benefits: [],
			ratePlans: {
				Sixday: {
					billingPeriod: 'Monthly',
				},
				Everyday: {
					billingPeriod: 'Monthly',
				},
				Weekend: {
					billingPeriod: 'Monthly',
				},
				Sunday: {
					billingPeriod: 'Monthly',
				},
				Saturday: {
					billingPeriod: 'Monthly',
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
			benefitsMissing: [
				{
					copy: 'Unlimited access to the Guardian app',
					tooltip: `Read beyond our 20 article-per-month limit, enjoy offline access and personalised recommendations, and access our full archive of journalism. Never miss a story with the Guardian News app – a beautiful, intuitive reading experience.`,
				},
				{ copy: 'Ad-free reading on all your devices' },
				{
					copy: 'Far fewer asks for support',
					tooltip: `You'll see far fewer financial support asks at the bottom of articles or in pop-up banners.`,
				},
				{
					copy: 'Unlimited access to the Guardian Feast App',
				},
				{
					copy: 'Exclusive access to partner offers',
					tooltip:
						'Access to special offers (such as free and discounted tickets) from our values-aligned partners, including museums, festivals and cultural institutions.',
					specificToRegions: ['AUDCountries'],
				},
			],
			ratePlans: {
				Monthly: {
					billingPeriod: 'Monthly',
				},
				Annual: {
					billingPeriod: 'Annual',
				},
			},
		},
		HomeDelivery: {
			label: 'Home Delivery',
			benefits: [],
			deliverableTo: newspaperCountries,
			ratePlans: {
				Everyday: {
					billingPeriod: 'Monthly',
				},
				Sunday: {
					billingPeriod: 'Monthly',
				},
				Sixday: {
					billingPeriod: 'Monthly',
				},
				Weekend: {
					billingPeriod: 'Monthly',
				},
				Saturday: {
					billingPeriod: 'Monthly',
				},
			},
		},
	};

/**
 * We need `SupporterPlusWithGuardianWeekly` for the the landing page while we migrate
 * away from the hacked TierThree product to the actual TierThree product below.
 */
export const supporterPlusWithGuardianWeekly = {
	ratePlans: {
		MonthlyWithGuardianWeekly: {
			id: '',
			pricing: {
				USD: 45,
				NZD: 70,
				EUR: 38.5,
				GBP: 27,
				CAD: 48,
				AUD: 60,
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
				USD: 510,
				NZD: 800,
				EUR: 438,
				GBP: 300,
				CAD: 546,
				AUD: 680,
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
				USD: 48,
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
				USD: 546,
			},
			charges: {
				Subscription: {
					id: '',
				},
			},
		},
	},
} as const;

export const supporterPlusWithGuardianWeeklyDescription: ProductDescription = {
	label: 'Digital + print',
	benefitsSummary: ['The rewards from All-access digital'],
	offersSummary: [
		{
			strong: true,
			copy: `including unlimited access to the Guardian Feast App.`,
		},
	],
	benefits: [
		{
			copy: 'Guardian Weekly print magazine delivered to your door every week  ',
			tooltip: `Guardian Weekly is a beautifully concise magazine featuring a handpicked selection of in-depth articles, global news, long reads, opinion and more. Delivered to you every week, wherever you are in the world.`,
		},
	],
	deliverableTo: gwDeliverableCountries,
	ratePlans: {
		MonthlyWithGuardianWeekly: {
			billingPeriod: 'Monthly',
		},
		AnnualWithGuardianWeekly: {
			billingPeriod: 'Annual',
		},
		MonthlyWithGuardianWeeklyInt: {
			billingPeriod: 'Monthly',
		},
		AnnualWithGuardianWeeklyInt: {
			billingPeriod: 'Annual',
		},
	},
};

export const supporterPlusWithGuardianWeeklyAnnualPromos = {
	GBPCountries: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_UK_ANNUAL_V2',
		discountedPrice: 190,
		discount: {
			amount: 36.6667,
			durationMonths: 12,
		},
	},
	EURCountries: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_EU_ANNUAL_V2',
		discountedPrice: 325,
		discount: {
			amount: 25.7991,
			durationMonths: 12,
		},
	},
	International: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_INT_ANNUAL_V2',
		discountedPrice: 390,
		discount: {
			amount: 28.5714,
			durationMonths: 12,
		},
	},
	UnitedStates: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_US_ANNUAL_V2',
		discountedPrice: 405,
		discount: {
			amount: 20.5882,
			durationMonths: 12,
		},
	},
	Canada: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_CA_ANNUAL_V2',
		discountedPrice: 400,
		discount: {
			amount: 26.7399,
			durationMonths: 12,
		},
	},
	NZDCountries: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_NZ_ANNUAL_V2',
		discountedPrice: 580,
		discount: {
			amount: 27.5,
			durationMonths: 12,
		},
	},
	AUDCountries: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_AU_ANNUAL_V2',
		discountedPrice: 520,
		discount: {
			amount: 23.5294,
			durationMonths: 12,
		},
	},
};

export const supporterPlusWithGuardianWeeklyMonthlyPromos = {
	GBPCountries: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_UK_MONTHLY_V2',
		discountedPrice: 18,
		discount: {
			amount: 33.33,
			durationMonths: 12,
		},
	},
	EURCountries: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_EU_MONTHLY_V2',
		discountedPrice: 30,
		discount: {
			amount: 22.09,
			durationMonths: 12,
		},
	},
	International: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_INT_MONTHLY_V2',
		discountedPrice: 36,
		discount: {
			amount: 25,
			durationMonths: 12,
		},
	},
	UnitedStates: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_US_MONTHLY_V2',
		discountedPrice: 37,
		discount: {
			amount: 17.77,
			durationMonths: 12,
		},
	},
	Canada: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_CA_MONTHLY_V2',
		discountedPrice: 37,
		discount: {
			amount: 22.92,
			durationMonths: 12,
		},
	},
	NZDCountries: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_NZ_MONTHLY_V2',
		discountedPrice: 54,
		discount: {
			amount: 22.8571,
			durationMonths: 12,
		},
	},
	AUDCountries: {
		name: 'SupportPlusAndGuardianWeekly',
		description: 'Supporter Plus and Guardian Weekly',
		promoCode: '3TIER_WEEKLY_AU_MONTHLY_V2',
		discountedPrice: 48,
		discount: {
			amount: 20.0,
			durationMonths: 12,
		},
	},
};
