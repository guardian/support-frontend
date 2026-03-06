import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { CountryGroup } from '../../internationalisation/classes/countryGroup';
import {
	countryGroupMatches,
	getParticipationFromQueryString,
	randomNumber,
} from '../helpers';
import type { PageParticipationsConfig, PageTest } from '../models';
import { getMvtId } from '../mvt';
import { getPageParticipations } from '../pageParticipations';
import {
	getSessionParticipations,
	type Key,
	setSessionParticipations,
} from '../sessionStorage';

jest.mock('../../internationalisation/classes/countryGroup', () => ({
	__esModule: true,
	CountryGroup: {
		detect: jest.fn(),
	},
}));

jest.mock('../mvt', () => ({
	__esModule: true,
	getMvtId: jest.fn(),
}));

jest.mock('../helpers', () => ({
	__esModule: true,
	countryGroupMatches: jest.fn(),
	getParticipationFromQueryString: jest.fn(),
	randomNumber: jest.fn(),
}));

jest.mock('../sessionStorage', () => ({
	__esModule: true,
	getSessionParticipations: jest.fn(),
	setSessionParticipations: jest.fn(),
}));

// Store mock references - safe to use in test context
// eslint-disable-next-line @typescript-eslint/unbound-method -- CountryGroup.detect is mocked and doesn't use 'this'
const mockDetect = jest.mocked(CountryGroup.detect);
const mockGetMvtId = jest.mocked(getMvtId);
const mockCountryGroupMatches = jest.mocked(countryGroupMatches);
const mockGetParticipationFromQueryString = jest.mocked(
	getParticipationFromQueryString,
);
const mockRandomNumber = jest.mocked(randomNumber);
const mockGetSessionParticipations = jest.mocked(getSessionParticipations);
const mockSetSessionParticipations = jest.mocked(setSessionParticipations);

interface TestVariant {
	name: string;
	value: string;
}

const mockLocation = (pathname: string, search: string = '') => {
	Object.defineProperty(window, 'location', {
		value: { pathname, search },
		writable: true,
	});
};

const createFallbackVariant = (suffix: string = 'fallback'): TestVariant => ({
	name: `variant-${suffix}`,
	value: `value-${suffix}`,
});

const createTestVariant = (name: string, value: string): TestVariant => ({
	name,
	value,
});

const createPageTest = (
	name: string,
	variants: TestVariant[],
	status: 'Live' | 'Draft' = 'Live',
	targetedCountryGroups?: CountryGroupId[],
): PageTest<TestVariant> => ({
	name,
	status,
	...(targetedCountryGroups && {
		regionTargeting: { targetedCountryGroups },
	}),
	variants,
});

const createConfig = (
	tests: Array<PageTest<TestVariant>>,
	pageRegex: string = '^/test/page$',
	forceParamName: string = 'force-test',
	sessionStorageKey: Key = 'landingPageParticipations',
	fallbackVariant: (
		countryGroupId: CountryGroupId,
	) => TestVariant = createFallbackVariant,
	fallbackParticipationKey: string = 'FALLBACK_TEST',
	getVariantName: (variant: TestVariant) => string = (v) => v.name,
): PageParticipationsConfig<TestVariant> => ({
	tests,
	pageRegex,
	forceParamName,
	sessionStorageKey,
	fallbackVariant,
	fallbackParticipationKey,
	getVariantName,
});

