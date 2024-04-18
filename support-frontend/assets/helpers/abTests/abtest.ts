/* eslint "@typescript-eslint/no-unnecessary-condition": "off" -- this is while we are fixing `noUncheckedIndexedAccess` errors */

// ----- Imports ----- //

import seedrandom from 'seedrandom';
import type { Settings } from 'helpers/globalsAndSwitches/settings';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import * as cookie from 'helpers/storage/cookie';
import { getQueryParameter } from 'helpers/urls/url';
import { vatCompliantAmountsTestName } from 'helpers/vatCompliance';
import type {
	AmountsTest,
	AmountsVariant,
	SelectedAmountsVariant,
} from '../contributions';
import { tests } from './abtestDefinitions';
import { getFallbackAmounts } from './helpers';

// ----- Types ----- //

const breakpoints = {
	mobile: 320,
	mobileMedium: 375,
	mobileLandscape: 480,
	phablet: 660,
	tablet: 740,
	desktop: 980,
	leftCol: 1140,
	wide: 1300,
};

type Breakpoint = keyof typeof breakpoints;

type BreakpointRange = {
	minWidth?: Breakpoint;
	maxWidth?: Breakpoint;
};

export type Participations = Record<string, string>;

export type Audience = {
	offset: number;
	size: number;
	breakpoint?: BreakpointRange;
};

export type Audiences = {
	[key in IsoCountry | CountryGroupId | 'ALL']?: Audience;
};

type AcquisitionABTest = {
	name: string;
	variant: string;
	testType?: string;
};

export type Variant = {
	id: string;
};

export type Test = {
	variants: Variant[];
	audiences: Audiences;
	isActive: boolean;
	canRun?: () => boolean;
	// Indicates whether the A/B test is controlled by the referrer (acquisition channel)
	// e.g. Test of a banner design change on dotcom
	// If true the A/B test participation info should be passed through in the acquisition data
	// query parameter.
	// In particular this allows 3rd party tests to be identified and tracked in support-frontend
	// without too much "magic" involving the shared mvtId.
	referrerControlled: boolean;
	// If another test participation is referrerControlled, exclude this test
	excludeIfInReferrerControlledTest?: boolean;
	seed: number;
	// An optional regex that will be tested against the path of the current page
	// before activating this test eg. '/(uk|us|au|ca|nz)/subscribe$'
	targetPage?: string | RegExp;
	omitCountries?: IsoCountry[];
	excludeCountriesSubjectToVatCompliantAmounts: boolean;
};

export type Tests = Record<string, Test>;

// ----- Init ----- //

type ABtestInitalizerData = {
	countryId: IsoCountry;
	countryGroupId: CountryGroupId;
	selectedAmountsVariant?: SelectedAmountsVariant;
	abTests?: Tests;
	mvt?: number;
	acquisitionDataTests?: AcquisitionABTest[];
};

function init({
	countryId,
	countryGroupId,
	selectedAmountsVariant,
	abTests = tests,
	mvt = getMvtId(),
	acquisitionDataTests = getTestFromAcquisitionData() ?? [],
}: ABtestInitalizerData): Participations {
	const participations = getParticipations(
		abTests,
		mvt,
		countryId,
		countryGroupId,
		acquisitionDataTests,
		selectedAmountsVariant,
	);
	const urlParticipations = getParticipationsFromUrl();
	const serverSideParticipations = getServerSideParticipations();
	return {
		...participations,
		...serverSideParticipations,
		...urlParticipations,
	};
}

// ----- Helpers ----- //

const MVT_COOKIE = 'GU_mvt_id';
const MVT_MAX = 1_000_000;

// Attempts to retrieve the MVT id from a cookie, or sets it.
function getMvtId(): number {
	const mvtIdCookieValue = cookie.get(MVT_COOKIE);
	let mvtId = Number(mvtIdCookieValue);

	if (
		Number.isNaN(mvtId) ||
		mvtId >= MVT_MAX ||
		mvtId < 0 ||
		mvtIdCookieValue === null
	) {
		mvtId = Math.floor(Math.random() * MVT_MAX);
		cookie.set(MVT_COOKIE, String(mvtId));
	}

	return mvtId;
}

