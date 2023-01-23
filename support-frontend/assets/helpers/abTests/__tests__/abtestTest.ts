// ----- Imports ----- //
import { pageUrlRegexes } from 'helpers/abTests/abtestDefinitions';
import type { Settings } from 'helpers/globalsAndSwitches/settings';
import type { AcquisitionABTest } from 'helpers/tracking/acquisitions';
import {
	GBPCountries,
	UnitedStates,
} from '../../internationalisation/countryGroup';
import { init as abInit, targetPageMatches } from '../abtest';
import type { Audience, Participations, Test, Variant } from '../abtest';

const { subsDigiSubPages, digiSub } = pageUrlRegexes.subscriptions;
const { nonGiftLandingNotAusNotUS, nonGiftLandingAndCheckoutWithGuest } =
	digiSub;

jest.mock('ophan', () => ({
	record: () => null,
}));

// ----- Tests ----- //

describe('init', () => {
	Object.defineProperty(window, 'matchMedia', {
		value: jest.fn().mockReturnValue({
			matches: false,
		}),
	});

	// Common arguments to init
	const mvt = 123456;
	const country = 'GB';
	const countryGroupId = GBPCountries;
	const emptySettings = {
		switches: {
			experiments: {},
		},
		amounts: {
			GBPCountries: {},
			UnitedStates: {},
		},
	} as Settings;

	afterEach(() => {
		window.localStorage.clear();
	});

	it('assigns a user to a variant', () => {
		const tests = {
			t: buildTest({ variants: [buildVariant({ id: 'control' })] }),
		};

		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings,
			tests,
			mvt,
		);

		const expectedParticipations: Participations = {
			t: 'control',
		};

		expect(participations).toEqual(expectedParticipations);
	});

	it('uses the variant assignment in the acquisitionData for referrerControlled tests', () => {
		const tests = {
			t1: buildTest({
				variants: [
					buildVariant({ id: 'control' }),
					buildVariant({ id: 'variant' }),
				],
				referrerControlled: true,
			}),
			t2: buildTest({
				variants: [
					buildVariant({ id: 'control' }),
					buildVariant({ id: 'variant' }),
				],
				referrerControlled: true,
			}),
		};

		const acquisitionAbTests = [
			buildAcquisitionAbTest({ name: 't1', variant: 'control' }),
			buildAcquisitionAbTest({ name: 't2', variant: 'variant' }),
		];

		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings,
			tests,
			mvt,
			acquisitionAbTests,
		);

		const expectedParticipations: Participations = {
			t1: 'control',
			t2: 'variant',
		};

		expect(participations).toEqual(expectedParticipations);
	});

	it('uses the variant assignment in the acquisitionData for referrerControlled tests belonging to a campaign', () => {
		const campaignPrefix = 't';

		const tests = {
			[campaignPrefix]: buildTest({
				variants: [
					buildVariant({ id: 'control' }),
					buildVariant({ id: 'variant' }),
				],
				referrerControlled: true,
			}),
		};

		const acquisitionAbTests = [
			buildAcquisitionAbTest({
				name: `${campaignPrefix}__HEADER`,
				variant: 'control',
			}),
		];

		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings,
			tests,
			mvt,
			acquisitionAbTests,
		);

		const expectedParticipations: Participations = {
			[campaignPrefix]: 'control',
		};

		expect(participations).toEqual(expectedParticipations);
	});

	it('does not assign a user to a test in another country', () => {
		const tests = {
			t: buildTest({ audiences: { GB: buildAudience({}) } }),
		};

		const country = 'US';
		const countryGroupId = UnitedStates;
		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings,
			tests,
			mvt,
		);

		expect(participations).toEqual({});
	});

	it('does not assign a user to a test in another country group', () => {
		const tests = {
			t: buildTest({ audiences: { GBPCountries: buildAudience({}) } }),
		};

		const country = 'US';
		const countryGroupId = UnitedStates;
		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings,
			tests,
			mvt,
		);

		expect(participations).toEqual({});
	});

	it('does not assign a user to a test if they are below the min breakpoint', () => {
		const tests = {
			t: buildTest({
				audiences: {
					GB: buildAudience({
						breakpoint: { minWidth: 'tablet' },
					}),
				},
			}),
		};

		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings,
			tests,
			mvt,
		);

		const expectedMediaQuery = '(min-width:740px)';

		expect(window.matchMedia).toHaveBeenCalledWith(expectedMediaQuery);
		expect(participations).toEqual({});
	});

	it('does not assign a user to a test if they are above the max breakpoint', () => {
		const tests = {
			t: buildTest({
				audiences: {
					GB: buildAudience({
						breakpoint: { maxWidth: 'tablet' },
					}),
				},
			}),
		};

		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings,
			tests,
			mvt,
		);

		const expectedMediaQuery = '(max-width:740px)';

		expect(window.matchMedia).toHaveBeenCalledWith(expectedMediaQuery);
		expect(participations).toEqual({});
	});

	it('does not assign a user to a test if they are outside of the min and max breakpoints', () => {
		const tests = {
			t: buildTest({
				audiences: {
					GB: buildAudience({
						breakpoint: { minWidth: 'tablet', maxWidth: 'desktop' },
					}),
				},
			}),
		};

		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings,
			tests,
			mvt,
		);

		const expectedMediaQuery = '(min-width:740px) and (max-width:980px)';

		expect(window.matchMedia).toHaveBeenCalledWith(expectedMediaQuery);
		expect(participations).toEqual({});
	});

	it('does not assign a post-deployment test user to a test', () => {
		const postDeploymentTestCookie = '_post_deploy_user=true; path=/;';

		function deleteCookie() {
			document.cookie = `${postDeploymentTestCookie} expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
		}

		document.cookie = postDeploymentTestCookie;

		const tests = {
			t: buildTest({}),
		};

		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings,
			tests,
			mvt,
		);

		expect(participations).toEqual({});

		deleteCookie();
	});

	it('does not assign a user to a test if their mvt is below the offset', () => {
		const mvt = 100_000; // This is 10% of the max mvt

		const tests = {
			t1: buildTest({
				audiences: { GB: buildAudience({ offset: 0.2, size: 0.8 }) },
			}),
		};

		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings,
			tests,
			mvt,
		);

		expect(participations).toEqual({});
	});

	it('does not assign a user to a test if their mvt is above the offset plus size', () => {
		const mvt = 900_000; // This is 90% of the max mvt

		const tests = {
			t1: buildTest({
				audiences: { GB: buildAudience({ offset: 0.1, size: 0.8 }) },
			}),
		};

		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings,
			tests,
			mvt,
		);

		expect(participations).toEqual({});
	});
});

it('targetPage matching', () => {
	expect(targetPageMatches('/uk/subscribe/paper', subsDigiSubPages)).toEqual(
		false,
	);
	expect(
		targetPageMatches('/uk/subscribe/digital/checkout', subsDigiSubPages),
	).toEqual(false);
	expect(targetPageMatches('/us/subscribe', subsDigiSubPages)).toEqual(true);
	expect(targetPageMatches('/us/subscribe/digital', subsDigiSubPages)).toEqual(
		true,
	);
	const withAcquisitionParams =
		'/uk/subscribe?INTCMP=header_support_subscribe&acquisitionData=%7B"componentType"%3A"ACQUISITIONS_HEADER"%2C"componentId"%3A"header_support_subscribe"%2C"source"%3A"GUARDIAN_WEB"%2C"referrerPageviewId"%3A"k8heft91k5c3tnnnmwjd"%2C"referrerUrl"%3A"https%3A%2F%2Fwww.theguardian.com%2Fuk"%7D';
	expect(targetPageMatches(withAcquisitionParams, subsDigiSubPages)).toEqual(
		true,
	);
	expect(
		targetPageMatches('/us/subscribe/digital?test=blah', subsDigiSubPages),
	).toEqual(true);
	// Test nonGiftLandingAndCheckout regex
	expect(
		targetPageMatches(
			'/uk/subscribe/digital',
			nonGiftLandingAndCheckoutWithGuest,
		),
	).toEqual(true);
	expect(
		targetPageMatches(
			'/subscribe/digital/checkout',
			nonGiftLandingAndCheckoutWithGuest,
		),
	).toEqual(true);
	expect(
		targetPageMatches(
			'/subscribe/digital/checkout/guest',
			nonGiftLandingAndCheckoutWithGuest,
		),
	).toEqual(true);
	expect(
		targetPageMatches(
			'/uk/subscribe/digital/gift',
			nonGiftLandingAndCheckoutWithGuest,
		),
	).toEqual(false);
	// Test nonGiftLandingNotAusNotUS regex
	expect(
		targetPageMatches('/uk/subscribe/digital', nonGiftLandingNotAusNotUS),
	).toEqual(true);
	expect(
		targetPageMatches('/subscribe/digital/checkout', nonGiftLandingNotAusNotUS),
	).toEqual(true);
	expect(
		targetPageMatches('/us/subscribe/digital', nonGiftLandingNotAusNotUS),
	).toEqual(false);
	expect(
		targetPageMatches('/au/subscribe/digital', nonGiftLandingNotAusNotUS),
	).toEqual(false);
	expect(
		targetPageMatches('/uk/subscribe/digital/gift', nonGiftLandingNotAusNotUS),
	).toEqual(false);
});

// ----- Helpers ----- //

function buildVariant({ id = 'control' }: Partial<Variant>): Variant {
	return { id };
}

function buildAudience({
	offset = 0,
	size = 1,
	breakpoint,
}: Partial<Audience>): Audience {
	return { offset, size, breakpoint };
}

function buildTest({
	variants = [buildVariant({})],
	referrerControlled = false,
	audiences = { ALL: buildAudience({}) },
	isActive = true,
	seed = 0,
}: Partial<Test>): Test {
	return {
		variants,
		audiences,
		isActive,
		referrerControlled,
		seed,
	};
}

function buildAcquisitionAbTest({
	name = 't',
	variant = 'control',
}: Partial<AcquisitionABTest>): AcquisitionABTest {
	return {
		name,
		variant,
	};
}