describe('getPageParticipations', () => {
	beforeEach(() => {
		mockDetect.mockReturnValue('GBPCountries');
		mockGetMvtId.mockReturnValue(0);
		mockCountryGroupMatches.mockReturnValue(false);
		mockGetParticipationFromQueryString.mockReturnValue(undefined);
		mockRandomNumber.mockReturnValue(0);
		mockGetSessionParticipations.mockReturnValue(undefined);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('URL query string forced participation', () => {
		it('returns forced participation from query string', () => {
			const variant1 = createTestVariant('control', 'control-value');
			const variant2 = createTestVariant('variant-a', 'variant-a-value');
			const test = createPageTest('test-1', [variant1, variant2]);
			const config = createConfig([test]);

			mockLocation('/test/page', '?force-test=test-1:control');
			mockGetParticipationFromQueryString.mockReturnValue({
				'test-1': 'control',
			});

			const result = getPageParticipations(config);

			expect(result).toEqual({
				participations: { 'test-1': 'control' },
				variant: variant1,
			});
			expect(mockGetParticipationFromQueryString).toHaveBeenCalledWith(
				'?force-test=test-1:control',
				'force-test',
			);
		});

		it('returns fallback variant when forced participation test not found', () => {
			const test = createPageTest('test-1', [
				createTestVariant('control', 'control-value'),
			]);
			const fallback = createFallbackVariant();
			const config = createConfig(
				[test],
				'^/test/page$',
				'force-test',
				'landingPageParticipations',
				() => fallback,
			);

			mockLocation('/test/page', '?force-test=test-2:control');
			mockGetParticipationFromQueryString.mockReturnValue({
				'test-2': 'control',
			});

			const result = getPageParticipations(config);

			expect(result).toEqual({
				participations: { 'test-2': 'control' },
				variant: fallback,
			});
		});

		it('returns fallback variant when forced variant name not found in test', () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant]);
			const fallback = createFallbackVariant();
			const config = createConfig(
				[test],
				'^/test/page$',
				'force-test',
				'landingPageParticipations',
				() => fallback,
			);

			mockLocation('/test/page', '?force-test=test-1:variant-b');
			mockGetParticipationFromQueryString.mockReturnValue({
				'test-1': 'variant-b',
			});

			const result = getPageParticipations(config);

			expect(result).toEqual({
				participations: { 'test-1': 'variant-b' },
				variant: fallback,
			});
		});
	});

	describe('Session storage participation', () => {
		it('returns participation from session storage', () => {
			const variant1 = createTestVariant('control', 'control-value');
			const variant2 = createTestVariant('variant-a', 'variant-a-value');
			const test = createPageTest('test-1', [variant1, variant2]);
			const config = createConfig([test]);

			mockLocation('/test/page');
			mockGetSessionParticipations.mockReturnValue({ 'test-1': 'variant-a' });

			const result = getPageParticipations(config);

			expect(result).toEqual({
				participations: { 'test-1': 'variant-a' },
				variant: variant2,
			});
			expect(mockGetSessionParticipations).toHaveBeenCalledWith(
				'landingPageParticipations',
			);
		});

		it('ignores empty session storage participations', () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant], 'Live', [
				'GBPCountries',
			]);
			const config = createConfig([test]);

			mockLocation('/test/page');
			mockGetSessionParticipations.mockReturnValue({});
			mockCountryGroupMatches.mockReturnValue(true);

			const result = getPageParticipations(config);

			expect(result.variant).toEqual(variant);
			expect(mockCountryGroupMatches).toHaveBeenCalled();
		});

		it('returns fallback when session storage variant not found', () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant]);
			const fallback = createFallbackVariant();
			const config = createConfig(
				[test],
				'^/test/page$',
				'force-test',
				'landingPageParticipations',
				() => fallback,
			);

			mockLocation('/test/page');
			mockGetSessionParticipations.mockReturnValue({
				'test-1': 'non-existent-variant',
			});

			const result = getPageParticipations(config);

			expect(result).toEqual({
				participations: { 'test-1': 'non-existent-variant' },
				variant: fallback,
			});
		});
	});

	describe('New test assignment', () => {
		it('assigns user to a live test matching their country group', () => {
			const variant1 = createTestVariant('control', 'control-value');
			const variant2 = createTestVariant('variant-a', 'variant-a-value');
			const test = createPageTest('test-1', [variant1, variant2], 'Live', [
				'GBPCountries',
			]);
			const config = createConfig([test]);

			mockLocation('/test/page');
			mockDetect.mockReturnValue('GBPCountries');
			mockCountryGroupMatches.mockReturnValue(true);
			mockRandomNumber.mockReturnValue(1);

			const result = getPageParticipations(config);

			expect(result).toEqual({
				participations: { 'test-1': 'variant-a' },
				variant: variant2,
			});
			expect(mockRandomNumber).toHaveBeenCalledWith(0, 'test-1');
			expect(mockSetSessionParticipations).toHaveBeenCalledWith(
				{ 'test-1': 'variant-a' },
				'landingPageParticipations',
			);
		});

		it('filters out draft tests', () => {
			const draftVariant = createTestVariant('draft', 'draft-value');
			const draftTest = createPageTest('draft-test', [draftVariant], 'Draft', [
				'GBPCountries',
			]);
			const fallback = createFallbackVariant();
			const config = createConfig(
				[draftTest],
				'^/test/page$',
				'force-test',
				'landingPageParticipations',
				() => fallback,
			);

			mockLocation('/test/page');
			mockDetect.mockReturnValue('GBPCountries');

			const result = getPageParticipations(config);

			expect(result.variant).toEqual(fallback);
			expect(mockCountryGroupMatches).not.toHaveBeenCalled();
		});

		it('returns first matching live test', () => {
			const variant1 = createTestVariant('control-1', 'control-1-value');
			const variant2 = createTestVariant('control-2', 'control-2-value');
			const test1 = createPageTest('test-1', [variant1], 'Live', [
				'GBPCountries',
			]);
			const test2 = createPageTest('test-2', [variant2], 'Live', [
				'GBPCountries',
			]);
			const config = createConfig([test1, test2]);

			mockLocation('/test/page');
			mockDetect.mockReturnValue('GBPCountries');
			mockCountryGroupMatches
				.mockReturnValueOnce(false)
				.mockReturnValueOnce(true);
			mockRandomNumber.mockReturnValue(0);

			const result = getPageParticipations(config);

			expect(result).toEqual({
				participations: { 'test-2': 'control-2' },
				variant: variant2,
			});
		});

		it('stores participation in session storage', () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant], 'Live', [
				'GBPCountries',
			]);
			const config = createConfig([test]);

			mockLocation('/test/page');
			mockDetect.mockReturnValue('GBPCountries');
			mockCountryGroupMatches.mockReturnValue(true);
			mockRandomNumber.mockReturnValue(0);

			getPageParticipations(config);

			expect(mockSetSessionParticipations).toHaveBeenCalledWith(
				{ 'test-1': 'control' },
				'landingPageParticipations',
			);
		});
	});

	describe('Fallback behavior', () => {
		it('returns fallback when no test matches country group', () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant], 'Live', [
				'UnitedStates',
			]);
			const fallback = createFallbackVariant();
			const config = createConfig(
				[test],
				'^/test/page$',
				'force-test',
				'landingPageParticipations',
				() => fallback,
			);

			mockLocation('/test/page');
			mockDetect.mockReturnValue('GBPCountries');
			mockCountryGroupMatches.mockReturnValue(false);

			const result = getPageParticipations(config);

			expect(result).toEqual({
				participations: { FALLBACK_TEST: 'variant-fallback' },
				variant: fallback,
			});
		});

		it('returns fallback when no tests are configured', () => {
			const fallback = createFallbackVariant();
			const config = createConfig(
				[],
				'^/test/page$',
				'force-test',
				'landingPageParticipations',
				() => fallback,
			);

			mockLocation('/test/page');

			const result = getPageParticipations(config);

			expect(result).toEqual({
				participations: { FALLBACK_TEST: 'variant-fallback' },
				variant: fallback,
			});
		});

		it('passes country group ID to fallback variant function', () => {
			const fallbackFn = jest.fn((countryGroupId: CountryGroupId) =>
				createFallbackVariant(countryGroupId),
			);
			const config = createConfig(
				[],
				'^/test/page$',
				'force-test',
				'landingPageParticipations',
				fallbackFn,
			);

			mockLocation('/test/page');
			mockDetect.mockReturnValue('AUDCountries');

			const result = getPageParticipations(config);

			expect(fallbackFn).toHaveBeenCalledWith('AUDCountries');
			expect(result.variant.name).toBe('variant-AUDCountries');
		});
	});

	describe('Config properties', () => {
		it('uses custom getVariantName function', () => {
			const variant = createTestVariant('control', 'custom-name');
			const test = createPageTest('test-1', [variant], 'Live', [
				'GBPCountries',
			]);
			const config = createConfig(
				[test],
				'^/test/page$',
				'force-test',
				'landingPageParticipations',
				createFallbackVariant,
				'FALLBACK_TEST',
				(v) => v.value, // Use value instead of name
			);

			mockLocation('/test/page');
			mockDetect.mockReturnValue('GBPCountries');
			mockCountryGroupMatches.mockReturnValue(true);
			mockRandomNumber.mockReturnValue(0);

			const result = getPageParticipations(config);

			expect(result.participations).toEqual({ 'test-1': 'custom-name' });
		});

		it('uses custom fallback participation key', () => {
			const fallback = createFallbackVariant();
			const config = createConfig(
				[],
				'^/test/page$',
				'force-test',
				'landingPageParticipations',
				() => fallback,
				'CUSTOM_FALLBACK_KEY',
			);

			mockLocation('/test/page');

			const result = getPageParticipations(config);

			expect(result.participations).toEqual({
				CUSTOM_FALLBACK_KEY: 'variant-fallback',
			});
		});

		it('uses custom session storage key', () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant], 'Live', [
				'GBPCountries',
			]);
			const config = createConfig(
				[test],
				'^/test/page$',
				'force-test',
				'checkoutNudgeParticipations',
			);

			mockLocation('/test/page');
			mockDetect.mockReturnValue('GBPCountries');
			mockCountryGroupMatches.mockReturnValue(true);
			mockRandomNumber.mockReturnValue(0);

			getPageParticipations(config);

			expect(mockSetSessionParticipations).toHaveBeenCalledWith(
				{ 'test-1': 'control' },
				'checkoutNudgeParticipations',
			);
			expect(mockGetSessionParticipations).toHaveBeenCalledWith(
				'checkoutNudgeParticipations',
			);
		});
	});

	describe('Edge cases', () => {
		it('handles variant with null/undefined properties gracefully', () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant], 'Live', [
				'GBPCountries',
			]);
			const config = createConfig([test]);

			mockLocation('/test/page');
			mockDetect.mockReturnValue('GBPCountries');
			mockCountryGroupMatches.mockReturnValue(true);
			mockRandomNumber.mockReturnValue(0);

			const result = getPageParticipations(config);

			expect(result.variant).toBeDefined();
			expect(result.participations).toBeDefined();
		});

		it('handles test without region targeting', () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant], 'Live');
			const config = createConfig([test]);

			mockLocation('/test/page');
			mockCountryGroupMatches.mockReturnValue(true);
			mockRandomNumber.mockReturnValue(0);

			const result = getPageParticipations(config);

			expect(result.variant).toEqual(variant);
		});

		it('returns fallback when variant is undefined in test', () => {
			const test = createPageTest('test-1', [], 'Live', ['GBPCountries']);
			const fallback = createFallbackVariant();
			const config = createConfig(
				[test],
				'^/test/page$',
				'force-test',
				'landingPageParticipations',
				() => fallback,
			);

			mockLocation('/test/page');
			mockDetect.mockReturnValue('GBPCountries');
			mockCountryGroupMatches.mockReturnValue(true);
			mockRandomNumber.mockReturnValue(0);

			const result = getPageParticipations(config);

			expect(result.variant).toEqual(fallback);
		});

		it('handles empty pathname', () => {
			const fallback = createFallbackVariant();
			const config = createConfig(
				[],
				'^/test/page$',
				'force-test',
				'landingPageParticipations',
				() => fallback,
			);

			mockLocation('');

			const result = getPageParticipations(config);

			expect(result.participations).toEqual({});
			expect(result.variant).toEqual(fallback);
		});
	});
});
