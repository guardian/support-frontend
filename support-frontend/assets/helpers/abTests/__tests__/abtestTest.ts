// ----- Imports ----- //
import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import {
	GBPCountries,
	UnitedStates,
} from '@modules/internationalisation/countryGroup';
import { pageUrlRegexes } from 'helpers/abTests/abtestDefinitions';
import type { AcquisitionABTest } from 'helpers/tracking/acquisitions';
import { _, init as abInit } from '../abtest';
import type { Audience, Participations, Test, Variant } from '../models';

const { targetPageMatches } = _;
const {
	oneTimeCheckoutOnly,
	landingPageSubscribeOnly,
	landingPagePaperOnly,
	genericCheckoutOnly,
	paperPages,
	weeklyPages,
	weeklyGiftPages,
} = pageUrlRegexes;

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
		it('does not assign a user in a VAT compliance country if excludeContributionsOnlyCountries is true', () => {
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
				countryId: 'EG',
				abTests,
			});
			expect(participations.t1).toBeUndefined();
		});

		it('does assign a user in a VAT compliance country if excludeContributionsOnlyCountries is false', () => {
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
				countryId: 'EG',
				abTests,
			});
			expect(participations.t1).toBeDefined();
		});

		it('does assign a user outside VAT compliance countries when excludeContributionsOnlyCountries is true', () => {
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
			});
			expect(participations.t1).toBeDefined();
		});
	});

	describe('CONTRIBUTIONS_ONLY audiences', () => {
		it('does assign a user in a VAT compliance country to a CONTRIBUTIONS_ONLY audience test', () => {
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
				countryId: 'EG',
				abTests,
			});
			expect(participations.t1).toBeDefined();
		});

		it('does assign a user in a VAT compliance country to CONTRIBUTIONS_ONLY even when excludeContributionsOnlyCountries is true', () => {
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
				countryId: 'EG',
				abTests,
			});
			expect(participations.t1).toBeDefined();
		});

		it('does not assign a user outside VAT compliance countries to a CONTRIBUTIONS_ONLY audience test', () => {
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
					targetPage: /\/us\/contribute$/,
				}),
			};

			const participations: Participations = abInit({
				...abtestInitalizerData,
				abTests,
				pathWithQueryString: '/uk/contribute',
			});

			expect(participations).toEqual({});
		});

		it('assign to test if targetPage matches', () => {
			const abTests = {
				t1: buildTest({
					targetPage: /\/uk\/contribute$/,
				}),
			};

			const participations: Participations = abInit({
				...abtestInitalizerData,
				abTests,
				pathWithQueryString: '/uk/contribute',
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
					targetPage: /\/uk\/contribute$/,
					persistPage: /\/uk\/checkout$/,
				}),
			};

			const participations: Participations = abInit({
				...abtestInitalizerData,
				abTests,
				pathWithQueryString: '/uk/checkout',
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
					targetPage: /\/uk\/contribute$/,
					persistPage: /\/uk\/checkout$/,
				}),
			};

			const participations: Participations = abInit({
				...abtestInitalizerData,
				abTests,
				pathWithQueryString: '/uk/blah',
			});

			expect(participations).toEqual({});
		});

		it('matches against the query string as well as the patch', () => {
			const abTests = {
				t1: buildTest({
					targetPage: weeklyPages,
				}),
			};

			const participations: Participations = abInit({
				...abtestInitalizerData,
				abTests,
				pathWithQueryString:
					'/uk/checkout?product=GuardianWeeklyDomestic&ratePlan=QuarterlyPlus&enableWeeklyDigital',
			});

			expect(participations).toEqual({ t1: 'control' });
		});
	});
});

it('targetPage matching', () => {
	expect(
		targetPageMatches(
			'/subscribe/weekly/one-time-checkout',
			oneTimeCheckoutOnly,
		),
	).toEqual(false);
	expect(targetPageMatches('/uk/subscribe', landingPageSubscribeOnly)).toEqual(
		true,
	);
	expect(
		targetPageMatches('/uk/subscribe/paper', landingPagePaperOnly),
	).toEqual(true);
	expect(targetPageMatches('/uk/subscribe/paper', paperPages)).toEqual(true);
	expect(targetPageMatches('/uk/checkout', genericCheckoutOnly)).toEqual(true);
	expect(targetPageMatches('/eu/subscribe/weekly', weeklyPages)).toEqual(true);
	expect(
		targetPageMatches('/eu/subscribe/weekly/gift', weeklyGiftPages),
	).toEqual(true);
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
