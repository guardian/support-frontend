import { ProductTierLabel } from 'helpers/productCatalog';
import { getSettings } from '../globalsAndSwitches/globals';
import type {
	DefaultProductSelection,
	LandingPageVariant,
} from '../globalsAndSwitches/landingPageSettings';
import type { PageParticipationsConfig } from './models';
import { LANDING_PAGE_PARTICIPATIONS_KEY } from './sessionStorage';

// Fallback config in case there's an issue getting it from the server
const fallbackDefaultProductSelection: DefaultProductSelection = {
	productType: 'SupporterPlus',
	billingPeriod: 'Monthly',
};

export const fallBackLandingPageSelection: LandingPageVariant = {
	name: 'CONTROL',
	copy: {
		heading: 'Support fearless, independent journalism',
		subheading:
			"We're not owned by a billionaire or shareholders - our readers support us. Choose to join with one of the options below. Cancel anytime.",
	},
	products: {
		Contribution: {
			title: ProductTierLabel.TierOne,
			benefits: [
				{
					copy: 'Give to the Guardian every month with Support',
				},
			],
			cta: { copy: 'Support' },
		},
		SupporterPlus: {
			title: ProductTierLabel.TierTwo,
			benefits: [
				{
					copy: 'Unlimited access to the Guardian app',
					tooltip:
						'Read beyond our 20 article-per-month limit, enjoy offline access and personalised recommendations, and access our full archive of journalism. Never miss a story with the Guardian News app – a beautiful, intuitive reading experience.',
				},
				{
					copy: 'Ad-free reading on all your devices',
				},
				{
					copy: 'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
				},
				{
					copy: 'Far fewer asks for support',
					tooltip:
						"You'll see far fewer financial support asks at the bottom of articles or in pop-up banners.",
				},
				{
					copy: 'Unlimited access to the Guardian Feast app',
					tooltip:
						'Make a feast out of anything with the Guardian’s new recipe app. Feast has thousands of recipes including quick and budget-friendly weeknight dinners, and showstopping weekend dishes – plus smart app features to make mealtimes inspiring.',
					label: { copy: 'New' },
				},
			],
			cta: {
				copy: 'Support',
			},
			label: { copy: 'Recommended' },
		},
		DigitalSubscription: {
			title: ProductTierLabel.DigitalSubscription,
			benefits: [
				{
					copy: 'Guardian Weekly e-magazine',
					tooltip:
						'Accessed through the Guardian Editions app, the Guardian Weekly e-magazine features a handpicked and carefully curated selection of in-depth articles, global news, opinion and more. Enjoy wherever you are, on your favourite device.',
				},
				{
					copy: 'The Long Read e-magazine',
					tooltip:
						'Accessed through the Guardian Editions app, the Long Read is a quarterly curated magazine with some of the Guardian’s finest longform journalism. Its narrative storytelling and investigative reporting seeks to debunk myths and uncover hidden histories.',
				},
				{
					copy: 'Digital access to the Guardian’s 200 year newspaper archive',
					tooltip:
						'Look back on more than 200 years of world history with the Guardian newspaper archive. Get digital access to every front page, article and advertisement, as it was in the UK, since 1821.',
				},
				{ copy: 'Daily digital Guardian newspaper' },
			],
			cta: { copy: 'Support' },
		},
	},
	defaultProductSelection: fallbackDefaultProductSelection,
};

/**
 * Configuration for landing page A/B tests
 * Use with getPageParticipations to get the variant and participations
 */
export const landingPageTestConfig: Omit<
	PageParticipationsConfig<LandingPageVariant>,
	'tests'
> = {
	pageRegex: '^/.*/contribute(/.*)?$',
	forceParamName: 'force-landing-page',
	sessionStorageKey: LANDING_PAGE_PARTICIPATIONS_KEY,
	fallbackVariant: () => fallBackLandingPageSelection,
	fallbackParticipationKey: 'FALLBACK_LANDING_PAGE',
	getVariantName: (variant) => variant.name,
};

/**
 * Helper to get landing page test config with tests from settings
 */
export function getLandingPageTestConfig(): PageParticipationsConfig<LandingPageVariant> {
	return {
		...landingPageTestConfig,
		tests: getSettings().landingPageTests ?? [],
	};
}
