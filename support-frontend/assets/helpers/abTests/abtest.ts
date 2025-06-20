import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import seedrandom from 'seedrandom';
import { contributionsOnlyAmountsTestName } from 'helpers/contributions';
import type { Settings } from 'helpers/globalsAndSwitches/settings';
import * as cookie from 'helpers/storage/cookie';
import { getQueryParameter } from 'helpers/urls/url';
import type {
	AmountsTest,
	AmountsVariant,
	SelectedAmountsVariant,
} from '../contributions';
import { tests } from './abtestDefinitions';
import { getFallbackAmounts } from './helpers';
import type {
	AcquisitionABTest,
	Audience,
	Participations,
	Test,
	Tests,
} from './models';
import { breakpoints } from './models';
import { getMvtId, MVT_MAX } from './mvt';
import {
	getSessionParticipations,
	PARTICIPATIONS_KEY,
	setSessionParticipations,
} from './sessionStorage';

export const testIsActive = (
	value: [string, string | undefined],
): value is [string, string] => value[1] !== undefined;

// ----- Init ----- //

type ABtestInitalizerData = {
	countryId: IsoCountry;
	countryGroupId: CountryGroupId;
	selectedAmountsVariant?: SelectedAmountsVariant;
	abTests?: Tests;
	mvt?: number;
	acquisitionDataTests?: AcquisitionABTest[];
	path?: string;
};

function init({
	countryId,
	countryGroupId,
	selectedAmountsVariant,
	abTests = tests,
	mvt = getMvtId(),
	acquisitionDataTests = getTestFromAcquisitionData() ?? [],
	path = window.location.pathname,
}: ABtestInitalizerData): Participations {
	const sessionParticipations = getSessionParticipations(PARTICIPATIONS_KEY);
	const participations = getParticipations(
		abTests,
		mvt,
		countryId,
		countryGroupId,
		path,
		acquisitionDataTests,
		selectedAmountsVariant,
		sessionParticipations,
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

function getParticipations(
	abTests: Tests,
	mvtId: number,
	country: IsoCountry,
	countryGroupId: CountryGroupId,
	path: string,
	acquisitionDataTests?: AcquisitionABTest[],
	selectedAmountsVariant?: SelectedAmountsVariant,
	sessionParticipations: Participations = {},
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

		// Is the user already in this test in the current browser session?
		if (
			test.persistPage &&
			!!sessionParticipations[testId] &&
			targetPageMatches(path, test.persistPage)
		) {
			participations[testId] = sessionParticipations[testId];
			return;
		}

		if (!targetPageMatches(path, test.targetPage)) {
			return;
		}

		const includeOnlyContributionsOnlyCountries =
			!!test.audiences.CONTRIBUTIONS_ONLY;

		/**
		 * Exclude any users assigned to the contributions only amounts test
		 * from an ab test if the ab test definition has excludeContributionsOnlyCountries as true
		 * AND includeOnlyContributionsOnlyCountries is not true
		 */
		if (
			selectedAmountsVariant?.testName === contributionsOnlyAmountsTestName &&
			test.excludeContributionsOnlyCountries &&
			!includeOnlyContributionsOnlyCountries
		) {
			return;
		}

		/**
		 * Exclude defined users NOT assigned to the contributions only amounts test
		 * if the  the ab test definition has includeOnlyContributionsOnlyCountries as true
		 */
		if (
			selectedAmountsVariant?.testName !== contributionsOnlyAmountsTestName &&
			includeOnlyContributionsOnlyCountries
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

	// Store participations which use the persistPage prop in sessionStorage
	Object.keys(participations).forEach((testId) => {
		if (abTests[testId]?.persistPage) {
			sessionParticipations[testId] = participations[testId];
		}
	});
	setSessionParticipations(sessionParticipations, PARTICIPATIONS_KEY);

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

	return;
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
			'/??/checkout|one-time-checkout|contribute|thankyou(/.*)?$',
		);

		if (pathMatches && test.variants.length > 1 && test.isLive) {
			return {
				[testName]: variantName,
			};
		}

		return;
	};

	const contribOnlyAmounts = amounts.find((t) => {
		return (
			t.isLive &&
			t.testName === contributionsOnlyAmountsTestName &&
			t.targeting.targetingType === 'Country' &&
			t.targeting.countries.includes(country)
		);
	});
	if (contribOnlyAmounts?.variants[0]) {
		const amountsParticipation = buildParticipation(
			contribOnlyAmounts,
			contributionsOnlyAmountsTestName,
			contribOnlyAmounts.variants[0].variantName,
		);
		return {
			selectedAmountsVariant: {
				...contribOnlyAmounts.variants[0],
				testName: contributionsOnlyAmountsTestName,
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

	const selectVariant = (
		isLive: boolean,
		variants: AmountsVariant[],
	): AmountsVariant | undefined => {
		if (isLive && variants.length > 1) {
			const assignmentIndex = randomNumber(mvt, seed) % variants.length;

			return variants[assignmentIndex];
		}
		// For regional AmountsTests, if the test is not live then we use the control

		return variants[0];
	};

	const currentTestName = isLive && liveTestName ? liveTestName : testName;
	const variant = selectVariant(isLive, variants);

	const amountsParticipation = buildParticipation(
		targetedTest,
		currentTestName,
		variant?.variantName ?? '',
	);

	if (!variant) {
		return {
			selectedAmountsVariant: getFallbackAmounts(countryGroupId),
		};
	}

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

	if (!(minWidth ?? maxWidth)) {
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
		audiences[country] ??
		audiences[countryGroupId] ??
		audiences.ALL ??
		audiences.CONTRIBUTIONS_ONLY;

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
