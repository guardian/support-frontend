import { newspaperCountries } from '@modules/internationalisation/country';
import type {
	CountryGroupId,
	SupportInternationalisationId,
} from '@modules/internationalisation/countryGroup';
import { gwDeliverableCountries } from '@modules/internationalisation/gwDeliverableCountries';
import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type {
	ProductKey,
	ProductRatePlanKey,
} from '@modules/product-catalog/productCatalog';
import type { Participations } from './abTests/models';

const activeProductKeys = [
	'GuardianWeeklyDomestic',
	'GuardianWeeklyRestOfWorld',
	'GuardianAdLite',
	'TierThree',
	'DigitalSubscription',
	'NationalDelivery',
	'HomeDelivery',
	'SupporterPlus',
	'SubscriptionCard',
	'Contribution',
	'OneTimeContribution',
] as const;

export type ActiveProductKey = Extract<
	ProductKey,
	(typeof activeProductKeys)[number]
>;

/*
 * Ideally, would prefer to loop the ActiveProductKey's generating an ActiveRatePlanKey
 */
type OneTimeContributionRatePlanKey = ProductRatePlanKey<'OneTimeContribution'>;
type GuardianAdLiteRatePlanKey = ProductRatePlanKey<'GuardianAdLite'>;
type TierThreeRatePlanKey = ProductRatePlanKey<'TierThree'>;
type DigitalSubscriptionRatePlanKey = ProductRatePlanKey<'DigitalSubscription'>;
type NationalDeliveryRatePlanKey = ProductRatePlanKey<'NationalDelivery'>;
type HomeDeliveryRatePlanKey = ProductRatePlanKey<'HomeDelivery'>;
type SupporterPlusRatePlanKey = ProductRatePlanKey<'SupporterPlus'>;
type GuardianWeeklyRestOfWorldRatePlanKey =
	ProductRatePlanKey<'GuardianWeeklyRestOfWorld'>;
type GuardianWeeklyDomesticRatePlanKey =
	ProductRatePlanKey<'GuardianWeeklyDomestic'>;
type SubscriptionCardRatePlanKey = ProductRatePlanKey<'SubscriptionCard'>;
type ContributionRatePlanKey = ProductRatePlanKey<'Contribution'>;

export type ActiveRatePlanKey = keyof {
	[Key in
		| OneTimeContributionRatePlanKey
		| GuardianAdLiteRatePlanKey
		| TierThreeRatePlanKey
		| DigitalSubscriptionRatePlanKey
		| NationalDeliveryRatePlanKey
		| HomeDeliveryRatePlanKey
		| SupporterPlusRatePlanKey
		| GuardianWeeklyRestOfWorldRatePlanKey
		| GuardianWeeklyDomesticRatePlanKey
		| SubscriptionCardRatePlanKey
		| ContributionRatePlanKey]: true;
};

export const productCatalog = window.guardian.productCatalog;

