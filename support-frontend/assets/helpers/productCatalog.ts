import type { ActiveProductKey } from '@guardian/support-service-lambdas/modules/product-catalog/src/productCatalog';
import { activeTypeObject } from '@guardian/support-service-lambdas/modules/product-catalog/src/typeObject';
import type { Participations } from './abTests/models';
import type { RegularContributionType } from './contributions';
import { newspaperCountries } from './internationalisation/country';
import type {
	CountryGroupId,
	SupportInternationalisationId,
} from './internationalisation/countryGroup';
import { currencies, detect } from './internationalisation/currency';
import { gwDeliverableCountries } from './internationalisation/gwDeliverableCountries';
import type { Promotion } from './productPrice/promotions';

export type { ActiveProductKey };

export const productCatalog = window.guardian.productCatalog;

export type ProductBenefit = {
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

export type ProductTsAndCs = {
	copy: string;
	promotionalCopy?: string;
	specificToRegions?: CountryGroupId[];
	specificToAbTest?: Array<{
		name: string;
		variants: string[];
		display: boolean;
	}>;
};

export type ProductDescription = {
	label: string;
	thankyouMessage?: string;
	benefits: ProductBenefit[];
	benefitsAdditional?: ProductBenefit[];
	benefitsMissing?: ProductBenefit[];
	benefitsSummary?: Array<string | { strong: boolean; copy: string }>;
	tsAndCs: ProductTsAndCs[];
	ratePlans: Record<
		string,
		{
			billingPeriod: 'Annual' | 'Monthly' | 'Quarterly';
		}
	>;
	offers?: Array<{ copy: JSX.Element; tooltip?: string }>;
	offersSummary?: Array<string | { strong: boolean; copy: string }>;
	deliverableTo?: Record<string, string>;
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

const productKeys = Object.keys(activeTypeObject) as ActiveProductKey[];
export function isProductKey(val: unknown): val is ActiveProductKey {
	return productKeys.includes(val as ActiveProductKey);
}

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
	copy: 'Guardian Weekly print magazine delivered to your door every week  ',
	tooltip: `Guardian Weekly is a beautifully concise magazine featuring a handpicked selection of in-depth articles, global news, long reads, opinion and more. Delivered to you every week, wherever you are in the world.`,
};
const newspaperArchiveBenefitUK = {
	copy: `Unlimited access to the Guardian's 200-year newspaper archive`,
	isNew: true,
	tooltip: `Look back on more than 200 years of world history with the Guardian newspaper archive. Get digital access to every front page, article and advertisement, as it was printed in the UK, since 1821.`,
};
const newspaperArchiveBenefitROW = {
	copy: `Unlimited access to the Guardian's 200-year newspaper archive`,
	isNew: true,
	tooltip: `Look back on more than 200 years of world history with the Guardian newspaper archive. Get digital access to every front page, article and advertisement, as it was printed, since 1821.`,
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

const tierThreeBenefits = [guardianWeeklyBenefit];
const tierThreeInclArchiveBenefitsUK = [
	guardianWeeklyBenefit,
	newspaperArchiveBenefitUK,
];
const tierThreeInclArchiveBenefitsROW = [
	guardianWeeklyBenefit,
	newspaperArchiveBenefitROW,
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

const proceedingTsAndCs = {
	copy: 'By proceeding, you are agreeing to the Digital + print Terms.',
};
const personalDataTsAndCs = {
	copy: 'To find out what personal data we collect and how we use it, please visit our Privacy Policy.',
};
const stripeTsAndCs = {
	copy: 'All card payments are powered by Stripe. Read the Stripe Privacy Policy and Terms and conditions.',
};

const contributionTsAndCs = [
	proceedingTsAndCs,
	personalDataTsAndCs,
	stripeTsAndCs,
];
const supporterPlusTsAndCs = [
	{
		copy: `If you pay at least £X per month, you will receive the All-access digital benefits on a subscription basis. If you increase your payments per month, these additional amounts will be separate monthly voluntary financial contributions to the Guardian. The All-access digital subscription and any contributions will auto-renew each month. You will be charged the subscription and contribution amounts using your chosen payment method at each renewal unless you cancel. You can cancel your subscription or change your contributions at any time before your next renewal date. If you cancel within 14 days of taking out a All-access digital subscription, you’ll receive a full refund (including of any contributions) and your subscription and any contribution will stop immediately. Cancellation of your subscription (which will also cancel any contribution) or cancellation of your contribution made after 14 days will take effect at the end of your current monthly payment period. To cancel, go to Manage My Account or see our Terms.`,
		promotionalCopy: `If you pay £XX per month for the first X months, then , then £X per month, you will receive the All-access digital benefits on a subscription basis. If you increase your payments per month, these additional amounts will be separate monthly voluntary financial contributions to the Guardian. The All-access digital subscription and any contributions will auto-renew each month. You will be charged the subscription and contribution amounts using your chosen payment method at each renewal unless you cancel. You can cancel your subscription or change your contributions at any time before your next renewal date. If you cancel within 14 days of taking out a All-access digital subscription, you’ll receive a full refund (including of any contributions) and your subscription and any contribution will stop immediately. Cancellation of your subscription (which will also cancel any contribution) or cancellation of your contribution made after 14 days will take effect at the end of your current monthly payment period. To cancel, go to Manage My Account or see our Terms.`,
	},
	...contributionTsAndCs,
];

const tierThreeTsAndCs = [
	{
		copy: `By signing up, you are taking out a Digital + print subscription. Your Digital + print subscription will auto-renew each month unless cancelled. Your first payment will be taken on the publication date of your first Guardian Weekly magazine (as shown in the checkout) but you will start to receive your digital benefits when you sign up. Unless you cancel, subsequent monthly payments will be taken on this date using your chosen payment method. You can cancel your Digital + print subscription at any time before your next renewal date. If you cancel your Digital + print subscription within 14 days of signing up, your subscription will stop immediately and we will not take the first payment from you. Cancellation of your subscription after 14 days will take effect at the end of your current monthly payment period. To cancel go to Manage My Account or see our Digital + print Terms.`,
	},
	{
		copy: `By proceeding, you are agreeing to the Digital + print Terms.`,
	},
	personalDataTsAndCs,
	stripeTsAndCs,
];

const adLiteTsAndCs = [
	{
		copy: `Your Guardian Ad-Lite subscription will auto-renew each month unless cancelled. Your first payment will be taken on day 15 after signing up but you will start to receive your Guardian Ad-Lite benefits when you sign up. Unless you cancel, subsequent monthly payments will be taken on this date using your chosen payment method. You can cancel your subscription at any time before your next renewal date. If you cancel your Guardian Ad-Lite subscription within 14 days of signing up, your subscription will stop immediately and we will not take the first payment from you. Cancellation of your subscription after 14 days will take effect at the end of your current monthly payment period. To cancel, go to Manage My Account or see our Guardian Ad-Lite Terms.`,
	},
	...contributionTsAndCs,
];

export const productCatalogDescription: Record<
	ActiveProductKey,
	ProductDescription
> = {
	GuardianAdLite: {
		label: 'Guardian Ad-Lite',
		thankyouMessage: `Your subscription powers our journalism.`,
		tsAndCs: adLiteTsAndCs,
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
		tsAndCs: tierThreeTsAndCs,
		benefitsSummary: [
			'The rewards from ',
			{ strong: true, copy: 'All-access digital' },
		],
		benefits: [guardianWeeklyBenefit],
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
		thankyouMessage: `You have now unlocked access to the Guardian and Observer newspapers, which you can enjoy across all your devices, wherever you are in the world.
            Soon, you will receive weekly newsletters from our supporter editor. We'll also be in touch with other ways to get closer to our journalism. ${' '}`,
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
		tsAndCs: [
			{
				copy: 'Ts&Cs DigitalSubscription',
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
		tsAndCs: [
			{
				copy: 'Ts&Cs NationalDelivery',
			},
		],
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
		tsAndCs: supporterPlusTsAndCs,
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
		tsAndCs: [
			{
				copy: 'Ts&Cs GuardianWeeklyRestOfWorld',
			},
		],
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
		tsAndCs: [
			{
				copy: 'Ts&Cs GuardianWeeklyDomestic',
			},
		],
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
		tsAndCs: [
			{
				copy: 'Ts&Cs SubscriptionCard',
			},
		],
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
		benefits: [supportBenefit, newsletterBenefitUS],
		tsAndCs: contributionTsAndCs,
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
		tsAndCs: [
			{
				copy: 'Ts&Cs HomeDelivery',
			},
		],
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
		tsAndCs: [
			{
				copy: 'Ts&Cs OneTimeContribution',
			},
		],
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
		tsAndCs: [
			{
				copy: 'Ts&Cs GuardianPatron',
			},
		],
		ratePlans: {
			GuardianPatron: {
				billingPeriod: 'Monthly',
			},
		},
	},
};

export function productCatalogDescriptionNewspaperArchive(
	countryGroupId?: CountryGroupId,
) {
	const newsPaperArchiveBenefit = countryGroupId
		? countryGroupId === 'GBPCountries'
			? tierThreeInclArchiveBenefitsUK
			: tierThreeInclArchiveBenefitsROW
		: tierThreeBenefits;

	return {
		...productCatalogDescription,
		TierThree: {
			...productCatalogDescription.TierThree,
			benefits: newsPaperArchiveBenefit,
		},
	};
}

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

export function productCatalogTsAndCs(
	productKey: ActiveProductKey,
	countryGroupId: CountryGroupId,
	contributionType: RegularContributionType,
	promotion?: Promotion,
): ProductTsAndCs[] {
	const isoCurrency = detect(countryGroupId);
	const currencyGlyph = currencies[isoCurrency].glyph;
	const tsAndCs = productCatalogDescription[productKey].tsAndCs;
	const frequencyPlural = contributionType === 'MONTHLY' ? 'monthly' : 'annual';
	const frequencySingular = contributionType === 'MONTHLY' ? 'month' : 'year';
	// const amount = getLowerProductBenefitThreshold(
	// 	contributionType,
	// 	fromCountryGroupId(countryGroupId),
	// 	countryGroupId,
	// 	productKey,
	// );
	const amount = 12;
	console.log(promotion);
	// if (promotion) {
	// 	// EXAMPLE: $8.50/month for the first 6 months, then $17/month
	// 	const promoPrice = promotion.discountedPrice ?? amount;
	// 	const promoPriceFormatted = simpleFormatAmount(
	// 		currencies[isoCurrency],
	// 		promoPrice,
	// 	);
	// 	const discountDuration = promotion.numberOfDiscountedPeriods ?? 0;
	// 	return `${promoPriceFormatted}${divider}${period} for the first ${
	// 		discountDuration > 1 ? discountDuration : ''
	// 	} ${period}${discountDuration > 1 ? 's' : ''}, then ${amountPerPeriod}`;
	// }
	const newTsAndCs = tsAndCs.map((item) => {
		return {
			...item,
			copy: item.copy
				.replace('£X', currencyGlyph + amount)
				.replace('monthly', frequencyPlural)
				.replace('month', frequencySingular),
		};
	});
	return newTsAndCs;
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
