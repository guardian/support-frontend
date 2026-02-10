import { getSettings } from '../../globalsAndSwitches/globals';
import type { LandingPageTest } from '../../globalsAndSwitches/landingPageSettings';
import {
	fallBackLandingPageSelection,
	getLandingPageTestConfig,
	landingPageTestConfig,
} from '../landingPageAbTests';
import { LANDING_PAGE_PARTICIPATIONS_KEY } from '../sessionStorage';

jest.mock('../../globalsAndSwitches/globals', () => ({
	__esModule: true,
	getSettings: jest.fn(),
}));

const mockTest: LandingPageTest = {
	name: 'TEST_LP',
	status: 'Live',
	regionTargeting: { targetedCountryGroups: ['GBPCountries'] },
	variants: [
		{
			name: 'VARIANT_A',
			copy: {
				heading: 'Test heading',
				subheading: 'Test subheading',
			},
			products: fallBackLandingPageSelection.products,
		},
	],
};

describe('landingPageTestConfig', () => {
	it('has correct pageRegex for contribute pages', () => {
		expect(landingPageTestConfig.pageRegex).toBe('^/.*/contribute(/.*)?$');
	});

	it('has correct forceParamName', () => {
		expect(landingPageTestConfig.forceParamName).toBe('force-landing-page');
	});

	it('has correct sessionStorageKey', () => {
		expect(landingPageTestConfig.sessionStorageKey).toBe(
			LANDING_PAGE_PARTICIPATIONS_KEY,
		);
	});

	it('has correct fallbackParticipationKey', () => {
		expect(landingPageTestConfig.fallbackParticipationKey).toBe(
			'FALLBACK_LANDING_PAGE',
		);
	});

	it('returns fallback variant', () => {
		const result = landingPageTestConfig.fallbackVariant('GBPCountries');
		expect(result).toBe(fallBackLandingPageSelection);
	});

	it('extracts variant name correctly', () => {
		const variant = {
			name: 'TEST_VARIANT',
			copy: { heading: 'Test', subheading: 'Test' },
			products: fallBackLandingPageSelection.products,
		};
		expect(landingPageTestConfig.getVariantName(variant)).toBe('TEST_VARIANT');
	});
});

describe('getLandingPageTestConfig', () => {
	const mockGetSettings = getSettings as jest.MockedFunction<
		typeof getSettings
	>;

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('returns config with tests from settings', () => {
		mockGetSettings.mockReturnValue({
			landingPageTests: [mockTest],
		} as ReturnType<typeof getSettings>);

		const config = getLandingPageTestConfig();

		expect(config.tests).toEqual([mockTest]);
		expect(config.pageRegex).toBe('^/.*/contribute(/.*)?$');
		expect(config.forceParamName).toBe('force-landing-page');
		expect(config.sessionStorageKey).toBe(LANDING_PAGE_PARTICIPATIONS_KEY);
	});

	it('returns empty tests array when landingPageTests is undefined', () => {
		mockGetSettings.mockReturnValue({
			landingPageTests: undefined,
		} as ReturnType<typeof getSettings>);

		const config = getLandingPageTestConfig();

		expect(config.tests).toEqual([]);
	});

	it('returns empty tests array when landingPageTests is null', () => {
		mockGetSettings.mockReturnValue({
			landingPageTests: null,
		} as unknown as ReturnType<typeof getSettings>);

		const config = getLandingPageTestConfig();

		expect(config.tests).toEqual([]);
	});

	it('returns multiple tests from settings', () => {
		const test2: LandingPageTest = {
			name: 'TEST_LP_2',
			status: 'Live',
			regionTargeting: { targetedCountryGroups: ['UnitedStates'] },
			variants: [
				{
					name: 'VARIANT_B',
					copy: {
						heading: 'Test heading 2',
						subheading: 'Test subheading 2',
					},
					products: fallBackLandingPageSelection.products,
				},
			],
		};

		mockGetSettings.mockReturnValue({
			landingPageTests: [mockTest, test2],
		} as ReturnType<typeof getSettings>);

		const config = getLandingPageTestConfig();

		expect(config.tests).toHaveLength(2);
		expect(config.tests).toEqual([mockTest, test2]);
	});
});

describe('fallBackLandingPageSelection', () => {
	it('has correct name', () => {
		expect(fallBackLandingPageSelection.name).toBe('CONTROL');
	});

	it('has copy with heading and subheading', () => {
		expect(fallBackLandingPageSelection.copy.heading).toBeDefined();
		expect(fallBackLandingPageSelection.copy.subheading).toBeDefined();
	});

	it('has products for Contribution, SupporterPlus, and DigitalSubscription', () => {
		expect(fallBackLandingPageSelection.products.Contribution).toBeDefined();
		expect(fallBackLandingPageSelection.products.SupporterPlus).toBeDefined();
		expect(
			fallBackLandingPageSelection.products.DigitalSubscription,
		).toBeDefined();
	});

	it('has defaultProductSelection', () => {
		expect(fallBackLandingPageSelection.defaultProductSelection).toEqual({
			productType: 'SupporterPlus',
			billingPeriod: 'Monthly',
		});
	});
});
