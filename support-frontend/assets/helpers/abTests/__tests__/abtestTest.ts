// ----- Imports ----- //
import { pageUrlRegexes } from 'helpers/abTests/abtestDefinitions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { AcquisitionABTest } from 'helpers/tracking/acquisitions';
import type {
	AmountsTest,
	AmountsTests,
	AmountsTestTargeting,
	AmountsVariant,
} from '../../contributions';
import { emptySwitches } from '../../globalsAndSwitches/globals';
import type { Settings } from '../../globalsAndSwitches/settings';
import {
	GBPCountries,
	UnitedStates,
} from '../../internationalisation/countryGroup';
import { _, init as abInit, getAmountsTestVariant } from '../abtest';
import type { Audience, Participations, Test, Variant } from '../abtest';

const { targetPageMatches } = _;
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
	const country: IsoCountry = 'GB';
	const countryGroupId: CountryGroupId = GBPCountries;
	const abtestInitalizerData = {
		countryId: country,
		countryGroupId,
		mvt,
	};

	afterEach(() => {
		window.localStorage.clear();
	});

	it('assigns a user to a variant', () => {
		const abTests = {
			t: buildTest({ variants: [buildVariant({ id: 'control' })] }),
		};

		const participations: Participations = abInit({
			...abtestInitalizerData,
			abTests,
		});

		const expectedParticipations: Participations = {
			t: 'control',
		};

		expect(participations).toEqual(expectedParticipations);
	});

	it('uses the variant assignment in the acquisitionData for referrerControlled tests', () => {
		const abTests = {
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

		const acquisitionDataTests = [
			buildAcquisitionAbTest({ name: 't1', variant: 'control' }),
			buildAcquisitionAbTest({ name: 't2', variant: 'variant' }),
		];

		const participations: Participations = abInit({
			...abtestInitalizerData,
			abTests,
			acquisitionDataTests,
		});

		const expectedParticipations: Participations = {
			t1: 'control',
			t2: 'variant',
		};

		expect(participations).toEqual(expectedParticipations);
	});

	it('excludes a test with excludeIfInReferrerControlledTest set if another test has referrerControlled set', () => {
		const abTests = {
			t1: buildTest({
				variants: [
					buildVariant({ id: 'control' }),
					buildVariant({ id: 'variant' }),
				],
				referrerControlled: false,
				excludeIfInReferrerControlledTest: true,
			}),
			t2: buildTest({
				variants: [
					buildVariant({ id: 'control' }),
					buildVariant({ id: 'variant' }),
				],
				referrerControlled: true,
			}),
		};

		const acquisitionDataTests = [
			buildAcquisitionAbTest({ name: 't2', variant: 'variant' }),
		];

		const participations: Participations = abInit({
			...abtestInitalizerData,
			abTests,
			acquisitionDataTests,
		});

		const expectedParticipations: Participations = {
			t2: 'variant',
		};

		expect(participations).toEqual(expectedParticipations);
	});

	it('uses the variant assignment in the acquisitionData for referrerControlled tests belonging to a campaign', () => {
		const campaignPrefix = 't';

		const abTests = {
			[campaignPrefix]: buildTest({
				variants: [
					buildVariant({ id: 'control' }),
					buildVariant({ id: 'variant' }),
				],
				referrerControlled: true,
			}),
		};

		const acquisitionDataTests = [
			buildAcquisitionAbTest({
				name: `${campaignPrefix}__HEADER`,
				variant: 'control',
			}),
		];

		const participations: Participations = abInit({
			...abtestInitalizerData,
			abTests,
			acquisitionDataTests,
		});

		const expectedParticipations: Participations = {
			[campaignPrefix]: 'control',
		};

		expect(participations).toEqual(expectedParticipations);
	});

	it('does not assign a user to a test in another country', () => {
		const abTests = {
			t: buildTest({ audiences: { GB: buildAudience({}) } }),
		};

		const countryId = 'US';
		const countryGroupId = UnitedStates;
		const participations: Participations = abInit({
			...abtestInitalizerData,
			countryId,
			countryGroupId,
			abTests,
		});

		expect(participations).toEqual({});
	});

	it('does not assign a user to a test in another country group', () => {
		const abTests = {
			t: buildTest({ audiences: { GBPCountries: buildAudience({}) } }),
		};

		const countryId = 'US';
		const countryGroupId = UnitedStates;
		const participations: Participations = abInit({
			...abtestInitalizerData,
			countryId,
			countryGroupId,
			abTests,
		});

		expect(participations).toEqual({});
	});

	it('does not assign a user to a test if they are below the min breakpoint', () => {
		const abTests = {
			t: buildTest({
				audiences: {
					GB: buildAudience({
						breakpoint: { minWidth: 'tablet' },
					}),
				},
			}),
		};

		const participations: Participations = abInit({
			...abtestInitalizerData,
			abTests,
		});

		const expectedMediaQuery = '(min-width:740px)';

		expect(window.matchMedia).toHaveBeenCalledWith(expectedMediaQuery);
		expect(participations).toEqual({});
	});

	it('does not assign a user to a test if they are above the max breakpoint', () => {
		const abTests = {
			t: buildTest({
				audiences: {
					GB: buildAudience({
						breakpoint: { maxWidth: 'tablet' },
					}),
				},
			}),
		};

		const participations: Participations = abInit({
			...abtestInitalizerData,
			abTests,
		});

		const expectedMediaQuery = '(max-width:740px)';

		expect(window.matchMedia).toHaveBeenCalledWith(expectedMediaQuery);
		expect(participations).toEqual({});
	});

	it('does not assign a user to a test if they are outside of the min and max breakpoints', () => {
		const abTests = {
			t: buildTest({
				audiences: {
					GB: buildAudience({
						breakpoint: { minWidth: 'tablet', maxWidth: 'desktop' },
					}),
				},
			}),
		};

		const participations: Participations = abInit({
			...abtestInitalizerData,
			abTests,
		});

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

		const abTests = {
			t: buildTest({}),
		};

		const participations: Participations = abInit({
			...abtestInitalizerData,
			abTests,
		});

		expect(participations).toEqual({});

		deleteCookie();
	});

	it('does not assign a user to a test if their mvt is below the offset', () => {
		const mvt = 100_000; // This is 10% of the max mvt

		const abTests = {
			t1: buildTest({
				audiences: { GB: buildAudience({ offset: 0.2, size: 0.8 }) },
			}),
		};

		const participations: Participations = abInit({
			...abtestInitalizerData,
			abTests,
			mvt,
		});

		expect(participations).toEqual({});
	});

	it('does not assign a user to a test if their mvt is above the offset plus size', () => {
		const mvt = 900_000; // This is 90% of the max mvt

		const abTests = {
			t1: buildTest({
				audiences: { GB: buildAudience({ offset: 0.1, size: 0.8 }) },
			}),
		};

		const participations: Participations = abInit({
			...abtestInitalizerData,
			abTests,
			mvt,
		});

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

describe('getAmountsTestVariant', () => {
	const mvt = 123456;
	const country = 'GB';
	const countryGroupId = GBPCountries;
	const path = '/uk/contribute';

	const buildAmountsTest = (
		testName: string,
		targeting: AmountsTestTargeting,
		withVariant: boolean,
	): AmountsTest => {
		const variants: AmountsVariant[] = [
			{
				variantName: 'CONTROL',
				defaultContributionType: 'MONTHLY',
				displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
				amountsCardData: {
					ONE_OFF: {
						amounts: [50, 100, 250, 500],
						defaultAmount: 100,
						hideChooseYourAmount: false,
					},
					MONTHLY: {
						amounts: [10, 20, 50],
						defaultAmount: 20,
						hideChooseYourAmount: false,
					},
					ANNUAL: {
						amounts: [50, 100, 250, 500],
						defaultAmount: 50,
						hideChooseYourAmount: false,
					},
				},
			},
		];
		if (withVariant) {
			variants.push({
				variantName: 'V1',
				defaultContributionType: 'MONTHLY',
				displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
				amountsCardData: {
					ONE_OFF: {
						amounts: [50, 100, 250, 500],
						defaultAmount: 100,
						hideChooseYourAmount: false,
					},
					MONTHLY: {
						amounts: [10, 20, 50],
						defaultAmount: 20,
						hideChooseYourAmount: false,
					},
					ANNUAL: {
						amounts: [50, 100, 250, 500],
						defaultAmount: 50,
						hideChooseYourAmount: false,
					},
				},
			});
		}
		return {
			testName,
			liveTestName: `${testName}_LIVE`,
			isLive: withVariant,
			targeting,
			order: 0,
			seed: 0,
			variants,
		};
	};

	const buildSettings = (amounts: AmountsTests): Settings => ({
		switches: emptySwitches,
		amounts,
		contributionTypes: {
			GBPCountries: [],
			UnitedStates: [],
			AUDCountries: [],
			EURCountries: [],
			NZDCountries: [],
			Canada: [],
			International: [],
		},
		metricUrl: '',
	});

	it('uses amounts test from url, and returns no participation because there is no variant', () => {
		const testName = 'AMOUNTS_TEST';
		const acquisitionAbTests = [
			{
				name: testName,
				variant: 'CONTROL',
				testType: 'AMOUNTS_TEST',
			},
		];
		const test = buildAmountsTest(
			testName,
			{
				targetingType: 'Region',
				region: 'GBPCountries',
			},
			false,
		);

		const result = getAmountsTestVariant(
			country,
			countryGroupId,
			buildSettings([test]),
			path,
			mvt,
			acquisitionAbTests,
		);

		expect(result.amountsParticipation).toBeUndefined();
		expect(result.selectedAmountsVariant.testName).toEqual(testName);
	});

	it('uses amounts test from url, and returns a participation because there is a variant', () => {
		const testName = 'AMOUNTS_TEST';
		const acquisitionAbTests = [
			{
				name: testName,
				variant: 'CONTROL',
			},
		];
		const test = buildAmountsTest(
			testName,
			{
				targetingType: 'Region',
				region: 'GBPCountries',
			},
			true,
		);

		const result = getAmountsTestVariant(
			country,
			countryGroupId,
			buildSettings([test]),
			path,
			mvt,
			acquisitionAbTests,
		);

		expect(result.amountsParticipation).toEqual({ [`${testName}_LIVE`]: 'V1' });
		expect(result.selectedAmountsVariant.testName).toEqual(`${testName}_LIVE`);
	});

	it('targets amounts test based on region, and returns a participation because there is a variant', () => {
		const acquisitionAbTests: AcquisitionABTest[] = [];
		const tests = [
			buildAmountsTest(
				'AUD_TEST',
				{
					targetingType: 'Region',
					region: 'AUDCountries',
				},
				true,
			),
			buildAmountsTest(
				'GBP_TEST',
				{
					targetingType: 'Region',
					region: 'GBPCountries',
				},
				true,
			),
			buildAmountsTest(
				'USD_TEST',
				{
					targetingType: 'Region',
					region: 'UnitedStates',
				},
				true,
			),
		];

		const result = getAmountsTestVariant(
			country,
			countryGroupId,
			buildSettings(tests),
			path,
			mvt,
			acquisitionAbTests,
		);

		expect(result.amountsParticipation).toEqual({ GBP_TEST_LIVE: 'V1' });
		expect(result.selectedAmountsVariant.testName).toEqual('GBP_TEST_LIVE');
	});

	it('targets amounts test based on region, and returns no participation because there is no variant', () => {
		const acquisitionAbTests: AcquisitionABTest[] = [];
		const tests = [
			buildAmountsTest(
				'AUD_TEST',
				{
					targetingType: 'Region',
					region: 'AUDCountries',
				},
				true,
			),
			buildAmountsTest(
				'GBP_TEST',
				{
					targetingType: 'Region',
					region: 'GBPCountries',
				},
				false,
			),
			buildAmountsTest(
				'USD_TEST',
				{
					targetingType: 'Region',
					region: 'UnitedStates',
				},
				true,
			),
		];

		const result = getAmountsTestVariant(
			country,
			countryGroupId,
			buildSettings(tests),
			path,
			mvt,
			acquisitionAbTests,
		);

		expect(result.amountsParticipation).toBeUndefined();
		expect(result.selectedAmountsVariant.testName).toEqual('GBP_TEST');
	});

	it('targets amounts test based on region, and returns no participation because test is not live', () => {
		const acquisitionAbTests: AcquisitionABTest[] = [];
		const test = buildAmountsTest(
			'GBP_TEST',
			{
				targetingType: 'Region',
				region: 'GBPCountries',
			},
			true,
		);
		const tests = [
			{
				...test,
				isLive: false, // test has a variant, but is not live
			},
		];

		const result = getAmountsTestVariant(
			country,
			countryGroupId,
			buildSettings(tests),
			path,
			mvt,
			acquisitionAbTests,
		);

		expect(result.amountsParticipation).toBeUndefined();
		expect(result.selectedAmountsVariant.testName).toEqual('GBP_TEST');
		expect(result.selectedAmountsVariant.variantName).toEqual('CONTROL');
	});

	it('targets amounts test based on country, and returns a participation because there is a variant', () => {
		const acquisitionAbTests: AcquisitionABTest[] = [];
		const tests = [
			buildAmountsTest(
				'GBP_TEST',
				{
					targetingType: 'Region',
					region: 'GBPCountries',
				},
				false,
			),
			buildAmountsTest(
				'COUNTRY_TEST',
				{
					targetingType: 'Country',
					countries: ['GB'],
				},
				true,
			),
		];

		const result = getAmountsTestVariant(
			country,
			countryGroupId,
			buildSettings(tests),
			path,
			mvt,
			acquisitionAbTests,
		);

		expect(result.amountsParticipation).toEqual({ COUNTRY_TEST_LIVE: 'V1' });
		expect(result.selectedAmountsVariant.testName).toEqual('COUNTRY_TEST_LIVE');
	});
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
	excludeCountriesSubjectToVatCompliantAmounts = false,
}: Partial<Test>): Test {
	return {
		variants,
		audiences,
		isActive,
		referrerControlled,
		seed,
		excludeCountriesSubjectToVatCompliantAmounts,
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
