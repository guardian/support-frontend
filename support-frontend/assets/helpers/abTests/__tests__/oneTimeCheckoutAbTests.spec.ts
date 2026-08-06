import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import { getSettings } from '../../globalsAndSwitches/globals';
import type { OneTimeCheckoutTest } from '../../globalsAndSwitches/oneTimeCheckoutSettings';
import {
	fallBackOneTimeCheckoutSelection,
	getOneTimeCheckoutTestConfig,
	oneTimeCheckoutTestConfig,
} from '../oneTimeCheckoutAbTests';
import { ONE_TIME_CHECKOUT_PARTICIPATIONS_KEY } from '../sessionStorage';

jest.mock('../../globalsAndSwitches/globals', () => ({
	__esModule: true,
	getSettings: jest.fn(),
}));

const mockTest: OneTimeCheckoutTest = {
	name: 'TEST_ONE_TIME_CHECKOUT',
	status: 'Live',
	regionTargeting: { targetedCountryGroups: ['uk'] },
	variants: [
		{
			name: 'VARIANT_A',
			heading: 'Test heading',
			subheading: 'Test subheading',
			amounts: {
				amounts: [50, 100, 150, 200],
				defaultAmount: 100,
				hideChooseYourAmount: false,
			},
		},
	],
};

describe('oneTimeCheckoutTestConfig', () => {
	it('has correct pageRegex for one-time-checkout pages', () => {
		expect(oneTimeCheckoutTestConfig.pageRegex).toBe(
			'^/.*/one-time-checkout(/.*)?$',
		);
	});

	it('has correct forceParamName', () => {
		expect(oneTimeCheckoutTestConfig.forceParamName).toBe(
			'force-one-time-checkout',
		);
	});

	it('has correct sessionStorageKey', () => {
		expect(oneTimeCheckoutTestConfig.sessionStorageKey).toBe(
			ONE_TIME_CHECKOUT_PARTICIPATIONS_KEY,
		);
	});

	it('extracts variant name correctly', () => {
		const variant = {
			name: 'TEST_VARIANT',
			heading: 'Test',
			subheading: 'Test',
			amounts: {
				amounts: [25, 50, 100, 250],
				defaultAmount: 50,
				hideChooseYourAmount: false,
			},
		};
		expect(oneTimeCheckoutTestConfig.getVariantName(variant)).toBe(
			'TEST_VARIANT',
		);
	});
});

describe('fallBackOneTimeCheckoutSelection', () => {
	it('returns GBP fallback variant for GBPCountries', () => {
		const result = fallBackOneTimeCheckoutSelection['uk'];
		expect(result?.name).toBe('CONTROL');
		expect(result?.amounts.amounts).toEqual([30, 60, 120, 240]);
		expect(result?.amounts.defaultAmount).toBe(60);
	});

	it('returns USD fallback variant for UnitedStates', () => {
		const result = fallBackOneTimeCheckoutSelection['us'];
		expect(result?.name).toBe('CONTROL');
		expect(result?.amounts.amounts).toEqual([25, 50, 100, 250]);
		expect(result?.amounts.defaultAmount).toBe(50);
	});

	it('returns EUR fallback variant for EURCountries', () => {
		const result = fallBackOneTimeCheckoutSelection['eu'];
		expect(result?.name).toBe('CONTROL');
		expect(result?.amounts.amounts).toEqual([25, 50, 100, 250]);
		expect(result?.amounts.defaultAmount).toBe(50);
	});

	it('returns International fallback variant', () => {
		const result = fallBackOneTimeCheckoutSelection['int'];
		expect(result?.name).toBe('CONTROL');
		expect(result?.amounts.amounts).toEqual([25, 50, 100, 250]);
		expect(result?.amounts.defaultAmount).toBe(50);
	});

	it('returns Canada fallback variant', () => {
		const result = fallBackOneTimeCheckoutSelection['ca'];
		expect(result?.name).toBe('CONTROL');
		expect(result?.amounts.amounts).toEqual([25, 50, 100, 250]);
		expect(result?.amounts.defaultAmount).toBe(50);
	});

	it('returns AUD fallback variant for AUDCountries', () => {
		const result = fallBackOneTimeCheckoutSelection['au'];
		expect(result?.name).toBe('CONTROL');
		expect(result?.amounts.amounts).toEqual([60, 100, 250, 500]);
		expect(result?.amounts.defaultAmount).toBe(100);
	});

	it('returns NZD fallback variant for NZDCountries', () => {
		const result = fallBackOneTimeCheckoutSelection['nz'];
		expect(result?.name).toBe('CONTROL');
		expect(result?.amounts.amounts).toEqual([50, 100, 250, 500]);
		expect(result?.amounts.defaultAmount).toBe(100);
	});

	it('returns fallback with hideChooseYourAmount set to false', () => {
		const supportRegions: SupportRegionId[] = [
			'uk',
			'us',
			'eu',
			'int',
			'ca',
			'au',
			'nz',
		];

		supportRegions.forEach((supportRegion) => {
			const result = fallBackOneTimeCheckoutSelection[supportRegion];
			expect(result?.amounts.hideChooseYourAmount).toBe(false);
		});
	});

	it('returns fallback with heading and subheading', () => {
		const result = fallBackOneTimeCheckoutSelection['uk'];
		expect(result?.heading).toBe('Support just once');
		expect(result?.subheading).toBe(
			'Support us with the amount of your choice.',
		);
	});
});