function getParticipations(
	abTests: Tests,
	mvtId: number,
	country: IsoCountry,
	countryGroupId: CountryGroupId,
	acquisitionDataTests?: AcquisitionABTest[],
	selectedAmountsVariant?: SelectedAmountsVariant,
): Participations {
	const participations: Participations = {};

	Object.entries(abTests).forEach(([testId, test]) => {
		if (!test.isActive) {
			return;
		}

		if (test.canRun && !test.canRun()) {
			return;
		}

		if (test.omitCountries?.includes(country)) {
			return;
		}

		if (!targetPageMatches(window.location.pathname, test.targetPage)) {
			return;
		}

		if (
			test.excludeCountriesSubjectToVatCompliantAmounts &&
			selectedAmountsVariant?.testName === vatCompliantAmountsTestName
		) {
			return;
		}

		const participation = getUserParticipation(
			test,
			testId,
			mvtId,
			country,
			countryGroupId,
			acquisitionDataTests,
		);

		if (participation.type === 'NO_PARTICIPATION') {
			return;
		}

		const variantAssignment = assignUserToVariant(mvtId, test, participation);

		if (variantAssignment.type === 'NOT_ASSIGNED') {
			return;
		}

		const testVariantId = test.variants[variantAssignment.variantIndex]?.id;

		if (testVariantId) {
			participations[testId] = testVariantId;
		}
	});

	// If referrerControlled is set for any test, exclude tests that have excludeIfInReferrerControlledTest set
	const inReferrerControlledTest = Object.keys(participations).some(
		(testId) => abTests[testId]?.referrerControlled,
	);
	if (inReferrerControlledTest) {
		Object.keys(participations).forEach((testId) => {
			if (abTests[testId]?.excludeIfInReferrerControlledTest) {
				delete participations[testId];
			}
		});
	}

	return participations;
}

function getParticipationsFromUrl(): Participations | undefined {
	const hashUrl = new URL(document.URL).hash;

	if (hashUrl.startsWith('#ab-')) {
		const [testId, variant] = decodeURI(hashUrl.substr(4)).split('=');
		if (testId && variant) {
			return { [testId]: variant };
		}
	}
}

function getServerSideParticipations(): Participations | null | undefined {
	if (window.guardian.serversideTests) {
		return window.guardian.serversideTests;
	}
	return null;
}

function getAmountsTestFromURL(
	data: AcquisitionABTest[],
): AcquisitionABTest | undefined {
	const amountTests = data.filter((t) => t.testType === 'AMOUNTS_TEST');
	return amountTests[0];
}