export type ProductBenefit = {
	copy: string;
	copyBoldStart?: string;
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

type RatePlanDetails = Record<
	string,
	{
		billingPeriod: RecurringBillingPeriod;
		label?: string;
		hideSimilarProductsConsent?: boolean;
		fixedTerm?: boolean;
	}
>;

export type ProductDescription = {
	label: string;
	thankyouMessage?: string;
	benefits: ProductBenefit[];
	landingPagePath: string;
	deliverableTo?: Record<string, string>;
	ratePlans: RatePlanDetails;
};

export const showSimilarProductsConsentForRatePlan = (
	productDescription: ProductDescription,
	ratePlanKey: ActiveRatePlanKey,
) => !productDescription.ratePlans[ratePlanKey]?.hideSimilarProductsConsent;

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

export function isProductKey(val: unknown): val is ActiveProductKey {
	return activeProductKeys.includes(val as ActiveProductKey);
}

const digitalEditionBenefit = {
	copy: 'Enjoy the Guardian and Observer newspaper, available for mobile and tablet',
	copyBoldStart: 'The Digital Edition app. ',
};

const appBenefit = {
	copy: 'Unlimited access to the Guardian app',
	tooltip: `Read beyond our 20 article-per-month limit, enjoy offline access and personalised recommendations, and access our full archive of journalism. Never miss a story with the Guardian News app – a beautiful, intuitive reading experience.`,
};
const addFreeBenefit = {
	copy: 'Ad-free reading on all your devices',
};

const supportBenefit = {
	copy: 'Give to the Guardian every month with Support',
	specificToRegions: [
		'GBPCountries',
		'EURCountries',
		'AUDCountries',
		'NZDCountries',
		'Canada',
		'International',
	] as CountryGroupId[],
	hideBullet: true,
};
const newsletterBenefitUS = {
	copy: 'Regular dispatches from the newsroom to see the impact of your support',
	specificToRegions: ['UnitedStates'] as CountryGroupId[],
};
const newsletterBenefit = {
	copy: 'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
	specificToRegions: [
		'GBPCountries',
		'EURCountries',
		'AUDCountries',
		'NZDCountries',
		'Canada',
		'International',
	] as CountryGroupId[],
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
	copy: 'Guardian Weekly print magazine delivered to your door every week',
	tooltip: `Guardian Weekly is a beautifully concise magazine featuring a handpicked selection of in-depth articles, global news, long reads, opinion and more. Delivered to you every week, wherever you are in the world.`,
};

const feastBenefit = {
	copy: 'Unlimited access to the Guardian Feast app',
	isNew: true,
	tooltip:
		'Make a feast out of anything with the Guardian’s new recipe app. Feast has thousands of recipes including quick and budget-friendly weeknight dinners, and showstopping weekend dishes – plus smart app features to make mealtimes inspiring.',
};

const supporterPlusBenefits = [
	appBenefit,
	addFreeBenefit,
	newsletterBenefit,
	newsletterBenefitUS,
	fewerAsksBenefit,
	partnerOffersBenefit,
	feastBenefit,
];

const guardianAdLiteBenefits = [
	{
		copy: 'A Guardian Ad-Lite subscription enables you to read the Guardian website without personalised advertising.',
	},
	{
		copy: 'You will still see non-personalised advertising.',
	},
	{ copy: 'You can cancel at any time.' },
];

const paperThankyouMessage = `Look out for an email from us confirming your subscription. It has everything you need to know about how to manage it in the future. As well as future communications on how to make the most of your subscription and weekly newsletters written by the editors. `;

const nationalPaperPlusRatePlans: RatePlanDetails = {
	Everyday: {
		billingPeriod: BillingPeriod.Monthly,
		label: 'Every day package',
	},
	EverydayPlus: {
		billingPeriod: BillingPeriod.Monthly,
		label: 'Every day package',
	},
	Sixday: {
		billingPeriod: BillingPeriod.Monthly,
		label: 'Six day package',
	},
	SixdayPlus: {
		billingPeriod: BillingPeriod.Monthly,
		label: 'Six day package',
	},
	Weekend: {
		billingPeriod: BillingPeriod.Monthly,
		label: 'Weekend package',
	},
	WeekendPlus: {
		billingPeriod: BillingPeriod.Monthly,
		label: 'Weekend package',
	},
};

const paperPlusRatePlans: RatePlanDetails = {
	...nationalPaperPlusRatePlans,
	Saturday: {
		billingPeriod: BillingPeriod.Monthly,
		label: 'Saturday package',
	},
	SaturdayPlus: {
		billingPeriod: BillingPeriod.Monthly,
		label: 'Saturday package',
	},
	Sunday: {
		billingPeriod: BillingPeriod.Monthly,
		label: 'The Observer',
		hideSimilarProductsConsent: true,
	},
	SundayPlus: {
		billingPeriod: BillingPeriod.Monthly,
		label: 'The Observer',
		hideSimilarProductsConsent: true,
	},
};

export const productCatalogDescription: Record<
	ActiveProductKey,
	ProductDescription
> = {
	GuardianAdLite: {
		label: 'Guardian Ad-Lite',
		thankyouMessage: `Your subscription powers our journalism.`,
		landingPagePath: '/guardian-ad-lite',
		ratePlans: {
			Monthly: {
				billingPeriod: BillingPeriod.Monthly,
				hideSimilarProductsConsent: true,
			},
		},
		benefits: guardianAdLiteBenefits,
	},
	TierThree: {
		label: 'Digital + print',
		thankyouMessage: `You'll receive a confirmation email containing everything you need to know about your subscription, including additional emails on how to make the most of your subscription.${' '}`,
		landingPagePath: '/contribute',
		benefits: [guardianWeeklyBenefit],
		/** These are just the SupporterPlus benefits */
		deliverableTo: gwDeliverableCountries,
		ratePlans: {
			DomesticMonthly: {
				billingPeriod: BillingPeriod.Monthly,
			},
			DomesticAnnual: {
				billingPeriod: BillingPeriod.Annual,
			},
			RestOfWorldMonthly: {
				billingPeriod: BillingPeriod.Monthly,
			},
			RestOfWorldAnnual: {
				billingPeriod: BillingPeriod.Annual,
			},
			DomesticMonthlyV2: {
				billingPeriod: BillingPeriod.Monthly,
			},
			DomesticAnnualV2: {
				billingPeriod: BillingPeriod.Annual,
			},
			RestOfWorldMonthlyV2: {
				billingPeriod: BillingPeriod.Monthly,
			},
			RestOfWorldAnnualV2: {
				billingPeriod: BillingPeriod.Annual,
			},
		},
	},
	DigitalSubscription: {
		label: 'The Guardian Digital Edition',
		thankyouMessage: `You have now unlocked access to the Guardian and Observer newspapers, which you can enjoy across all your devices, wherever you are in the world.
            Soon, you will receive weekly newsletters from our supporter editor. We'll also be in touch with other ways to get closer to our journalism. ${' '}`,
		landingPagePath: '/subscribe',
		benefits: [
			digitalEditionBenefit,
			{
				copy: 'Read our reporting on the go',
				copyBoldStart: 'Full access to the Guardian app. ',
			},
			{
				copy: 'Enjoy a free trial of your subscription, before you pay',
				copyBoldStart: 'Free 14 day trial. ',
			},
		],
		ratePlans: {
			Monthly: {
				billingPeriod: BillingPeriod.Monthly,
			},
			Annual: {
				billingPeriod: BillingPeriod.Annual,
			},
			ThreeMonthGift: {
				billingPeriod: BillingPeriod.Monthly,
			},
			OneYearGift: {
				billingPeriod: BillingPeriod.Annual,
			},
		},
	},
	SupporterPlus: {
		label: 'All-access digital',
		landingPagePath: '/contribute',
		benefits: supporterPlusBenefits,
		ratePlans: {
			Monthly: {
				billingPeriod: BillingPeriod.Monthly,
			},
			Annual: {
				billingPeriod: BillingPeriod.Annual,
			},
			OneYearStudent: {
				billingPeriod: BillingPeriod.Annual,
				fixedTerm: true,
			},
		},
	},
	GuardianWeeklyRestOfWorld: {
		label: 'The Guardian Weekly',
		landingPagePath: '/subscribe/weekly',
		benefits: [guardianWeeklyBenefit],
		deliverableTo: gwDeliverableCountries,
		ratePlans: {
			Monthly: {
				billingPeriod: BillingPeriod.Monthly,
			},
			OneYearGift: {
				billingPeriod: BillingPeriod.Annual,
			},
			Annual: {
				billingPeriod: BillingPeriod.Annual,
			},
			Quarterly: {
				billingPeriod: BillingPeriod.Quarterly,
			},
			ThreeMonthGift: {
				billingPeriod: BillingPeriod.Quarterly,
			},
		},
	},
	GuardianWeeklyDomestic: {
		label: 'The Guardian Weekly',
		landingPagePath: '/subscribe/weekly',
		benefits: [guardianWeeklyBenefit],
		deliverableTo: gwDeliverableCountries,
		ratePlans: {
			Monthly: {
				billingPeriod: BillingPeriod.Monthly,
			},
			OneYearGift: {
				billingPeriod: BillingPeriod.Annual,
			},
			Annual: {
				billingPeriod: BillingPeriod.Annual,
			},
			Quarterly: {
				billingPeriod: BillingPeriod.Quarterly,
			},
			ThreeMonthGift: {
				billingPeriod: BillingPeriod.Quarterly,
			},
		},
	},
	SubscriptionCard: {
		label: 'Collect in store with a subscription card',
		thankyouMessage: paperThankyouMessage,
		landingPagePath: '/subscribe/paper#Collection',
		benefits: [],
		deliverableTo: newspaperCountries,
		ratePlans: paperPlusRatePlans,
	},
	HomeDelivery: {
		label: 'Home delivery',
		thankyouMessage: paperThankyouMessage,
		landingPagePath: '/subscribe/paper',
		benefits: [],
		deliverableTo: newspaperCountries,
		ratePlans: paperPlusRatePlans,
	},
	NationalDelivery: {
		label: 'National delivery',
		thankyouMessage: paperThankyouMessage,
		landingPagePath: '/subscribe/paper',
		benefits: [],
		deliverableTo: newspaperCountries,
		ratePlans: nationalPaperPlusRatePlans,
	},
	Contribution: {
		label: 'Support',
		landingPagePath: '/contribute',
		benefits: [supportBenefit, newsletterBenefitUS],
		ratePlans: {
			Monthly: {
				billingPeriod: BillingPeriod.Monthly,
			},
			Annual: {
				billingPeriod: BillingPeriod.Annual,
			},
		},
	},
	OneTimeContribution: {
		label: 'One-time contribution',
		landingPagePath: '/contribute',
		benefits: [fewerAsksBenefit],
		// Omit one time rate plans for now. We don't expect to use this data and the types in support-frontend
		// can't handle a billingPeriod of OneTime.
		ratePlans: {},
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
	ratePlanKey: ActiveRatePlanKey,
): {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
} {
	return {
		productKey: internationaliseProduct(
			supportInternationalisationId,
			productKey,
		),
		ratePlanKey: internationaliseRatePlan(
			supportInternationalisationId,
			productKey,
			ratePlanKey,
		),
	};
}

export function internationaliseProduct(
	supportInternationalisationId: SupportInternationalisationId,
	productKey: ActiveProductKey,
): ActiveProductKey {
	if (
		productKey === 'GuardianWeeklyDomestic' ||
		productKey === 'GuardianWeeklyRestOfWorld'
	) {
		if (supportInternationalisationId === 'int') {
			return 'GuardianWeeklyRestOfWorld';
		} else {
			return 'GuardianWeeklyDomestic';
		}
	}
	return productKey;
}

function internationaliseRatePlan(
	supportInternationalisationId: SupportInternationalisationId,
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): ActiveRatePlanKey {
	if (productKey === 'TierThree') {
		if (supportInternationalisationId === 'int') {
			if (ratePlanKey === 'DomesticAnnual') {
				return 'RestOfWorldAnnual';
			}
			if (ratePlanKey === 'DomesticMonthly') {
				return 'RestOfWorldMonthly';
			}
		} else {
			if (ratePlanKey === 'RestOfWorldAnnual') {
				return 'DomesticAnnual';
			}
			if (ratePlanKey === 'RestOfWorldMonthly') {
				return 'DomesticMonthly';
			}
		}
	}
	return ratePlanKey;
}