describe('getOneTimeCheckoutTestConfig', () => {
	const mockGetSettings = getSettings as jest.MockedFunction<
		typeof getSettings
	>;

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('returns config with tests from settings', () => {
		mockGetSettings.mockReturnValue({
			oneTimeCheckoutTests: [mockTest],
		} as ReturnType<typeof getSettings>);

		const config = getOneTimeCheckoutTestConfig();

		expect(config.tests).toEqual([mockTest]);
		expect(config.pageRegex).toBe('^/.*/one-time-checkout(/.*)?$');
		expect(config.forceParamName).toBe('force-one-time-checkout');
		expect(config.sessionStorageKey).toBe(ONE_TIME_CHECKOUT_PARTICIPATIONS_KEY);
	});

	it('returns empty tests array when oneTimeCheckoutTests is undefined', () => {
		mockGetSettings.mockReturnValue({
			oneTimeCheckoutTests: undefined,
		} as ReturnType<typeof getSettings>);

		const config = getOneTimeCheckoutTestConfig();

		expect(config.tests).toEqual([]);
	});

	it('returns empty tests array when oneTimeCheckoutTests is null', () => {
		mockGetSettings.mockReturnValue({
			oneTimeCheckoutTests: null,
		} as unknown as ReturnType<typeof getSettings>);

		const config = getOneTimeCheckoutTestConfig();

		expect(config.tests).toEqual([]);
	});

	it('returns multiple tests from settings', () => {
		const test2: OneTimeCheckoutTest = {
			name: 'TEST_ONE_TIME_CHECKOUT_2',
			status: 'Live',
			regionTargeting: { targetedCountryGroups: ['us'] },
			variants: [
				{
					name: 'VARIANT_B',
					heading: 'Test heading 2',
					subheading: 'Test subheading 2',
					amounts: {
						amounts: [25, 50, 75, 100],
						defaultAmount: 50,
						hideChooseYourAmount: true,
					},
				},
			],
		};

		mockGetSettings.mockReturnValue({
			oneTimeCheckoutTests: [mockTest, test2],
		} as ReturnType<typeof getSettings>);

		const config = getOneTimeCheckoutTestConfig();

		expect(config.tests).toHaveLength(2);
		expect(config.tests).toEqual([mockTest, test2]);
	});

	it('preserves all config properties when adding tests', () => {
		mockGetSettings.mockReturnValue({
			oneTimeCheckoutTests: [mockTest],
		} as ReturnType<typeof getSettings>);

		const config = getOneTimeCheckoutTestConfig();

		expect(config.pageRegex).toBe(oneTimeCheckoutTestConfig.pageRegex);
		expect(config.forceParamName).toBe(
			oneTimeCheckoutTestConfig.forceParamName,
		);
		expect(config.sessionStorageKey).toBe(
			oneTimeCheckoutTestConfig.sessionStorageKey,
		);
		expect(config.getVariantName).toBe(
			oneTimeCheckoutTestConfig.getVariantName,
		);
	});

	it('handles empty tests array from settings', () => {
		mockGetSettings.mockReturnValue({
			oneTimeCheckoutTests: [],
		} as unknown as ReturnType<typeof getSettings>);

		const config = getOneTimeCheckoutTestConfig();

		expect(config.tests).toEqual([]);
		expect(config.tests).toHaveLength(0);
	});
});
