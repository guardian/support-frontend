import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { getSettings } from '../../globalsAndSwitches/globals';
import type { SingleCheckoutTest } from '../../globalsAndSwitches/singleCheckoutSettings';
import { SINGLE_CHECKOUT_PARTICIPATIONS_KEY } from '../sessionStorage';
import {
	getSingleCheckoutTestConfig,
	singleCheckoutTestConfig,
} from '../singleCheckoutAbTests';

jest.mock('../../globalsAndSwitches/globals', () => ({
	__esModule: true,
	getSettings: jest.fn(),
}));

const mockTest: SingleCheckoutTest = {
	name: 'TEST_SINGLE_CHECKOUT',
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

describe('singleCheckoutTestConfig', () => {
	it('has correct pageRegex for one-time-checkout pages', () => {
		expect(singleCheckoutTestConfig.pageRegex).toBe(
			'^/.*/one-time-checkout(/.*)?$',
		);
	});

	it('has correct forceParamName', () => {
		expect(singleCheckoutTestConfig.forceParamName).toBe(
			'force-single-checkout',
		);
	});

	it('has correct sessionStorageKey', () => {
		expect(singleCheckoutTestConfig.sessionStorageKey).toBe(
			SINGLE_CHECKOUT_PARTICIPATIONS_KEY,
		);
	});

	it('has correct fallbackParticipationKey', () => {
		expect(singleCheckoutTestConfig.fallbackParticipationKey).toBe(
			'FALLBACK_SINGLE_CHECKOUT',
		);
	});

	describe('fallbackVariant', () => {
		it('returns GBP fallback variant for GBPCountries', () => {
			const result = singleCheckoutTestConfig.fallbackVariant('GBPCountries');
			expect(result.name).toBe('CONTROL');
			expect(result.amounts.amounts).toEqual([30, 60, 120, 240]);
			expect(result.amounts.defaultAmount).toBe(60);
		});

		it('returns USD fallback variant for UnitedStates', () => {
			const result = singleCheckoutTestConfig.fallbackVariant('UnitedStates');
			expect(result.name).toBe('CONTROL');
			expect(result.amounts.amounts).toEqual([25, 50, 100, 250]);
			expect(result.amounts.defaultAmount).toBe(50);
		});

		it('returns EUR fallback variant for EURCountries', () => {
			const result = singleCheckoutTestConfig.fallbackVariant('EURCountries');
			expect(result.name).toBe('CONTROL');
			expect(result.amounts.amounts).toEqual([25, 50, 100, 250]);
			expect(result.amounts.defaultAmount).toBe(50);
		});

		it('returns International fallback variant', () => {
			const result = singleCheckoutTestConfig.fallbackVariant('International');
			expect(result.name).toBe('CONTROL');
			expect(result.amounts.amounts).toEqual([25, 50, 100, 250]);
			expect(result.amounts.defaultAmount).toBe(50);
		});

		it('returns Canada fallback variant', () => {
			const result = singleCheckoutTestConfig.fallbackVariant('Canada');
			expect(result.name).toBe('CONTROL');
			expect(result.amounts.amounts).toEqual([25, 50, 100, 250]);
			expect(result.amounts.defaultAmount).toBe(50);
		});

		it('returns AUD fallback variant for AUDCountries', () => {
			const result = singleCheckoutTestConfig.fallbackVariant('AUDCountries');
			expect(result.name).toBe('CONTROL');
			expect(result.amounts.amounts).toEqual([60, 100, 250, 500]);
			expect(result.amounts.defaultAmount).toBe(100);
		});

		it('returns NZD fallback variant for NZDCountries', () => {
			const result = singleCheckoutTestConfig.fallbackVariant('NZDCountries');
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
				const result = singleCheckoutTestConfig.fallbackVariant(countryGroup);
				expect(result.amounts.hideChooseYourAmount).toBe(false);
			});
		});

		it('returns fallback with heading and subheading', () => {
			const result = singleCheckoutTestConfig.fallbackVariant('GBPCountries');
			expect(result.heading).toBe('Support just once');
			expect(result.subheading).toBe(
				'Support us with the amount of your choice.',
			);
		});
	});
});

describe('getSingleCheckoutTestConfig', () => {
	const mockGetSettings = getSettings as jest.MockedFunction<
		typeof getSettings
	>;

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('returns config with tests from settings', () => {
		mockGetSettings.mockReturnValue({
			singleCheckoutTests: [mockTest],
		} as ReturnType<typeof getSettings>);

		const config = getSingleCheckoutTestConfig();

		expect(config.tests).toEqual([mockTest]);
		expect(config.pageRegex).toBe('^/.*/one-time-checkout(/.*)?$');
		expect(config.forceParamName).toBe('force-single-checkout');
		expect(config.sessionStorageKey).toBe(SINGLE_CHECKOUT_PARTICIPATIONS_KEY);
	});

	it('returns empty tests array when singleCheckoutTests is undefined', () => {
		mockGetSettings.mockReturnValue({
			singleCheckoutTests: undefined,
		} as ReturnType<typeof getSettings>);

		const config = getSingleCheckoutTestConfig();

		expect(config.tests).toEqual([]);
	});

	it('returns empty tests array when singleCheckoutTests is null', () => {
		mockGetSettings.mockReturnValue({
			singleCheckoutTests: null,
		} as unknown as ReturnType<typeof getSettings>);

		const config = getSingleCheckoutTestConfig();

		expect(config.tests).toEqual([]);
	});

	it('returns multiple tests from settings', () => {
		const test2: SingleCheckoutTest = {
			name: 'TEST_SINGLE_CHECKOUT_2',
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
			singleCheckoutTests: [mockTest, test2],
		} as ReturnType<typeof getSettings>);

		const config = getSingleCheckoutTestConfig();

		expect(config.tests).toHaveLength(2);
		expect(config.tests).toEqual([mockTest, test2]);
	});

	it('preserves all config properties when adding tests', () => {
		mockGetSettings.mockReturnValue({
			singleCheckoutTests: [mockTest],
		} as ReturnType<typeof getSettings>);

		const config = getSingleCheckoutTestConfig();

		expect(config.pageRegex).toBe(singleCheckoutTestConfig.pageRegex);
		expect(config.forceParamName).toBe(singleCheckoutTestConfig.forceParamName);
		expect(config.sessionStorageKey).toBe(
			singleCheckoutTestConfig.sessionStorageKey,
		);
		expect(config.fallbackParticipationKey).toBe(
			singleCheckoutTestConfig.fallbackParticipationKey,
		);
		expect(config.getVariantName).toBe(singleCheckoutTestConfig.getVariantName);
		expect(config.fallbackVariant).toBe(
			singleCheckoutTestConfig.fallbackVariant,
		);
	});

	it('handles empty tests array from settings', () => {
		mockGetSettings.mockReturnValue({
			singleCheckoutTests: [],
		} as unknown as ReturnType<typeof getSettings>);

		const config = getSingleCheckoutTestConfig();

		expect(config.tests).toEqual([]);
		expect(config.tests).toHaveLength(0);
	});
});
