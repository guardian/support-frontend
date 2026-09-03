import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { fetchAudienceData } from 'helpers/mparticle';
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
 * (verified via the analytics profile) or the fallback variant is returned instead.
 * Similarly, if a variant carries `amounts.mParticleAmountAttribute`, the user's
 * analytics profile must have that attribute or the fallback variant is used.
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
	let audienceDataPromise: ReturnType<typeof fetchAudienceData> | null = null;
	const getAudienceData = () => {
		audienceDataPromise ??= fetchAudienceData().then((data) => {
			fetchedUserAttributes = data.userAttributes;
			return data;
		});
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

	// Variants (e.g. OneTimeCheckoutVariant) may require an mParticle user
	// attribute via `amounts.mParticleAmountAttribute`. Kept generic here so
	// any variant shape carrying that field is supported without extending PageTest.
	const hasRequiredMParticleAmountAttribute = async (
		variant: Variant,
	): Promise<boolean> => {
		const requiredAttribute = (
			variant as { amounts?: { mParticleAmountAttribute?: string } }
		).amounts?.mParticleAmountAttribute;
		if (!requiredAttribute) {
			return true;
		}
		const { userAttributes } = await getAudienceData();
		return requiredAttribute in userAttributes;
	};

	const hasRequiredMParticleTemplateAttributes = async (
		variant: Variant,
	): Promise<boolean> => {
		const templateAttributes = Object.values(
			variant as Record<string, unknown>,
		)
			.filter((value): value is string => typeof value === 'string')
			.flatMap((copy) =>
				Array.from(copy.matchAll(/%%mParticle_([a-zA-Z0-9_]+)%%/g)),
			)
			.map((match) => match[1])
			.filter((attribute): attribute is string => attribute !== undefined);

		if (templateAttributes.length === 0) {
			return true;
		}

		const { userAttributes } = await getAudienceData();
		return templateAttributes.every((attribute) => {
			const value = userAttributes[attribute];
			return typeof value === 'string' || typeof value === 'number';
		});
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

	const previewParamName = forceParamName.replace('force-', 'preview-');

	// Is the participation forced in the url querystring? (bypass audience check)
	const urlParticipations = getParticipationFromQueryString(
		queryString,
		forceParamName,
	);
	if (urlParticipations) {
		const variant = getVariant(urlParticipations, tests);
		if (!variant) {
			return makeFallbackResult();
		}
		// Forced participations bypass the attribute gate, but still fetch userAttributes for the caller.
		await hasRequiredMParticleAmountAttribute(variant);
		if (!(await hasRequiredMParticleTemplateAttributes(variant))) {
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
		const variant = getVariant(previewParticipations, tests, true);
		if (
			!variant ||
			!(await hasRequiredMParticleTemplateAttributes(variant))
		) {
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
			const variant = getVariant(validParticipations, tests);
			if (
				!variant ||
				!(await hasRequiredMParticleAmountAttribute(variant)) ||
				!(await hasRequiredMParticleTemplateAttributes(variant))
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
	let test: PageTest<Variant> | undefined;
	for (const currentTest of tests.filter((test) => test.status === 'Live')) {
		if (
			isWithinSchedule(currentTest.scheduler) &&
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

	const selectionResult = config.selectVariant
		? config.selectVariant(test, mvtId)
		: undefined;

	const variant =
		selectionResult ??
		test.variants[randomNumber(mvtId, test.name) % test.variants.length];

	if (!variant || !(await hasRequiredMParticleAmountAttribute(variant))) {
		return makeFallbackResult();
	}

	if (!(await hasRequiredMParticleTemplateAttributes(variant))) {
		return makeFallbackResult();
	}

	// Store only the fresh participation
	const participations: Participations = {
		[test.name]: getVariantName(variant),
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