interface GetAmountsTestVariantResult {
	selectedAmountsVariant: SelectedAmountsVariant; // Always return an AmountsVariant, even if it's a fallback
	amountsParticipation?: Participations; // Optional because we only add participation if we want to track an amounts test that has multiple variants
}
function getAmountsTestVariant(
	country: IsoCountry,
	countryGroupId: CountryGroupId,
	settings: Settings,
	path: string = window.location.pathname,
	mvt: number = getMvtId(),
	acquisitionDataTests: AcquisitionABTest[] = getTestFromAcquisitionData() ??
		[],
): GetAmountsTestVariantResult {
	const { amounts } = settings;

	if (!amounts) {
		return {
			selectedAmountsVariant: getFallbackAmounts(countryGroupId),
		};
	}

	const buildParticipation = (
		test: AmountsTest,
		testName: string,
		variantName: string,
	): Participations | undefined => {
		// Check if we actually want to track this test
		const pathMatches = targetPageMatches(
			path,
			'/??/contribute|thankyou(/.*)?$',
		);

		if (pathMatches && test.variants.length > 1 && test.isLive) {
			return {
				[testName]: variantName,
			};
		}
	};

	const contribOnlyAmounts = amounts.find((t) => {
		return (
			t.isLive &&
			t.testName === vatCompliantAmountsTestName &&
			t.targeting.targetingType === 'Country' &&
			t.targeting.countries.includes(country)
		);
	});
	if (contribOnlyAmounts?.variants[0]) {
		const amountsParticipation = buildParticipation(
			contribOnlyAmounts,
			vatCompliantAmountsTestName,
			contribOnlyAmounts.variants[0].variantName,
		);
		return {
			selectedAmountsVariant: {
				...contribOnlyAmounts.variants[0],
				testName: vatCompliantAmountsTestName,
			},
			amountsParticipation,
		};
	}

	// Is an amounts test defined in the url?
	const urlTest = getAmountsTestFromURL(acquisitionDataTests);
	if (urlTest) {
		// Attempt to find urlTest in the configured amounts tests
		const candidate = amounts.find((t) => {
			if (t.isLive) {
				return t.liveTestName === urlTest.name;
			} else {
				return t.testName === urlTest.name;
			}
		});
		if (candidate) {
			const variants = candidate.variants;
			if (variants.length) {
				const variant =
					variants.find((variant) => variant.variantName === urlTest.variant) ??
					variants[0];

				if (variant) {
					const amountsParticipation = buildParticipation(
						candidate,
						urlTest.name,
						variant.variantName,
					);
					return {
						selectedAmountsVariant: {
							...variant,
							testName: urlTest.name,
						},
						amountsParticipation,
					};
				}
			}
		}
	}

	// No url test was found, use targeting
	let targetedTest: AmountsTest | undefined;

	// First try country-targeted tests
	const source = getSourceFromAcquisitionData() ?? '';
	const enableCountryTargetedTests = !['APPLE_NEWS', 'GOOGLE_AMP'].includes(
		source,
	);
	if (enableCountryTargetedTests) {
		const countryTargetedTests = amounts
			.filter(
				(t) =>
					t.isLive &&
					t.targeting.targetingType === 'Country' &&
					t.targeting.countries.includes(country),
			)
			.sort((a, b) => a.order - b.order);

		if (countryTargetedTests[0]) {
			targetedTest = countryTargetedTests[0];
		}
	}

	// Then try region-targeted tests
	if (!targetedTest) {
		targetedTest = amounts.find(
			(t) =>
				t.targeting.targetingType === 'Region' &&
				t.targeting.region === countryGroupId,
		);
	}

	if (!targetedTest) {
		return {
			selectedAmountsVariant: getFallbackAmounts(countryGroupId),
		};
	}

	const { testName, liveTestName, seed, variants, isLive } = targetedTest;

	if (!variants.length) {
		return {
			selectedAmountsVariant: getFallbackAmounts(countryGroupId),
		};
	}

	const selectVariant = (
		isLive: boolean,
		variants: AmountsVariant[],
	): AmountsVariant => {
		if (isLive && variants.length > 1) {
			const assignmentIndex = randomNumber(mvt, seed) % variants.length;
			return variants[assignmentIndex]!;
		}
		// For regional AmountsTests, if the test is not live then we use the control
		return variants[0]!;
	};

	const currentTestName = isLive && liveTestName ? liveTestName : testName;
	const variant = selectVariant(isLive, variants);

	const amountsParticipation = buildParticipation(
		targetedTest,
		currentTestName,
		variant.variantName,
	);

	return {
		selectedAmountsVariant: {
			...variant,
			testName: currentTestName,
		},
		amountsParticipation,
	};
}

function getTestFromAcquisitionData(): AcquisitionABTest[] | undefined {
	const acquisitionDataParam = getQueryParameter('acquisitionData');

	if (!acquisitionDataParam) {
		return undefined;
	}

	try {
		const acquisitionData = JSON.parse(acquisitionDataParam) as {
			abTests?: AcquisitionABTest[];
			abTest?: AcquisitionABTest;
		};

		return acquisitionData.abTest
			? [acquisitionData.abTest]
			: acquisitionData.abTests;
	} catch {
		console.error('Cannot parse acquisition data from query string');
		return undefined;
	}
}

function getSourceFromAcquisitionData(): string | undefined {
	const acquisitionDataParam = getQueryParameter('acquisitionData');

	if (!acquisitionDataParam) {
		return undefined;
	}

	try {
		const acquisitionData = JSON.parse(acquisitionDataParam) as {
			source?: string;
		};

		return acquisitionData.source;
	} catch {
		console.error('Cannot parse acquisition data from query string');
		return undefined;
	}
}

function userInBreakpoint(audience: Audience): boolean {
	if (!audience.breakpoint) {
		return true;
	}

	const { minWidth, maxWidth } = audience.breakpoint;

	if (!(minWidth || maxWidth)) {
		return true;
	}

	const minWidthMediaQuery = minWidth
		? `(min-width:${breakpoints[minWidth]}px)`
		: null;
	const maxWidthMediaQuery = maxWidth
		? `(max-width:${breakpoints[maxWidth]}px)`
		: null;
	const mediaQuery =
		minWidthMediaQuery && maxWidthMediaQuery
			? `${minWidthMediaQuery} and ${maxWidthMediaQuery}`
			: minWidthMediaQuery ?? maxWidthMediaQuery;

	if (typeof mediaQuery === 'string') {
		return window.matchMedia(mediaQuery).matches;
	}

	return false;
}

