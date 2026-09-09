import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { type AudienceData, fetchAudienceData } from 'helpers/mparticle';
import { CountryGroup } from '../internationalisation/classes/countryGroup';
import {
	countryGroupMatches,
	getParticipationFromQueryString,
	isWithinSchedule,
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
	userAttributes?: Record<string, unknown>;
}

export interface PageParticipationsResultWithFallback<Variant> {
	variant: Variant;
	participations: Participations;
	userAttributes?: Record<string, unknown>;
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
 * (verified via the analytics profile) for the test to be eligible. If they are
 * not, another eligible test may be selected, or the fallback variant is returned
 * if no eligible test remains. Similarly, if a selected variant requires mParticle
 * attributes, the user's analytics profile must have them; otherwise, another
 * eligible test may be selected, or the fallback variant is returned if no
 * eligible test remains.
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
		bypassScheduler = false,
	): Variant | undefined => {
		for (const test of testList) {
			const variantName = participations[test.name];
			if (variantName) {
				if (!bypassScheduler && !isWithinSchedule(test.scheduler)) {
					return undefined;
				}
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

	// Fetched at most once per call, shared by mParticle eligibility checks.
	let fetchedUserAttributes: Record<string, unknown> | undefined;
	let audienceDataPromise: Promise<AudienceData> | null = null;
	const getAudienceData = (): Promise<AudienceData> => {
		if (!audienceDataPromise) {
			audienceDataPromise = fetchAudienceData().then((data) => {
				fetchedUserAttributes = data.userAttributes;
				return data;
			});
		}
		return audienceDataPromise;
	};

	const isUserInAudience = async (
		test: PageTest<Variant>,
	): Promise<boolean> => {
		if (test.mParticleAudience === undefined) {
			return true;
		}
		const { audienceMemberships } = await getAudienceData();
		return audienceMemberships.includes(test.mParticleAudience);
	};

	const hasRequiredMParticleAttributes = async (
		variant: Variant,
	): Promise<boolean> => {
		const getRequiredMParticleAttributes =
			config.getRequiredMParticleAttributes;
		const requiredAttributes: string[] = getRequiredMParticleAttributes
			? getRequiredMParticleAttributes(variant)
			: [];
		if (requiredAttributes.length === 0) {
			return true;
		}
		const { userAttributes } = await getAudienceData();
		return requiredAttributes.every((attribute) => {
			const value = userAttributes[attribute];
			return typeof value === 'string' || typeof value === 'number';
		});
	};

	const isMParticleTest = (test: PageTest<Variant>): boolean =>
		test.variants.some((variant) => {
			const getRequiredMParticleAttributes =
				config.getRequiredMParticleAttributes;
			const hasRequiredAttribute = getRequiredMParticleAttributes
				? getRequiredMParticleAttributes(variant).length > 0
				: false;

			return hasRequiredAttribute;
		});

	const isMParticleTestAllowed = (test: PageTest<Variant>): boolean =>
		!isMParticleTest(test) || test.name.startsWith('MPARTICLE_ATTRIBUTES_');

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

	const previewParamName = forceParamName.replace('force-', 'preview-');

	// Is the participation forced in the url querystring? (bypass audience check)
	const urlParticipations = getParticipationFromQueryString(
		queryString,
		forceParamName,
	);
	if (urlParticipations) {
		const test = tests.find((candidate) => urlParticipations[candidate.name]);
		if (test && !isMParticleTestAllowed(test)) {
			return makeFallbackResult();
		}
		const variant = getVariant(urlParticipations, tests);
		if (!variant) {
			return makeFallbackResult();
		}
		// Forced participations bypass the audience check but still validate required attributes.
		if (!(await hasRequiredMParticleAttributes(variant))) {
			return makeFallbackResult();
		}
		setSessionParticipations(urlParticipations, sessionStorageKey);
		return {
			participations: trackParticipation
				? urlParticipations
				: ({} as Participations),
			variant,
			userAttributes: fetchedUserAttributes,
		};
	}

	// Is the participation requested via preview param? (bypass scheduler + audience check)
	const previewParticipations = getParticipationFromQueryString(
		queryString,
		previewParamName,
	);
	if (previewParticipations) {
		const test = tests.find(
			(candidate) => previewParticipations[candidate.name],
		);
		if (test && !isMParticleTestAllowed(test)) {
			return makeFallbackResult();
		}
		const variant = getVariant(previewParticipations, tests, true);
		if (!variant || !(await hasRequiredMParticleAttributes(variant))) {
			return makeFallbackResult();
		}
		setSessionParticipations(previewParticipations, sessionStorageKey);
		return {
			participations: trackParticipation
				? previewParticipations
				: ({} as Participations),
			variant,
			userAttributes: fetchedUserAttributes,
		};
	}

	// Is there already a participation in session storage?
	const sessionParticipations = getSessionParticipations(sessionStorageKey);
	if (
		sessionParticipations &&
		Object.entries(sessionParticipations).length > 0
	) {
		// Validate and prune session participations: drop entries whose key
		// does not match any current test name, or whose variant name does not
		// exist in that test's variants.
		const validParticipations: Participations = {};
		for (const [key, value] of Object.entries(sessionParticipations)) {
			const matchingTest = tests.find((test) => key === test.name);
			if (matchingTest?.variants.some((v) => getVariantName(v) === value)) {
				validParticipations[key] = value;
			}
		}

		// If nothing valid remains, continue to re-selection
		if (Object.entries(validParticipations).length > 0) {
			const test = tests.find(
				(candidate) => validParticipations[candidate.name],
			);
			const variant = getVariant(validParticipations, tests);
			if (
				(test && !isMParticleTestAllowed(test)) ||
				!variant ||
				!(await hasRequiredMParticleAttributes(variant))
			) {
				return makeFallbackResult();
			}
			return {
				participations: validParticipations,
				variant,
				userAttributes: fetchedUserAttributes,
			};
		}
	}

	// No participation in session storage, assign user to a test + variant
	for (const currentTest of tests.filter((test) => test.status === 'Live')) {
		if (
			isMParticleTestAllowed(currentTest) &&
			isWithinSchedule(currentTest.scheduler) &&
			countryGroupMatches(
				currentTest.regionTargeting?.targetedCountryGroups,
				countryGroupId,
			) &&
			(await isUserInAudience(currentTest))
		) {
			const selectionResult = config.selectVariant
				? config.selectVariant(currentTest, mvtId)
				: undefined;

			const variant =
				selectionResult ??
				currentTest.variants[
					randomNumber(mvtId, currentTest.name) % currentTest.variants.length
				];

			if (variant && (await hasRequiredMParticleAttributes(variant))) {
				const participations: Participations = {
					[currentTest.name]: getVariantName(variant),
				};
				// Record the participation in session storage so that we can track it from other pages
				setSessionParticipations(participations, sessionStorageKey);

				return {
					participations: trackParticipation
						? participations
						: ({} as Participations),
					variant,
					userAttributes: fetchedUserAttributes,
				};
			}
		}
	}

	return makeFallbackResult();
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
