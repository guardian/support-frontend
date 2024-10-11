import type { ProductKey } from '@guardian/support-service-lambdas/modules/product-catalog/src/productCatalog';
import { typeObject } from '@guardian/support-service-lambdas/modules/product-catalog/src/typeObject';
import { OfferFeast } from 'components/offer/offer';
import type { Participations } from './abTests/abtest';
import { newspaperCountries } from './internationalisation/country';
import type {
	CountryGroupId,
	SupportInternationalisationId,
} from './internationalisation/countryGroup';
import { gwDeliverableCountries } from './internationalisation/gwDeliverableCountries';

export type { ProductKey };

export const productCatalog = window.guardian.productCatalog;

type ProductBenefit = {
	copy: string;
	tooltip?: string;
	specificToRegions?: CountryGroupId[];
	specificToAbTest?: Array<{ name: string; variants: string[] }>;
	isNew?: boolean;
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

export function filterBenefitByABTest(
	benefit: ProductBenefit,
	participations?: Participations,
) {
	if (participations && benefit.specificToAbTest !== undefined) {
		return benefit.specificToAbTest.some(({ name, variants }) =>
			participations[name]
				? variants.includes(participations[name] ?? '')
				: false,
		);
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
					specificToAbTest: [
						{ name: 'auPartnerBenefit', variants: ['control'] },
					],
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
					specificToAbTest: [
						{ name: 'auPartnerBenefit', variants: ['control'] },
					],
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

export const productCatalogDescriptionNewBenefits: Record<
	ProductKey,
	ProductDescription
> = {
	...productCatalogDescription,
	TierThree: {
		...productCatalogDescription.TierThree,
		benefits: [
			...productCatalogDescription.TierThree.benefits,
			{
				copy: 'Newspaper archive',
				isNew: true,
			},
		],
	},
	SupporterPlus: {
		...productCatalogDescription.SupporterPlus,
		benefits: [
			...productCatalogDescription.SupporterPlus.benefits,
			{
				copy: 'Unlimited access to the Guardian Feast App',
				isNew: true,
				tooltip:
					'Make a feast out of anything with the Guardian’s new recipe app. Feast has thousands of recipes including quick and budget-friendly weeknight dinners, and showstopping weekend dishes – plus smart app features to make mealtimes inspiring.',
			},
		],
		offers: [],
	},
};

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
	productKey: ProductKey,
	ratePlanKey: string,
): { productKey: ProductKey; ratePlanKey: string } {
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
