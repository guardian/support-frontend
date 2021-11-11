// ----- Imports ----- //
import { pageUrlRegexes } from 'helpers/abTests/abtestDefinitions';
import type { Settings } from 'helpers/globalsAndSwitches/settings';
import {
	GBPCountries,
	UnitedStates,
} from '../../internationalisation/countryGroup';
import {
	init as abInit,
	getVariantsAsString,
	targetPageMatches,
} from '../abtest';
import type { Participations, Tests } from '../abtest';

const { subsShowcaseAndDigiSubPages, digiSub } = pageUrlRegexes.subscriptions;
const { nonGiftLandingNotAusNotUS, nonGiftLandingAndCheckoutWithGuest } =
	digiSub;

jest.mock('ophan', () => ({
	record: () => null,
}));

// ----- Tests ----- //
const emptySettings = {
	switches: {
		experiments: {},
	},
	amounts: {
		GBPCountries: {},
		UnitedStates: {},
	},
};
const acquisitionDataMockTestControl = {
	componentId: 'acquisitions-subscription-banner',
	componentType: 'ACQUISITIONS_SUBSCRIPTIONS_BANNER',
	abTest: {
		name: 'mockTest',
		variant: 'control',
	},
};
const acquisitionDataMockTestVariant = {
	componentId: 'acquisitions-subscription-banner',
	componentType: 'ACQUISITIONS_SUBSCRIPTIONS_BANNER',
	abTest: {
		name: 'mockTest',
		variant: 'variant',
	},
};
const acquisitionDataMockTest2Control = {
	componentId: 'acquisitions-subscription-banner',
	componentType: 'ACQUISITIONS_SUBSCRIPTIONS_BANNER',
	abTest: {
		name: 'mockTest2',
		variant: 'control',
	},
};
const acquisitionDataMockTest2Variant = {
	componentId: 'acquisitions-subscription-banner',
	componentType: 'ACQUISITIONS_SUBSCRIPTIONS_BANNER',
	abTest: {
		name: 'mockTest2',
		variant: 'variant',
	},
};
const mockTestControl = `/test.html?acquisitionData=${encodeURI(
	JSON.stringify(acquisitionDataMockTestControl),
)}`;
const mockTestVariant = `/test.html?acquisitionData=${encodeURI(
	JSON.stringify(acquisitionDataMockTestVariant),
)}`;
const mockTest2Control = `/test.html?acquisitionData=${encodeURI(
	JSON.stringify(acquisitionDataMockTest2Control),
)}`;
const mockTest2Variant = `/test.html?acquisitionData=${encodeURI(
	JSON.stringify(acquisitionDataMockTest2Variant),
)}`;
describe('basic behaviour of init', () => {
	Object.defineProperty(window, 'matchMedia', {
		value: jest.fn().mockImplementation(() => ({
			matches: false,
		})),
	});
	afterEach(() => {
		window.localStorage.clear();
	});
	it('The referrerControlled user should be allocated to the control bucket', () => {
		document.cookie = 'GU_mvt_id=12346';
		window.history.pushState({}, 'Test Title', mockTestControl);
		const tests = {
			mockTest: {
				type: 'OTHER',
				variants: [
					{
						id: 'control',
					},
					{
						id: 'variant',
					},
				],
				audiences: {
					GB: {
						offset: 0,
						size: 1,
					},
				},
				isActive: true,
				referrerControlled: true,
				seed: 0,
			},
		};
		const country = 'GB';
		const participations: Participations = abInit(
			country,
			GBPCountries,
			emptySettings as Settings,
			tests,
		);
		const expectedParticipations: Participations = {
			mockTest: 'control',
		};
		expect(participations).toEqual(expectedParticipations);
	});
	it('The referrerControlled user should be allocated to the variant bucket', () => {
		document.cookie = 'GU_mvt_id=12345';
		window.history.pushState({}, 'Test Title', mockTestVariant);
		const tests = {
			mockTest: {
				type: 'OTHER',
				variants: [
					{
						id: 'control',
					},
					{
						id: 'variant',
					},
				],
				audiences: {
					GB: {
						offset: 0,
						size: 1,
					},
				},
				isActive: true,
				referrerControlled: true,
				seed: 0,
			},
		};
		const country = 'GB';
		const participations: Participations = abInit(
			country,
			GBPCountries,
			emptySettings as Settings,
			tests,
		);
		const expectedParticipations: Participations = {
			mockTest: 'variant',
		};
		expect(participations).toEqual(expectedParticipations);
	});
	it('The user should be allocated to the variant bucket', () => {
		document.cookie = 'GU_mvt_id=12346';
		const tests = {
			mockTest: {
				type: 'OTHER',
				variants: [
					{
						id: 'control',
					},
					{
						id: 'variant',
					},
				],
				audiences: {
					GB: {
						offset: 0,
						size: 1,
					},
				},
				isActive: true,
				referrerControlled: false,
				seed: 6,
			},
		};
		const country = 'GB';
		const countryGroupId = GBPCountries;
		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings as Settings,
			tests,
		);
		const expectedParticipations: Participations = {
			mockTest: 'variant',
		};
		expect(participations).toEqual(expectedParticipations);
	});
	it('The user should be allocated to the control bucket', () => {
		document.cookie = 'GU_mvt_id=12346';
		const tests = {
			mockTest: {
				type: 'OTHER',
				variants: [
					{
						id: 'control',
					},
					{
						id: 'variant',
					},
				],
				audiences: {
					GB: {
						offset: 0,
						size: 1,
					},
				},
				isActive: true,
				referrerControlled: false,
				seed: 5,
			},
		};
		const country = 'GB';
		const countryGroupId = GBPCountries;
		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings as Settings,
			tests,
		);
		const expectedParticipations: Participations = {
			mockTest: 'control',
		};
		expect(participations).toEqual(expectedParticipations);
	});
	it('The user should not be allocated in a test for a different country', () => {
		document.cookie = 'GU_mvt_id=12346';
		const tests = {
			mockTest: {
				type: 'OTHER',
				variants: [
					{
						id: 'control',
					},
					{
						id: 'variant',
					},
				],
				audiences: {
					GB: {
						offset: 0,
						size: 1,
					},
				},
				isActive: true,
				referrerControlled: false,
				seed: 0,
			},
		};
		const country = 'US';
		const countryGroupId = UnitedStates;
		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings as Settings,
			tests,
		);
		const expectedParticipations: Participations = {
			mockTest: 'notintest',
		};
		expect(participations).toEqual(expectedParticipations);
	});
	it('The ab test framework should check for both (min and max) breakpoints if they are provided', () => {
		document.cookie = 'GU_mvt_id=12346';
		const tests = {
			mockTest: {
				type: 'OTHER',
				variants: [
					{
						id: 'control',
					},
					{
						id: 'variant',
					},
				],
				audiences: {
					US: {
						offset: 0,
						size: 1,
						breakpoint: {
							minWidth: 'tablet',
							maxWidth: 'desktop',
						},
					},
				},
				isActive: true,
				referrerControlled: false,
				seed: 0,
			},
		};
		const country = 'US';
		const countryGroupId = UnitedStates;
		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings as Settings,
			tests as Tests,
		);
		const expectedParticipations: Participations = {
			mockTest: 'notintest',
		};
		const expectedMediaQuery = '(min-width:740px) and (max-width:980px)';
		expect(window.matchMedia).toHaveBeenCalledWith(expectedMediaQuery);
		expect(participations).toEqual(expectedParticipations);
	});
	it('The ab test framework should check for min breakpoints if only min is provided', () => {
		document.cookie = 'GU_mvt_id=12346';
		const tests = {
			mockTest: {
				type: 'OTHER',
				variants: [
					{
						id: 'control',
					},
					{
						id: 'variant',
					},
				],
				audiences: {
					US: {
						offset: 0,
						size: 1,
						breakpoint: {
							minWidth: 'tablet',
						},
					},
				},
				isActive: true,
				referrerControlled: false,
				seed: 0,
			},
		};
		const country = 'US';
		const countryGroupId = UnitedStates;
		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings as Settings,
			tests as Tests,
		);
		const expectedParticipations: Participations = {
			mockTest: 'notintest',
		};
		const expectedMediaQuery = '(min-width:740px)';
		expect(window.matchMedia).toHaveBeenCalledWith(expectedMediaQuery);
		expect(participations).toEqual(expectedParticipations);
	});
	it('The ab test framework should check for min breakpoints if only min is provided and max is undefined', () => {
		document.cookie = 'GU_mvt_id=12346';
		const tests = {
			mockTest: {
				type: 'OTHER',
				variants: [
					{
						id: 'control',
					},
					{
						id: 'variant',
					},
				],
				audiences: {
					US: {
						offset: 0,
						size: 1,
						breakpoint: {
							minWidth: 'tablet',
							maxWidth: undefined,
						},
					},
				},
				isActive: true,
				referrerControlled: false,
				seed: 0,
			},
		};
		const country = 'US';
		const countryGroupId = UnitedStates;
		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings as Settings,
			tests as Tests,
		);
		const expectedParticipations: Participations = {
			mockTest: 'notintest',
		};
		const expectedMediaQuery = '(min-width:740px)';
		expect(window.matchMedia).toHaveBeenCalledWith(expectedMediaQuery);
		expect(participations).toEqual(expectedParticipations);
	});
	it('The ab test framework should check for max breakpoints if only max is provided', () => {
		document.cookie = 'GU_mvt_id=12346';
		const tests = {
			mockTest: {
				type: 'OTHER',
				variants: [
					{
						id: 'control',
					},
					{
						id: 'variant',
					},
				],
				audiences: {
					US: {
						offset: 0,
						size: 1,
						breakpoint: {
							maxWidth: 'tablet',
						},
					},
				},
				isActive: true,
				referrerControlled: false,
				seed: 0,
			},
		};
		const country = 'US';
		const countryGroupId = UnitedStates;
		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings as Settings,
			tests as Tests,
		);
		const expectedParticipations: Participations = {
			mockTest: 'notintest',
		};
		const expectedMediaQuery = '(max-width:740px)';
		expect(window.matchMedia).toHaveBeenCalledWith(expectedMediaQuery);
		expect(participations).toEqual(expectedParticipations);
	});
	it('The ab test framework should be able to differentiate country groups', () => {
		document.cookie = 'GU_mvt_id=12346';
		window.history.pushState({}, 'Test Title', mockTestControl);
		const tests = {
			mockTest: {
				type: 'OTHER',
				variants: [
					{
						id: 'control',
					},
					{
						id: 'variant',
					},
				],
				audiences: {
					GBPCountries: {
						offset: 0,
						size: 1,
					},
				},
				isActive: true,
				referrerControlled: true,
				seed: 0,
			},
		};
		const country = 'GI';
		const countryGroupId = GBPCountries;
		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings as Settings,
			tests as Tests,
		);
		const expectedParticipations: Participations = {
			mockTest: 'control',
		};
		expect(participations).toEqual(expectedParticipations);
	});
	it('The ab test framework should check for min breakpoints if only max is provided and min is undefined', () => {
		document.cookie = 'GU_mvt_id=12346';
		const tests = {
			mockTest: {
				type: 'OTHER',
				variants: [
					{
						id: 'control',
					},
					{
						id: 'variant',
					},
				],
				audiences: {
					US: {
						offset: 0,
						size: 1,
						breakpoint: {
							minWidth: undefined,
							maxWidth: 'tablet',
						},
					},
				},
				isActive: true,
				referrerControlled: false,
				seed: 0,
			},
		};
		const country = 'US';
		const countryGroupId = UnitedStates;
		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings as Settings,
			tests as Tests,
		);
		const expectedParticipations: Participations = {
			mockTest: 'notintest',
		};
		const expectedMediaQuery = '(min-width:740px)';
		expect(window.matchMedia).toHaveBeenCalledWith(expectedMediaQuery);
		expect(participations).toEqual(expectedParticipations);
	});
	it('A post-deployment test user should not be allocated into a test', () => {
		const postDeploymentTestCookie = '_post_deploy_user=true; path=/;';

		function deleteCookie() {
			document.cookie = `${postDeploymentTestCookie} expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
		}

		document.cookie = postDeploymentTestCookie;
		document.cookie = 'GU_mvt_id=12346';
		const tests = {
			mockTest: {
				type: 'OTHER',
				variants: [
					{
						id: 'control',
					},
					{
						id: 'variant',
					},
				],
				audiences: {
					GB: {
						offset: 0,
						size: 1,
					},
				},
				isActive: true,
				referrerControlled: false,
				seed: 2,
			},
		};
		const country = 'GB';
		const countryGroupId = GBPCountries;
		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings as Settings,
			tests,
		);
		const expectedParticipations: Participations = {
			mockTest: 'notintest',
		};
		expect(participations).toEqual(expectedParticipations);
		deleteCookie();
	});
	it('Does not allocate a locally rendered epic user into the RemoteEpicVariants AB test', () => {
		const url = `/test.html?acquisitionData=${encodeURI(
			JSON.stringify(acquisitionDataMockTestControl),
		)}`;
		window.history.pushState({}, 'Test Title', url);
		const participations: Participations = abInit(
			'GB',
			GBPCountries,
			emptySettings as Settings,
			{},
		);
		expect(participations.RemoteEpicVariants).toBe(undefined);
	});
	it('Allocates a remotely rendered epic user into the RemoteEpicVariants AB test', () => {
		const data = {
			isRemote: true,
			...acquisitionDataMockTestControl,
		};
		const url = `/test.html?acquisitionData=${encodeURI(JSON.stringify(data))}`;
		window.history.pushState({}, 'Test Title', url);
		const participations: Participations = abInit(
			'GB',
			GBPCountries,
			emptySettings as Settings,
			{},
		);
		expect(participations.RemoteEpicVariants).toBe('remote');
	});
});
describe('Correct allocation in a multi test environment', () => {
	afterEach(() => {
		window.localStorage.clear();
	});

	/*
  GB: |                    100%                      |
                           Test1
   US: |  20%   |        60%                |   20%   |
        Test 1         Test 2              Not in Test
   Test 3 is 100% GB, but canRun is false
   */
	const tests = {
		mockTest: {
			type: 'OTHER',
			variants: [
				{
					id: 'control',
				},
				{
					id: 'variant',
				},
			],
			audiences: {
				GB: {
					offset: 0,
					size: 1,
				},
				US: {
					offset: 0,
					size: 0.2,
				},
			},
			isActive: true,
			referrerControlled: true,
			seed: 0,
		},
		mockTest2: {
			type: 'OTHER',
			variants: [
				{
					id: 'control',
				},
				{
					id: 'variant',
				},
			],
			audiences: {
				US: {
					offset: 0.2,
					size: 0.6,
				},
			},
			isActive: true,
			referrerControlled: true,
			seed: 0,
		},
		mockTest3: {
			type: 'OTHER',
			variants: [
				{
					id: 'control',
				},
				{
					id: 'variant',
				},
			],
			audiences: {
				GB: {
					offset: 0,
					size: 1,
				},
			},
			isActive: true,
			canRun: () => false,
			referrerControlled: true,
			seed: 0,
		},
	};
	it('It correctly segments a user who has a cookie in the top 80% in GB', () => {
		document.cookie = 'GU_mvt_id=810000';
		window.history.pushState({}, 'Test Title', mockTestControl);
		const country = 'GB';
		const countryGroupId = GBPCountries;
		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings as Settings,
			tests,
		);
		const expectedParticipations: Participations = {
			mockTest: 'control',
			mockTest2: 'notintest',
		};
		expect(participations).toEqual(expectedParticipations);
	});
	it('It correctly segments a user who has a cookie above 80% in US', () => {
		document.cookie = 'GU_mvt_id=810000';
		window.history.pushState({}, 'Test Title', '/test.html');
		const country = 'US';
		const countryGroupId = GBPCountries;
		const participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings as Settings,
			tests,
		);
		const expectedParticipations: Participations = {
			mockTest: 'notintest',
			mockTest2: 'notintest',
		};
		expect(participations).toEqual(expectedParticipations);
	});
	it('It correctly segments a user who has a cookie between 20% and 80% in GB', () => {
		document.cookie = 'GU_mvt_id=510000';
		window.history.pushState({}, 'Test Title', mockTestControl);
		const country = 'GB';
		const countryGroupId = GBPCountries;
		let participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings as Settings,
			tests,
		);
		let expectedParticipations: Participations = {
			mockTest: 'control',
			mockTest2: 'notintest',
		};
		expect(participations).toEqual(expectedParticipations);
		window.localStorage.clear();
		document.cookie = 'GU_mvt_id=510001';
		window.history.pushState({}, 'Test Title', mockTestVariant);
		participations = abInit(
			country,
			countryGroupId,
			emptySettings as Settings,
			tests,
		);
		expectedParticipations = {
			mockTest: 'variant',
			mockTest2: 'notintest',
		};
		expect(participations).toEqual(expectedParticipations);
	});
	it('It correctly segments a user who has a cookie between 20% and 80% in US', () => {
		document.cookie = 'GU_mvt_id=510000';
		window.history.pushState({}, 'Test Title', mockTest2Control);
		const country = 'US';
		const countryGroupId = UnitedStates;
		let participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings as Settings,
			tests,
		);
		let expectedParticipations: Participations = {
			mockTest: 'notintest',
			mockTest2: 'control',
		};
		expect(participations).toEqual(expectedParticipations);
		window.localStorage.clear();
		document.cookie = 'GU_mvt_id=510001';
		window.history.pushState({}, 'Test Title', mockTest2Variant);
		participations = abInit(
			country,
			countryGroupId,
			emptySettings as Settings,
			tests,
		);
		expectedParticipations = {
			mockTest: 'notintest',
			mockTest2: 'variant',
		};
		expect(participations).toEqual(expectedParticipations);
		expect(getVariantsAsString(participations)).toEqual(
			'mockTest=notintest; mockTest2=variant',
		);
	});
	it('It correctly segments a user who has a cookie between 0 and 20% in GB', () => {
		document.cookie = 'GU_mvt_id=150000';
		window.history.pushState({}, 'Test Title', mockTestControl);
		const country = 'GB';
		const countryGroupId = GBPCountries;
		let participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings as Settings,
			tests,
		);
		let expectedParticipations: Participations = {
			mockTest: 'control',
			mockTest2: 'notintest',
		};
		expect(participations).toEqual(expectedParticipations);
		window.localStorage.clear();
		document.cookie = 'GU_mvt_id=150001';
		window.history.pushState({}, 'Test Title', mockTestVariant);
		participations = abInit(
			country,
			countryGroupId,
			emptySettings as Settings,
			tests,
		);
		expectedParticipations = {
			mockTest: 'variant',
			mockTest2: 'notintest',
		};
		expect(participations).toEqual(expectedParticipations);
	});
	it('It correctly segments the user a user who has a cookie between 0 and 20% in US', () => {
		document.cookie = 'GU_mvt_id=150000';
		window.history.pushState({}, 'Test Title', mockTestControl);
		const country = 'US';
		const countryGroupId = UnitedStates;
		let participations: Participations = abInit(
			country,
			countryGroupId,
			emptySettings as Settings,
			tests,
		);
		let expectedParticipations: Participations = {
			mockTest: 'control',
			mockTest2: 'notintest',
		};
		expect(participations).toEqual(expectedParticipations);
		window.localStorage.clear();
		document.cookie = 'GU_mvt_id=150001';
		window.history.pushState({}, 'Test Title', mockTestVariant);
		participations = abInit(
			country,
			GBPCountries,
			emptySettings as Settings,
			tests,
		);
		expectedParticipations = {
			mockTest: 'variant',
			mockTest2: 'notintest',
		};
		expect(participations).toEqual(expectedParticipations);
	});
});
it('targetPage matching', () => {
	expect(
		targetPageMatches('/uk/subscribe/paper', subsShowcaseAndDigiSubPages),
	).toEqual(false);
	expect(
		targetPageMatches(
			'/uk/subscribe/digital/checkout',
			subsShowcaseAndDigiSubPages,
		),
	).toEqual(false);
	expect(
		targetPageMatches('/us/subscribe', subsShowcaseAndDigiSubPages),
	).toEqual(true);
	expect(
		targetPageMatches('/us/subscribe/digital', subsShowcaseAndDigiSubPages),
	).toEqual(true);
	const withAcquisitionParams =
		'/uk/subscribe?INTCMP=header_support_subscribe&acquisitionData=%7B"componentType"%3A"ACQUISITIONS_HEADER"%2C"componentId"%3A"header_support_subscribe"%2C"source"%3A"GUARDIAN_WEB"%2C"referrerPageviewId"%3A"k8heft91k5c3tnnnmwjd"%2C"referrerUrl"%3A"https%3A%2F%2Fwww.theguardian.com%2Fuk"%7D';
	expect(
		targetPageMatches(withAcquisitionParams, subsShowcaseAndDigiSubPages),
	).toEqual(true);
	expect(
		targetPageMatches(
			'/us/subscribe/digital?test=blah',
			subsShowcaseAndDigiSubPages,
		),
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
