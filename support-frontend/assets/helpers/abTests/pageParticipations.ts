import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { fetchAudienceMemberships } from 'helpers/mparticle';
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
	variant: Variant | undefined;
	participations: Participations;
}

export interface PageParticipationsResultWithFallback<Variant> {
	variant: Variant;
	participations: Participations;
}

/**
 * Generic function to get A/B test participations for any page type.
 *
 * If a fallback is passed in then it will always return a variant, regardless of which page the user is on.
 * This is because we sometimes need these settings on other pages as well.
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
	fallback?: {
		variant: (countryGroupId: CountryGroupId) => Variant;
		participationKey: string;
	},
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
		getVariantName,
	} = config;

	const isTargetPage = (path: string) => !!path && !!path.match(pageRegex);

	const getVariant = (
		participations: Participations,
		testList: Array<PageTest<Variant>>,
	): Variant | undefined => {
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
		return undefined;
	};

	const isUserInAudience = async (
		test: PageTest<Variant>,
	): Promise<boolean> => {
		if (test.mParticleAudience === undefined) {
			return true;
		}
		const audienceMemberships = await fetchAudienceMemberships();
		return audienceMemberships.includes(test.mParticleAudience);
	};

	// Only track participation if user is on the target page
	const trackParticipation = isTargetPage(path);

	const makeFallbackResult = (): PageParticipationsResult<Variant> => {
		if (!fallback) {
			return { participations: {} as Participations, variant: undefined };
		}
		const variant = fallback.variant(countryGroupId);
		return {
			participations: trackParticipation
				? { [fallback.participationKey]: getVariantName(variant) }
				: ({} as Participations),
			variant,
		};
	};

	// Is the participation forced in the url querystring? (bypass audience check)
	const urlParticipations = getParticipationFromQueryString(
		queryString,
		forceParamName,
	);
	if (urlParticipations) {
		const variant = getVariant(urlParticipations, tests);
		return { participations: urlParticipations, variant };
	}

	// Is there already a participation in session storage?
	const sessionParticipations = getSessionParticipations(sessionStorageKey);
	if (
		sessionParticipations &&
		Object.entries(sessionParticipations).length > 0
	) {
		const variant = getVariant(sessionParticipations, tests);
		return { participations: sessionParticipations, variant };
	}

	// No participation in session storage, assign user to a test + variant
	let test: PageTest<Variant> | undefined;
	for (const currentTest of tests.filter((test) => test.status === 'Live')) {
		if (
			countryGroupMatches(
				currentTest.regionTargeting?.targetedCountryGroups,
				countryGroupId,
			) &&
			(await isUserInAudience(currentTest))
		) {
			test = currentTest;
			break;
		}
	}

	if (!test) {
		return makeFallbackResult();
	}

	const idx = randomNumber(mvtId, test.name) % test.variants.length;
	const variant = test.variants[idx];

	if (!variant) {
		return makeFallbackResult();
	}

	const participations = { [test.name]: getVariantName(variant) };
	// Record the participation in session storage so that we can track it from other pages
	setSessionParticipations(participations, sessionStorageKey);

	return {
		participations: trackParticipation
			? participations
			: ({} as Participations),
		variant,
	};
}

/**
 * Wraps getPageParticipations with a fallback variant guarantee.
 * If no variant is assigned, the fallbackVariant is used instead.
 */
export async function getPageParticipationsWithFallback<Variant>(
	config: PageParticipationsConfig<Variant>,
	fallbackVariant: (countryGroupId: CountryGroupId) => Variant,
	fallbackParticipationKey: string,
): Promise<PageParticipationsResultWithFallback<Variant>> {
	return getPageParticipations(config, {
		variant: fallbackVariant,
		participationKey: fallbackParticipationKey,
	}) as Promise<PageParticipationsResultWithFallback<Variant>>;
}