type NoParticipation = { type: 'NO_PARTICIPATION' };

type ActiveParticipation =
	| { type: 'ACTIVE_PARTICIPATION' }
	| {
			type: 'REFERRER_CONTROLLED_ACTIVE_PARTICIPATION';
			acquisitionDataTest: AcquisitionABTest;
	  };

type UserParticipation = NoParticipation | ActiveParticipation;

function getUserParticipation(
	test: Test,
	testId: string,
	mvtId: number,
	country: IsoCountry,
	countryGroupId: CountryGroupId,
	acquisitionDataTests: AcquisitionABTest[] | undefined,
): UserParticipation {
	const { audiences, referrerControlled } = test;

	if (cookie.get('_post_deploy_user')) {
		return NO_PARTICIPATION;
	}

	const audience =
		audiences[country] ?? audiences[countryGroupId] ?? audiences.ALL;

	if (!audience) {
		return NO_PARTICIPATION;
	}

	if (referrerControlled) {
		// For referrer controlled tests we have to search through the tests in the acquisition
		// data to find a match. We use the `startsWith` method to support test campaigns all
		// with a common prefix.
		const acquisitionDataTest = acquisitionDataTests?.find(
			(acquisitionDataTest) => acquisitionDataTest.name.startsWith(testId),
		);

		if (!acquisitionDataTest) {
			return NO_PARTICIPATION;
		}

		return referrerControlledActiveParticipation(acquisitionDataTest);
	}

	const testMin: number = MVT_MAX * audience.offset;
	const testMax: number = testMin + MVT_MAX * audience.size;
	return mvtId >= testMin && mvtId < testMax && userInBreakpoint(audience)
		? PARTICIPATING
		: NO_PARTICIPATION;
}

const NO_PARTICIPATION: UserParticipation = { type: 'NO_PARTICIPATION' };

const PARTICIPATING: UserParticipation = { type: 'ACTIVE_PARTICIPATION' };

const referrerControlledActiveParticipation = (
	acquisitionDataTest: AcquisitionABTest,
): UserParticipation => ({
	type: 'REFERRER_CONTROLLED_ACTIVE_PARTICIPATION',
	acquisitionDataTest,
});

function randomNumber(mvtId: number, seed: number): number {
	const rng = seedrandom(`${mvtId + seed}`);
	return Math.abs(rng.int32());
}

type VariantAssignment =
	| { type: 'NOT_ASSIGNED' }
	| { type: 'ASSIGNED'; variantIndex: number };

function assignUserToVariant(
	mvtId: number,
	test: Test,
	participation: ActiveParticipation,
): VariantAssignment {
	// For non-referrrer controlled tests we assign the user randomly
	if (participation.type === 'ACTIVE_PARTICIPATION') {
		return assigned(randomNumber(mvtId, test.seed) % test.variants.length);
	}

	// For referrrer controlled tests the assignment comes from the acquisition data.
	// If the variant in the acquisition data doesn't match up with any defined in
	// the test, we log an error and don't assign the user to the test.
	const acquisitionVariant = participation.acquisitionDataTest.variant;

	const index = test.variants.findIndex(
		(variant) => variant.id === acquisitionVariant,
	);

	if (index === -1) {
		console.error('Variant not found for A/B test in acquistion data');

		return NOT_ASSIGNED;
	}

	return assigned(index);
}

const NOT_ASSIGNED: VariantAssignment = { type: 'NOT_ASSIGNED' };

function assigned(variantIndex: number): VariantAssignment {
	return { type: 'ASSIGNED', variantIndex };
}

function targetPageMatches(
	locationPath: string,
	targetPage: (string | null | undefined) | RegExp,
): boolean {
	if (!targetPage) {
		return true;
	}

	return locationPath.match(targetPage) != null;
}

export { init, getAmountsTestVariant };

// Exported for testing only
export const _ = {
	targetPageMatches,
};
