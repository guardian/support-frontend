import type { ActiveProductKey } from '@guardian/support-service-lambdas/modules/product-catalog/src/productCatalog';
import { activeTypeObject } from '@guardian/support-service-lambdas/modules/product-catalog/src/typeObject';
import type { Participations } from './abTests/abtest';
import { newspaperCountries } from './internationalisation/country';
import type {
	CountryGroupId,
	SupportInternationalisationId,
} from './internationalisation/countryGroup';
import { gwDeliverableCountries } from './internationalisation/gwDeliverableCountries';

export type { ActiveProductKey };

export const productCatalog = window.guardian.productCatalog;

type ProductBenefit = {
	copy: string;
	tooltip?: string;
	specificToRegions?: CountryGroupId[];
	specificToAbTest?: Array<{
		name: string;
		variants: string[];
		display: boolean;
	}>;
	isNew?: boolean;
	hideBullet?: boolean;
};

export type ProductDescription = {
	label: string;
	thankyouMessage?: string;
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

export function filterBenefitByABTest(
	benefit: ProductBenefit,
	participations?: Participations,
) {
	return benefit.specificToAbTest
		? displayBenefitByABTest(benefit.specificToAbTest, participations)
		: true; // no abtests, default display benefit
}
function displayBenefitByABTest(
	displayOnAbTest: Array<{
		name: string;
		variants: string[];
		display: boolean;
	}>,
	participations: Participations = {},
) {
	return displayOnAbTest.some(
		({ name, variants, display }) =>
			participations[name]
				? displayBenefitByABTestVariant(
						variants.includes(participations[name] ?? ''), // Participations used throughout typed as { string : string | undefined }
						display,
				  )
				: !display, // abtest not found, display opposite
	);
}
function displayBenefitByABTestVariant(
	variantFound: boolean,
	display: boolean,
) {
	return display ? variantFound : !variantFound; // abtest variantFound opposite if hiding
}

export const productKeys = Object.keys(activeTypeObject) as ActiveProductKey[];
export function isProductKey(val: unknown): val is ActiveProductKey {
	return productKeys.includes(val as ActiveProductKey);
}

const appBenefit = {
	copy: 'Full access to the Guardian app',
	tooltip: `Read beyond our 20 article-per-month limit, enjoy offline access and personalised recommendations, and access our full archive of journalism. Never miss a story with the Guardian News app – a beautiful, intuitive reading experience.`,
};
const addFreeBenefit = {
	copy: 'Ad-free reading on all your devices',
	specificToAbTest: [
		{ name: 'adFreeTierThree', variants: ['v1', 'v2'], display: false },
	],
};
const addFreeBenefitTierThree = {
	copy: 'Ad-free reading on all your devices',
	specificToAbTest: [
		{ name: 'adFreeTierThree', variants: ['v1'], display: true },
	],
};
const newsletterBenefit = {
	copy: 'Regular dispatches from the newsroom to see the impact of your support',
};
const fewerAsksBenefit = {
	copy: 'Far fewer asks for support',
	tooltip: `You'll see far fewer financial support asks at the bottom of articles or in pop-up banners.`,
};
const partnerOffersBenefit = {
	copy: 'Exclusive access to partner offers',
	tooltip:
		'Access to special offers (such as free and discounted tickets) from our values-aligned partners, including museums, festivals and cultural institutions.',
	specificToRegions: ['AUDCountries'],
};
const guardianWeeklyBenefit = {
	copy: 'Guardian Weekly print magazine delivered to your door every week  ',
	tooltip: `Guardian Weekly is a beautifully concise magazine featuring a handpicked selection of in-depth articles, global news, long reads, opinion and more. Delivered to you every week, wherever you are in the world.`,
};
const feastBenefit = {
	copy: 'Unlimited access to the Guardian Feast app',
	isNew: true,
	tooltip:
		'Make a feast out of anything with the Guardian’s new recipe app. Feast has thousands of recipes including quick and budget-friendly weeknight dinners, and showstopping weekend dishes – plus smart app features to make mealtimes inspiring.',
};

const supporterPlusBenefits = [
	fewerAsksBenefit,
	newsletterBenefit,
	addFreeBenefit,
	appBenefit,
	partnerOffersBenefit,
	feastBenefit,
];

const guardianAdLiteBenefits = [
	{
		copy: 'A Guardian Ad-Lite subscription enables you to read the Guardian without personalised advertising.',
	},
	{
		copy: 'If you already read the Guardian ad-free you should sign in.',
	},
	{ copy: 'You can cancel anytime.' },
];

export const productCatalogDescription: Record<
	ActiveProductKey,
	ProductDescription
> = {
	GuardianLight: {
		label: 'Guardian Ad-Lite',
		thankyouMessage: `Your valued support powers our journalism${' '}`,
		ratePlans: {
			Monthly: {
				billingPeriod: 'Monthly',
			},
		},
		benefits: guardianAdLiteBenefits,
	},
	GuardianAdLite: {
		label: 'Guardian Ad-Lite',
		thankyouMessage: `Your valued support powers our journalism${' '}`,
		ratePlans: {
			Monthly: {
				billingPeriod: 'Monthly',
			},
		},
		benefits: guardianAdLiteBenefits,
	},
	TierThree: {
		label: 'Digital + print',
		thankyouMessage: `You'll receive a confirmation email containing everything you need to know about your subscription, including additional emails on how to make the most of your subscription.${' '}`,
		benefitsSummary: [
			'The rewards from ',
			{ strong: true, copy: 'All-access digital' },
		],
		benefits: [addFreeBenefitTierThree, guardianWeeklyBenefit],
		/** These are just the SupporterPlus benefits */
		benefitsAdditional: supporterPlusBenefits,
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
			DomesticMonthlyV2: {
				billingPeriod: 'Monthly',
			},
			DomesticAnnualV2: {
				billingPeriod: 'Annual',
			},
			RestOfWorldMonthlyV2: {
				billingPeriod: 'Monthly',
			},
			RestOfWorldAnnualV2: {
				billingPeriod: 'Annual',
			},
		},
	},
	DigitalSubscription: {
		label: 'The Guardian Digital Edition',
		benefits: [
			{
				copy: 'The Digital Edition app. Enjoy the Guardian and Observer newspaper, available for mobile and tablet',
			},
			{
				copy: 'Full access to the Guardian app. Read our reporting on the go',
			},
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
		benefits: supporterPlusBenefits,
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
		benefits: [newsletterBenefit],
		benefitsMissing: [
			appBenefit,
			addFreeBenefit,
			fewerAsksBenefit,
			{
				copy: 'Unlimited access to the Guardian Feast app',
			},
			partnerOffersBenefit,
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
	OneTimeContribution: {
		label: 'One-time contribution',
		benefits: [fewerAsksBenefit],
		// Omit one time rate plans for now. We don't expect to use this data and the types in support-frontend
		// can't handle a billingPeriod of OneTime.
		ratePlans: {},
	},
	GuardianPatron: {
		label: 'Guardian Patron',
		benefits: [
			{
				copy: 'The Digital Edition app. Enjoy the Guardian and Observer newspaper, available for mobile and tablet',
			},
			{
				copy: 'Full access to the Guardian app. Read our reporting on the go',
			},
			{
				copy: 'Free 14 day trial. Enjoy a free trial of your subscription, before you pay',
			},
		],
		ratePlans: {
			GuardianPatron: {
				billingPeriod: 'Monthly',
			},
		},
	},
};

export function productCatalogDescriptionNewBenefits(
	countryGroupId: CountryGroupId,
) {
	return {
		...productCatalogDescription,
		TierThree: {
			...productCatalogDescription.TierThree,
			benefits: [
				...productCatalogDescription.TierThree.benefits,
				{
					copy: `Unlimited access to the Guardian's 200-year newspaper archive`,
					isNew: true,
					tooltip: `Look back on more than 200 years of world history with the Guardian newspaper archive. Get digital access to every front page, article and advertisement, as it was printed${
						countryGroupId !== 'GBPCountries' ? ' in the UK' : ''
					}, since 1821.`,
				},
			],
		},
	};
}

export function productCatalogGuardianAdLite(): Record<
	ActiveProductKey | 'GuardianAdLiteGoBack',
	ProductDescription
> {
	return {
		...productCatalogDescription,
		GuardianAdLite: {
			...productCatalogDescription.GuardianAdLite,
			label: 'Purchase Guardian Ad-Lite',
		},
		GuardianAdLiteGoBack: {
			...productCatalogDescription.GuardianAdLite,
			label: 'Read the Guardian with personalised ads',
			benefits: [
				{
					copy: `Click ‘Go back to Accept all’ if you do not want to subscribe to Guardian Ad-Lite.`,
					hideBullet: true,
				},
			],
		},
	};
}

/**
 * This method is to help us determine which product and rateplan to
 * use based on a person's internationalisation ID.
 *
 * The reason this exists is because we have different pricing for
 * `int` and `us` for SupporterPlus and GuardianWeekly, but they
 * both use `USD`.
 *
 * As Zuora is restricted to only being able to vary on currency,
 * we express this in the product catalog by having different products
 * for GuardianWeekly, and different ratePlans for SupporterPlus.
 *
 * We are potentially going to look at Attribute based pricing in the future.
 *
 * @see: https://knowledgecenter.zuora.com/Zuora_Billing/Build_products_and_prices/Attribute-based_pricing/AA_Overview_of_Attribute-based_Pricing
 * */
export function internationaliseProductAndRatePlan(
	supportInternationalisationId: SupportInternationalisationId,
	productKey: ActiveProductKey,
	ratePlanKey: string,
): { productKey: ActiveProductKey; ratePlanKey: string } {
	let productKeyToUse = productKey;
	let ratePlanToUse = ratePlanKey;

	if (productKey === 'TierThree') {
		if (supportInternationalisationId === 'int') {
			if (ratePlanKey === 'DomesticAnnual') {
				ratePlanToUse = 'RestOfWorldAnnual';
			}
			if (ratePlanKey === 'DomesticMonthly') {
				ratePlanToUse = 'RestOfWorldMonthly';
			}
		} else {
			if (ratePlanKey === 'RestOfWorldAnnual') {
				ratePlanToUse = 'DomesticAnnual';
			}
			if (ratePlanKey === 'RestOfWorldMonthly') {
				ratePlanToUse = 'DomesticMonthly';
			}
		}
	}

	if (
		productKey === 'GuardianWeeklyDomestic' ||
		productKey === 'GuardianWeeklyRestOfWorld'
	) {
		if (supportInternationalisationId === 'int') {
			productKeyToUse = 'GuardianWeeklyRestOfWorld';
		} else {
			productKeyToUse = 'GuardianWeeklyDomestic';
		}
	}

	return { productKey: productKeyToUse, ratePlanKey: ratePlanToUse };
}
