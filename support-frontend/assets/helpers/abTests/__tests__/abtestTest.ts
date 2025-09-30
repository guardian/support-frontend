// ----- Imports ----- //
import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import {
	GBPCountries,
	UnitedStates,
} from '@modules/internationalisation/countryGroup';
import { pageUrlRegexes } from 'helpers/abTests/abtestDefinitions';
import { contributionsOnlyAmountsTestName } from 'helpers/contributions';
import type { AcquisitionABTest } from 'helpers/tracking/acquisitions';
import type {
	AmountsTest,
	AmountsTests,
	AmountsTestTargeting,
	AmountsVariant,
	SelectedAmountsVariant,
} from '../../contributions';
import { emptySwitches, getSettings } from '../../globalsAndSwitches/globals';
import type { Settings } from '../../globalsAndSwitches/settings';
import { _, init as abInit, getAmountsTestVariant } from '../abtest';
import type { Audience, Participations, Test, Variant } from '../models';

const { targetPageMatches } = _;
const {
	allLandingPagesAndThankyouPages,
	genericCheckoutOnly,
	oneTimeCheckoutOnly,
} = pageUrlRegexes.contributions;

jest.mock('@guardian/ophan-tracker-js', () => ({
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
		settings: getSettings(),
	};

	afterEach(() => {
		window.localStorage.clear();
		window.sessionStorage.clear();
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

	describe('excludeContributionsOnlyCountries', () => {
		it(`does not assign a user to a test if excludeContributionsOnlyCountries is true and selectedAmountsVariant test name is ${contributionsOnlyAmountsTestName}`, () => {
			const abTests = {
				t1: buildTest({
					variants: [
						buildVariant({ id: 'control' }),
						buildVariant({ id: 'variant' }),
					],
					excludeContributionsOnlyCountries: true,
				}),
			};
			const participations: Participations = abInit({
				...abtestInitalizerData,
				abTests,
				selectedAmountsVariant: buildSelectedAmountsVariant(
					contributionsOnlyAmountsTestName,
				),
			});
			expect(participations.t1).toBeUndefined();
		});

		it(`does assign a user to a test if excludeContributionsOnlyCountries is false and selectedAmountsVariant test name is ${contributionsOnlyAmountsTestName}`, () => {
			const abTests = {
				t1: buildTest({
					variants: [
						buildVariant({ id: 'control' }),
						buildVariant({ id: 'variant' }),
					],
					excludeContributionsOnlyCountries: false,
				}),
			};
			const participations: Participations = abInit({
				...abtestInitalizerData,
				abTests,
				selectedAmountsVariant: buildSelectedAmountsVariant(
					contributionsOnlyAmountsTestName,
				),
			});
			expect(participations.t1).toBeDefined();
		});

		it(`does assign a user to the test if excludeContributionsOnlyCountries is true BUT selectedAmountsVariant test name is NOT ${contributionsOnlyAmountsTestName}`, () => {
			const abTests = {
				t1: buildTest({
					variants: [
						buildVariant({ id: 'control' }),
						buildVariant({ id: 'variant' }),
					],
					excludeContributionsOnlyCountries: true,
				}),
			};
			const participations: Participations = abInit({
				...abtestInitalizerData,
				abTests,
				selectedAmountsVariant: buildSelectedAmountsVariant('foo'),
			});
			expect(participations.t1).toBeDefined();
		});
	});

	describe('CONTRIBUTIONS_ONLY audiences', () => {
		it(`does assign a user to a test if audience is CONTRIBUTIONS_ONLY and selectedAmountsVariant test name is ${contributionsOnlyAmountsTestName}`, () => {
			const abTests = {
				t1: buildTest({
					variants: [
						buildVariant({ id: 'control' }),
						buildVariant({ id: 'variant' }),
					],
					audiences: {
						CONTRIBUTIONS_ONLY: {
							offset: 0,
							size: 1,
						},
					},
					excludeContributionsOnlyCountries: false,
				}),
			};
			const participations: Participations = abInit({
				...abtestInitalizerData,
				abTests,
				selectedAmountsVariant: buildSelectedAmountsVariant(
					contributionsOnlyAmountsTestName,
				),
			});
			expect(participations.t1).toBeDefined();
		});

		it(`does assign a user to a test if audiences is CONTRIBUTIONS_ONLY, excludeContributionsOnlyCountries is true and selectedAmountsVariant test name is ${contributionsOnlyAmountsTestName}`, () => {
			const abTests = {
				t1: buildTest({
					variants: [
						buildVariant({ id: 'control' }),
						buildVariant({ id: 'variant' }),
					],
					audiences: {
						CONTRIBUTIONS_ONLY: {
							offset: 0,
							size: 1,
						},
					},
					excludeContributionsOnlyCountries: true,
				}),
			};
			const participations: Participations = abInit({
				...abtestInitalizerData,
				abTests,
				selectedAmountsVariant: buildSelectedAmountsVariant(
					contributionsOnlyAmountsTestName,
				),
			});
			expect(participations.t1).toBeDefined();
		});

		it(`does not assign a user to a test if audiences is CONTRIBUTIONS_ONLY and selectedAmountsVariant test name is NOT ${contributionsOnlyAmountsTestName}`, () => {
			const abTests = {
				t1: buildTest({
					variants: [
						buildVariant({ id: 'control' }),
						buildVariant({ id: 'variant' }),
					],
					audiences: {
						CONTRIBUTIONS_ONLY: {
							offset: 0,
							size: 1,
						},
					},
				}),
			};
			const participations: Participations = abInit({
				...abtestInitalizerData,
				abTests,
				selectedAmountsVariant: buildSelectedAmountsVariant('foo'),
			});
			expect(participations.t1).toBeUndefined();
		});

		it(`does not assign a user to a test if audiences is CONTRIBUTIONS_ONLY and selectedAmountsVariant is undefined`, () => {
			const abTests = {
				t1: buildTest({
					variants: [
						buildVariant({ id: 'control' }),
						buildVariant({ id: 'variant' }),
					],
					audiences: {
						CONTRIBUTIONS_ONLY: {
							offset: 0,
							size: 1,
						},
					},
				}),
			};
			const participations: Participations = abInit({
				...abtestInitalizerData,
				abTests,
				selectedAmountsVariant: undefined,
			});
			expect(participations.t1).toBeUndefined();
		});
	});

	describe('path matching', () => {
		beforeEach(() => {
			window.sessionStorage.clear();
		});

		it('does not assign to test if targetPage does not match', () => {
			const abTests = {
				t1: buildTest({
					targetPage: '/us/contribute$',
				}),
			};

			const participations: Participations = abInit({
				...abtestInitalizerData,
				abTests,
				path: '/uk/contribute',
			});

			expect(participations).toEqual({});
		});

		it('assign to test if targetPage matches', () => {
			const abTests = {
				t1: buildTest({
					targetPage: '/uk/contribute$',
				}),
			};

			const participations: Participations = abInit({
				...abtestInitalizerData,
				abTests,
				path: '/uk/contribute',
			});

			expect(participations).toEqual({ t1: 'control' });
		});

		it('assign to test if persistPage matches and test is in session storage', () => {
			window.sessionStorage.setItem(
				'abParticipations',
				JSON.stringify({ t1: 'control' }),
			);

			const abTests = {
				t1: buildTest({
					targetPage: '/uk/contribute$',
					persistPage: '/uk/checkout$',
				}),
			};

			const participations: Participations = abInit({
				...abtestInitalizerData,
				abTests,
				path: '/uk/checkout',
			});

			expect(participations).toEqual({ t1: 'control' });
		});

		it('does not assign to test if persistPage does not match and test is in session storage', () => {
			window.sessionStorage.setItem(
				'abParticipations',
				JSON.stringify({ t1: 'control' }),
			);

			const abTests = {
				t1: buildTest({
					targetPage: '/uk/contribute$',
					persistPage: '/uk/checkout$',
				}),
			};

			const participations: Participations = abInit({
				...abtestInitalizerData,
				abTests,
				path: '/uk/blah',
			});

			expect(participations).toEqual({});
		});
	});
});

it('targetPage matching', () => {
	// Test nonGiftLandingAndCheckout regex
	expect(
		targetPageMatches(
			'/subscribe/weekly/checkout',
			allLandingPagesAndThankyouPages,
		),
	).toEqual(false);
	expect(
		targetPageMatches(
			'/subscribe/paper/checkout',
			allLandingPagesAndThankyouPages,
		),
	).toEqual(false);
	expect(
		targetPageMatches(
			'/subscribe/digitaledition',
			allLandingPagesAndThankyouPages,
		),
	).toEqual(false);
	expect(
		targetPageMatches('/subscribe/paper', allLandingPagesAndThankyouPages),
	).toEqual(false);
	expect(
		targetPageMatches('/subscribe/weekly', allLandingPagesAndThankyouPages),
	).toEqual(false);
	expect(
		targetPageMatches('/subscribe', allLandingPagesAndThankyouPages),
	).toEqual(false);
	// Test 3-tier landing page
	expect(
		targetPageMatches('/uk/contribute', allLandingPagesAndThankyouPages),
	).toEqual(true);
	// Test 3-tier generic checkout
	expect(
		targetPageMatches('/uk/checkout', allLandingPagesAndThankyouPages),
	).toEqual(true);
	// Test 3-tier generic thankyou
	expect(
		targetPageMatches('/uk/thank-you', allLandingPagesAndThankyouPages),
	).toEqual(true);
	// Test 3-tier non-generic checkout
	expect(
		targetPageMatches(
			'/uk/contribute/checkout',
			allLandingPagesAndThankyouPages,
		),
	).toEqual(true);
	// Test 3-tier non-generic thankyou
	expect(
		targetPageMatches('/uk/thankyou', allLandingPagesAndThankyouPages),
	).toEqual(true);
	// Generic checkout only targeting
	expect(
		targetPageMatches('/uk/contribute/checkout', genericCheckoutOnly),
	).toEqual(false);
	expect(targetPageMatches('/uk/checkout', genericCheckoutOnly)).toEqual(true);
	expect(
		targetPageMatches(
			'/uk/thank-you?product=SupporterPlus&ratePlan=Monthly&userType=current',
			genericCheckoutOnly,
		),
	).toEqual(true);
	expect(targetPageMatches('/uk/thankyou', genericCheckoutOnly)).toEqual(false);
	expect(targetPageMatches('/uk/thank-you', genericCheckoutOnly)).toEqual(
		false,
	);
	expect(
		targetPageMatches(
			'/uk/thank-you?contribution=1&userType=current',
			oneTimeCheckoutOnly,
		),
	).toEqual(true);
	expect(targetPageMatches('/uk/thankyou', oneTimeCheckoutOnly)).toEqual(false);
	expect(targetPageMatches('/uk/thank-you', oneTimeCheckoutOnly)).toEqual(
		false,
	);
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
	excludeIfInReferrerControlledTest = false,
	excludeContributionsOnlyCountries = true,
	targetPage = undefined,
	persistPage = undefined,
}: Partial<Test>): Test {
	return {
		variants,
		audiences,
		isActive,
		referrerControlled,
		seed,
		excludeIfInReferrerControlledTest,
		excludeContributionsOnlyCountries,
		targetPage,
		persistPage,
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

function buildSelectedAmountsVariant(
	amountsTestName: string,
): SelectedAmountsVariant {
	return {
		testName: amountsTestName,
		variantName: 'CONTROL',
		defaultContributionType: 'MONTHLY',
		displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
		amountsCardData: {
			ONE_OFF: {
				amounts: [1, 2, 5, 10],
				defaultAmount: 2,
				hideChooseYourAmount: true,
			},
			MONTHLY: {
				amounts: [2, 3, 5, 7, 9, 12],
				defaultAmount: 5,
				hideChooseYourAmount: true,
			},
			ANNUAL: {
				amounts: [10, 15, 20, 30],
				defaultAmount: 15,
				hideChooseYourAmount: true,
			},
		},
	};
}
