import seedrandom from 'seedrandom';
import type {
	LandingPageTest,
	LandingPageVariant,
	Products,
} from '../globalsAndSwitches/landingPageSettings';
import type { CountryGroupId } from '../internationalisation/countryGroup';
import type { Participations } from './models';
import {
	getSessionParticipations,
	LANDING_PAGE_PARTICIPATIONS_KEY,
	setSessionParticipations,
} from './sessionStorage';

export type LandingPageSelection = LandingPageVariant & { testName: string };

const products: Products = {
	Contribution: {
		title: 'Support',
		benefits: [
			{
				copy: 'Give to the Guardian every month with Support',
			},
		],
		cta: { copy: 'Support' },
	},
	SupporterPlus: {
		title: 'All-access digital!',
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
	TierThree: {
		title: 'Digital + print',
		benefits: [
			{
				copy: 'Guardian Weekly print magazine delivered to your door every week',
				tooltip:
					'Guardian Weekly is a beautifully concise magazine featuring a handpicked selection of in-depth articles, global news, long reads, opinion and more. Delivered to you every week, wherever you are in the world.',
			},
		],
		cta: { copy: 'Support' },
	},
};

export const fallBackLandingPageSelection: LandingPageSelection = {
	testName: 'FALLBACK_LANDING_PAGE',
	name: 'CONTROL',
	copy: {
		heading: 'Support fearless, independent journalism',
		subheading:
			"We're not owned by a billionaire or shareholders - our readers support us. Choose to join with one of the options below. Cancel anytime.",
	},
	products,
};

function randomNumber(mvtId: number, seed: string): number {
	const rng = seedrandom(mvtId + seed);
	return Math.abs(rng.int32());
}

const landingPageRegex = '^/(uk|us|ca|eu|nz|int)/contribute(/.*)?$';
function isLandingPage(path: string) {
	return !!path && path.match(landingPageRegex);
}

export function getLandingPageParticipations(
	countryGroupId: CountryGroupId,
	path: string,
	tests: LandingPageTest[] = [],
	mvtId: number,
): Participations | undefined {
	if (isLandingPage(path)) {
		// This is a landing page, assign user to a test + variant
		const test = tests
			.filter((test) => test.status == 'Live')
			.find((test) => {
				const targetedCountryGroups =
					test.regionTargeting?.targetedCountryGroups ?? [];
				if (targetedCountryGroups.length === 0) {
					return true;
				} // no targeting
				else {
					return targetedCountryGroups.includes(countryGroupId);
				}
			});

		if (test) {
			const idx = randomNumber(mvtId, test.name) % test.variants.length;
			const variant = test.variants[idx];

			if (variant) {
				const participations = {
					[test.name]: variant.name,
				};
				// Record the participation in session storage so that we can track it from the checkout
				setSessionParticipations(
					participations,
					LANDING_PAGE_PARTICIPATIONS_KEY,
				);

				return participations;
			}
		}
		// No test assigned
		return;
	} else {
		// This is not a landing page, but check if the session has a landing page test participation
		return getSessionParticipations(LANDING_PAGE_PARTICIPATIONS_KEY);
	}
}

// Use the AB test participations to find the specific variant configuration for this page
export function getLandingPageVariant(
	participations: Participations,
	landingPageTests: LandingPageTest[] = [],
): LandingPageSelection {
	for (const test of landingPageTests) {
		// Is the user in this test?
		const variantName = participations[test.name];
		if (variantName) {
			const variant = test.variants.find(
				(variant) => variant.name === variantName,
			);
			if (variant) {
				const variantWithProductConfig = {
					...variant,
					products: products,
				};
				return {
					testName: test.name,
					...variantWithProductConfig,
				};
			}
		}
	}
	return fallBackLandingPageSelection;
}
