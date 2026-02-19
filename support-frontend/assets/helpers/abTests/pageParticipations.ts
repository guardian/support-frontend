import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { fetchAnalyticsUserProfile } from 'helpers/analytics/analyticsUserProfile';
import { CountryGroup } from '../internationalisation/classes/countryGroup';
import {
	countryGroupMatches,
	getParticipationFromQueryString,
	randomNumber,
} from './helpers';
import type {
	PageParticipationsConfig,
	PageTest,
	Participations,
} from './models';
import { getMvtId } from './mvt';
import {
	getSessionParticipations,
	setSessionParticipations,
} from './sessionStorage';

export interface PageParticipationsResult<Variant> {
	variant: Variant;
	participations: Participations;
}

/**
 * Generic function to get A/B test participations for any page type.
 *
 * This function will always return a variant, regardless of which page the user is on.
 * We sometimes need these settings on other pages as well.
 *
 * If the user is on the target page, or session storage contains a participation,
 * then it will also return the participations data for tracking.
 * Otherwise we assume the user has not arrived via the target page, and the participations
 * object will be empty because we do not need to track it.
 *
 * For tests with `mParticleAudience`, the user must be a member of that audience
 * (verified via the analytics profile) or the fallback variant is returned instead.
 * URL-forced participations bypass this check.
 */
export async function getPageParticipations<Variant>(
	config: PageParticipationsConfig<Variant>,
): Promise<PageParticipationsResult<Variant>> {
	const countryGroupId: CountryGroupId = CountryGroup.detect();
	const path: string = window.location.pathname;
	const mvtId: number = getMvtId();
	const queryString: string = window.location.search;
	const {
		tests,
		pageRegex,
		forceParamName,
		sessionStorageKey,
		fallbackVariant,
		fallbackParticipationKey,
		getVariantName,
	} = config;

	const isTargetPage = (path: string) => !!path && !!path.match(pageRegex);

	const getVariant = (
		participations: Participations,
		testList: Array<PageTest<Variant>>,
	): Variant => {
		for (const test of testList) {
			const variantName = participations[test.name];
			if (variantName) {
				const variant = test.variants.find(
					(v) => getVariantName(v) === variantName,
				);
				if (variant) {
					return variant;
				}
			}
		}
		return fallbackVariant(countryGroupId);
	};

	const isUserInAudience = async (
		test: PageTest<Variant>,
	): Promise<boolean> => {
		if (test.mParticleAudience === undefined) {
			return true;
		}
		const profile = await fetchAnalyticsUserProfile();
		const inAudience = profile.audienceMemberships.includes(
			test.mParticleAudience,
		);
		return inAudience;
	};

	// Only track participation if user is on the target page
	const trackParticipation = isTargetPage(path);

	const makeFallback = (): PageParticipationsResult<Variant> => {
		const fallback = fallbackVariant(countryGroupId);
		return {
			participations: trackParticipation
				? { [fallbackParticipationKey]: getVariantName(fallback) }
				: ({} as Participations),
			variant: fallback,
		};
	};

	// Is the participation forced in the url querystring? (bypass audience check)
	const urlParticipations = getParticipationFromQueryString(
		queryString,
		forceParamName,
	);
	if (urlParticipations) {
		const variant = getVariant(urlParticipations, tests);
		return {
			participations: urlParticipations,
			variant,
		};
	}

	// Is there already a participation in session storage?
	const sessionParticipations = getSessionParticipations(sessionStorageKey);
	if (
		sessionParticipations &&
		Object.entries(sessionParticipations).length > 0
	) {
		const sessionTestName = Object.keys(sessionParticipations)[0];
		const sessionTest = tests.find((t) => t.name === sessionTestName);
		if (sessionTest && !(await isUserInAudience(sessionTest))) {
			return makeFallback();
		}
		const variant = getVariant(sessionParticipations, tests);
		return {
			participations: sessionParticipations,
			variant,
		};
	}

	// No participation in session storage, assign user to a test + variant
	const test = tests
		.filter((test) => test.status === 'Live')
		.find((test) => {
			return countryGroupMatches(
				test.regionTargeting?.targetedCountryGroups,
				countryGroupId,
			);
		});

	if (!test) {
		return makeFallback();
	}

	if (!(await isUserInAudience(test))) {
		return makeFallback();
	}

	const idx = randomNumber(mvtId, test.name) % test.variants.length;
	const variant = test.variants[idx];

	if (!variant) {
		return makeFallback();
	}

	const participations = {
		[test.name]: getVariantName(variant),
	};
	// Record the participation in session storage so that we can track it from other pages
	setSessionParticipations(participations, sessionStorageKey);

	return {
		participations: trackParticipation
			? participations
			: ({} as Participations),
		variant,
	};
}
