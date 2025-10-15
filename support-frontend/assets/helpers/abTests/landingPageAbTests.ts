import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { getSettings } from '../globalsAndSwitches/globals';
import type {
	LandingPageTest,
	LandingPageVariant,
} from '../globalsAndSwitches/landingPageSettings';
import { CountryGroup } from '../internationalisation/classes/countryGroup';
import {
	countryGroupMatches,
	getParticipationFromQueryString,
	randomNumber,
} from './helpers';
import type { Participations } from './models';
import { getMvtId } from './mvt';
import {
	getSessionParticipations,
	LANDING_PAGE_PARTICIPATIONS_KEY,
	setSessionParticipations,
} from './sessionStorage';

// Fallback config in case there's an issue getting it from the server
export const fallBackLandingPageSelection: LandingPageVariant = {
	name: 'CONTROL',
	copy: {
		heading: 'Support fearless, independent journalism',
		subheading:
			"We're not owned by a billionaire or shareholders - our readers support us. Choose to join with one of the options below. Cancel anytime.",
	},
	products: {
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
			title: 'All-access digital',
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
	},
};

const landingPageRegex = '^/.*/contribute(/.*)?$';
function isLandingPage(path: string) {
	return !!path && !!path.match(landingPageRegex);
}

/**
 * getLandingPageParticipations will always return a landing page variant, regardless of which
 * page the user is on. We sometimes need these settings on other pages as well.
 *
 * If the user is on the landing page, or session storage contains a landing page participation,
 * then it will also return the participations data for tracking.
 * Otherwise we assume the user has not arrived via the landing page, and the participations
 * object will be empty because we do not need to track it.
 */
interface LandingPageParticipationsResult {
	variant: LandingPageVariant;
	participations: Participations;
}
export function getLandingPageParticipations(
	countryGroupId: CountryGroupId = CountryGroup.detect(),
	path: string = window.location.pathname,
	tests: LandingPageTest[] = getSettings().landingPageTests ?? [],
	mvtId: number = getMvtId(),
	queryString: string = window.location.search,
): LandingPageParticipationsResult {
	// Is the participation forced in the url querystring?
	const urlParticipations = getParticipationFromQueryString(
		queryString,
		'force-landing-page',
	);
	if (urlParticipations) {
		const variant = getLandingPageVariant(urlParticipations, tests);
		return {
			participations: urlParticipations,
			variant,
		};
	}

	// Is there already a participation in session storage?
	const sessionParticipations = getSessionParticipations(
		LANDING_PAGE_PARTICIPATIONS_KEY,
	);
	if (
		sessionParticipations &&
		Object.entries(sessionParticipations).length > 0
	) {
		const variant = getLandingPageVariant(sessionParticipations, tests);
		return {
			participations: sessionParticipations,
			variant,
		};
	} else {
		// No participation in session storage, assign user to a test + variant
		const test = tests
			.filter((test) => test.status == 'Live')
			.find((test) => {
				return countryGroupMatches(
					test.regionTargeting?.targetedCountryGroups,
					countryGroupId,
				);
			});

		// Only track participation if user is on the landing page
		const trackParticipation = isLandingPage(path);

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

				return {
					participations: trackParticipation ? participations : {},
					variant,
				};
			}
		}
		// No test found, use the fallback
		return {
			participations: trackParticipation
				? { FALLBACK_LANDING_PAGE: fallBackLandingPageSelection.name }
				: ({} as Participations),
			variant: fallBackLandingPageSelection,
		};
	}
}

// Use the AB test participations to find the specific variant configuration for this page
export function getLandingPageVariant(
	participations: Participations,
	landingPageTests: LandingPageTest[] = [],
): LandingPageVariant {
	for (const test of landingPageTests) {
		// Is the user in this test?
		const variantName = participations[test.name];
		if (variantName) {
			const variant = test.variants.find(
				(variant) => variant.name === variantName,
			);
			if (variant) {
				return variant;
			}
		}
	}
	return fallBackLandingPageSelection;
}
