import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { getSettings } from '../../globalsAndSwitches/globals';
import type { OneTimeCheckoutTest } from '../../globalsAndSwitches/oneTimeCheckoutSettings';
import {
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
	regionTargeting: { targetedCountryGroups: ['GBPCountries'] },
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

	it('has correct fallbackParticipationKey', () => {
		expect(oneTimeCheckoutTestConfig.fallbackParticipationKey).toBe(
			'FALLBACK_ONE_TIME_CHECKOUT',
		);
	});

	describe('fallbackVariant', () => {
		it('returns GBP fallback variant for GBPCountries', () => {
			const result = oneTimeCheckoutTestConfig.fallbackVariant('GBPCountries');
			expect(result.name).toBe('CONTROL');
			expect(result.amounts.amounts).toEqual([30, 60, 120, 240]);
			expect(result.amounts.defaultAmount).toBe(60);
		});

		it('returns USD fallback variant for UnitedStates', () => {
			const result = oneTimeCheckoutTestConfig.fallbackVariant('UnitedStates');
			expect(result.name).toBe('CONTROL');
			expect(result.amounts.amounts).toEqual([25, 50, 100, 250]);
			expect(result.amounts.defaultAmount).toBe(50);
		});

		it('returns EUR fallback variant for EURCountries', () => {
			const result = oneTimeCheckoutTestConfig.fallbackVariant('EURCountries');
			expect(result.name).toBe('CONTROL');
			expect(result.amounts.amounts).toEqual([25, 50, 100, 250]);
			expect(result.amounts.defaultAmount).toBe(50);
		});

		it('returns International fallback variant', () => {
			const result = oneTimeCheckoutTestConfig.fallbackVariant('International');
			expect(result.name).toBe('CONTROL');
			expect(result.amounts.amounts).toEqual([25, 50, 100, 250]);
			expect(result.amounts.defaultAmount).toBe(50);
		});

		it('returns Canada fallback variant', () => {
			const result = oneTimeCheckoutTestConfig.fallbackVariant('Canada');
			expect(result.name).toBe('CONTROL');
			expect(result.amounts.amounts).toEqual([25, 50, 100, 250]);
			expect(result.amounts.defaultAmount).toBe(50);
		});

		it('returns AUD fallback variant for AUDCountries', () => {
			const result = oneTimeCheckoutTestConfig.fallbackVariant('AUDCountries');
			expect(result.name).toBe('CONTROL');
			expect(result.amounts.amounts).toEqual([60, 100, 250, 500]);
			expect(result.amounts.defaultAmount).toBe(100);
		});

		it('returns NZD fallback variant for NZDCountries', () => {
			const result = oneTimeCheckoutTestConfig.fallbackVariant('NZDCountries');
			expect(result.name).toBe('CONTROL');
			expect(result.amounts.amounts).toEqual([50, 100, 250, 500]);
			expect(result.amounts.defaultAmount).toBe(100);
		});

		it('returns fallback with hideChooseYourAmount set to false', () => {
			const countryGroups: CountryGroupId[] = [
				'GBPCountries',
				'UnitedStates',
				'EURCountries',
				'International',
				'Canada',
				'AUDCountries',
				'NZDCountries',
			];

			countryGroups.forEach((countryGroup) => {
				const result = oneTimeCheckoutTestConfig.fallbackVariant(countryGroup);
				expect(result.amounts.hideChooseYourAmount).toBe(false);
			});
		});

		it('returns fallback with heading and subheading', () => {
			const result = oneTimeCheckoutTestConfig.fallbackVariant('GBPCountries');
			expect(result.heading).toBe('Support just once');
			expect(result.subheading).toBe(
				'Support us with the amount of your choice.',
			);
		});
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
			regionTargeting: { targetedCountryGroups: ['UnitedStates'] },
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
		expect(config.fallbackParticipationKey).toBe(
			oneTimeCheckoutTestConfig.fallbackParticipationKey,
		);
		expect(config.getVariantName).toBe(
			oneTimeCheckoutTestConfig.getVariantName,
		);
		expect(config.fallbackVariant).toBe(
			oneTimeCheckoutTestConfig.fallbackVariant,
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
