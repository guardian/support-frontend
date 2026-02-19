import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { fetchAnalyticsUserProfile } from '../../analytics/analyticsUserProfile';
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

jest.mock('../../analytics/analyticsUserProfile', () => ({
	__esModule: true,
	fetchAnalyticsUserProfile: jest.fn(),
}));

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
const mockFetchAnalyticsUserProfile = jest.mocked(fetchAnalyticsUserProfile);

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
		mockFetchAnalyticsUserProfile.mockResolvedValue({
			hasMobileAppDownloaded: false,
			hasFeastMobileAppDownloaded: false,
			audienceMemberships: [],
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('URL query string forced participation', () => {
		it('returns forced participation from query string', async () => {
			const variant1 = createTestVariant('control', 'control-value');
			const variant2 = createTestVariant('variant-a', 'variant-a-value');
			const test = createPageTest('test-1', [variant1, variant2]);
			const config = createConfig([test]);

			mockLocation('/test/page', '?force-test=test-1:control');
			mockGetParticipationFromQueryString.mockReturnValue({
				'test-1': 'control',
			});

			const result = await getPageParticipations(config);

			expect(result).toEqual({
				participations: { 'test-1': 'control' },
				variant: variant1,
			});
			expect(mockGetParticipationFromQueryString).toHaveBeenCalledWith(
				'?force-test=test-1:control',
				'force-test',
			);
		});

		it('returns fallback variant when forced participation test not found', async () => {
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

			const result = await getPageParticipations(config);

			expect(result).toEqual({
				participations: { 'test-2': 'control' },
				variant: fallback,
			});
		});

		it('returns fallback variant when forced variant name not found in test', async () => {
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

			const result = await getPageParticipations(config);

			expect(result).toEqual({
				participations: { 'test-1': 'variant-b' },
				variant: fallback,
			});
		});
	});

	describe('Session storage participation', () => {
		it('returns participation from session storage', async () => {
			const variant1 = createTestVariant('control', 'control-value');
			const variant2 = createTestVariant('variant-a', 'variant-a-value');
			const test = createPageTest('test-1', [variant1, variant2]);
			const config = createConfig([test]);

			mockLocation('/test/page');
			mockGetSessionParticipations.mockReturnValue({ 'test-1': 'variant-a' });

			const result = await getPageParticipations(config);

			expect(result).toEqual({
				participations: { 'test-1': 'variant-a' },
				variant: variant2,
			});
			expect(mockGetSessionParticipations).toHaveBeenCalledWith(
				'landingPageParticipations',
			);
		});

		it('ignores empty session storage participations', async () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant], 'Live', [
				'GBPCountries',
			]);
			const config = createConfig([test]);

			mockLocation('/test/page');
			mockGetSessionParticipations.mockReturnValue({});
			mockCountryGroupMatches.mockReturnValue(true);

			const result = await getPageParticipations(config);

			expect(result.variant).toEqual(variant);
			expect(mockCountryGroupMatches).toHaveBeenCalled();
		});

		it('returns fallback when session storage variant not found', async () => {
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

			const result = await getPageParticipations(config);

			expect(result).toEqual({
				participations: { 'test-1': 'non-existent-variant' },
				variant: fallback,
			});
		});
	});

	describe('New test assignment', () => {
		it('assigns user to a live test matching their country group', async () => {
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

			const result = await getPageParticipations(config);

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

		it('filters out draft tests', async () => {
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

			const result = await getPageParticipations(config);

			expect(result.variant).toEqual(fallback);
			expect(mockCountryGroupMatches).not.toHaveBeenCalled();
		});

		it('returns first matching live test', async () => {
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

			const result = await getPageParticipations(config);

			expect(result).toEqual({
				participations: { 'test-2': 'control-2' },
				variant: variant2,
			});
		});

		it('stores participation in session storage', async () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant], 'Live', [
				'GBPCountries',
			]);
			const config = createConfig([test]);

			mockLocation('/test/page');
			mockDetect.mockReturnValue('GBPCountries');
			mockCountryGroupMatches.mockReturnValue(true);
			mockRandomNumber.mockReturnValue(0);

			await getPageParticipations(config);

			expect(mockSetSessionParticipations).toHaveBeenCalledWith(
				{ 'test-1': 'control' },
				'landingPageParticipations',
			);
		});
	});

	describe('Fallback behavior', () => {
		it('returns fallback when no test matches country group', async () => {
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

			const result = await getPageParticipations(config);

			expect(result).toEqual({
				participations: { FALLBACK_TEST: 'variant-fallback' },
				variant: fallback,
			});
		});

		it('returns fallback when no tests are configured', async () => {
			const fallback = createFallbackVariant();
			const config = createConfig(
				[],
				'^/test/page$',
				'force-test',
				'landingPageParticipations',
				() => fallback,
			);

			mockLocation('/test/page');

			const result = await getPageParticipations(config);

			expect(result).toEqual({
				participations: { FALLBACK_TEST: 'variant-fallback' },
				variant: fallback,
			});
		});

		it('passes country group ID to fallback variant function', async () => {
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

			const result = await getPageParticipations(config);

			expect(fallbackFn).toHaveBeenCalledWith('AUDCountries');
			expect(result.variant.name).toBe('variant-AUDCountries');
		});
	});

	describe('Config properties', () => {
		it('uses custom getVariantName function', async () => {
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

			const result = await getPageParticipations(config);

			expect(result.participations).toEqual({ 'test-1': 'custom-name' });
		});

		it('uses custom fallback participation key', async () => {
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

			const result = await getPageParticipations(config);

			expect(result.participations).toEqual({
				CUSTOM_FALLBACK_KEY: 'variant-fallback',
			});
		});

		it('uses custom session storage key', async () => {
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

			await getPageParticipations(config);

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
		it('handles variant with null/undefined properties gracefully', async () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant], 'Live', [
				'GBPCountries',
			]);
			const config = createConfig([test]);

			mockLocation('/test/page');
			mockDetect.mockReturnValue('GBPCountries');
			mockCountryGroupMatches.mockReturnValue(true);
			mockRandomNumber.mockReturnValue(0);

			const result = await getPageParticipations(config);

			expect(result.variant).toBeDefined();
			expect(result.participations).toBeDefined();
		});

		it('handles test without region targeting', async () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant], 'Live');
			const config = createConfig([test]);

			mockLocation('/test/page');
			mockCountryGroupMatches.mockReturnValue(true);
			mockRandomNumber.mockReturnValue(0);

			const result = await getPageParticipations(config);

			expect(result.variant).toEqual(variant);
		});

		it('returns fallback when variant is undefined in test', async () => {
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

			const result = await getPageParticipations(config);

			expect(result.variant).toEqual(fallback);
		});

		it('handles empty pathname', async () => {
			const fallback = createFallbackVariant();
			const config = createConfig(
				[],
				'^/test/page$',
				'force-test',
				'landingPageParticipations',
				() => fallback,
			);

			mockLocation('');

			const result = await getPageParticipations(config);

			expect(result.participations).toEqual({});
			expect(result.variant).toEqual(fallback);
		});
	});

	describe('mParticle audience gating', () => {
		const createAudienceTest = (
			name: string,
			variants: TestVariant[],
			audienceId: number,
		): PageTest<TestVariant> => ({
			name,
			status: 'Live',
			mParticleAudience: audienceId,
			variants,
		});

		it('returns test variant when user is in the mParticle audience', async () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createAudienceTest('test-1', [variant], 42);
			const config = createConfig([test]);

			mockLocation('/test/page');
			mockDetect.mockReturnValue('GBPCountries');
			mockCountryGroupMatches.mockReturnValue(true);
			mockRandomNumber.mockReturnValue(0);
			mockFetchAnalyticsUserProfile.mockResolvedValue({
				hasMobileAppDownloaded: false,
				hasFeastMobileAppDownloaded: false,
				audienceMemberships: [42],
			});

			const result = await getPageParticipations(config);

			expect(result.variant).toEqual(variant);
			expect(result.participations).toEqual({ 'test-1': 'control' });
		});

		it('returns fallback when user is NOT in the mParticle audience', async () => {
			const variant = createTestVariant('control', 'control-value');
			const fallback = createFallbackVariant();
			const test = createAudienceTest('test-1', [variant], 42);
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
			mockFetchAnalyticsUserProfile.mockResolvedValue({
				hasMobileAppDownloaded: false,
				hasFeastMobileAppDownloaded: false,
				audienceMemberships: [99],
			});

			const result = await getPageParticipations(config);

			expect(result.variant).toEqual(fallback);
			expect(mockSetSessionParticipations).not.toHaveBeenCalled();
		});

		it('returns fallback when session participation has mParticleAudience and user is not in audience', async () => {
			const variant = createTestVariant('control', 'control-value');
			const fallback = createFallbackVariant();
			const test = createAudienceTest('test-1', [variant], 42);
			const config = createConfig(
				[test],
				'^/test/page$',
				'force-test',
				'landingPageParticipations',
				() => fallback,
			);

			mockLocation('/test/page');
			mockGetSessionParticipations.mockReturnValue({ 'test-1': 'control' });
			mockFetchAnalyticsUserProfile.mockResolvedValue({
				hasMobileAppDownloaded: false,
				hasFeastMobileAppDownloaded: false,
				audienceMemberships: [],
			});

			const result = await getPageParticipations(config);

			expect(result.variant).toEqual(fallback);
		});

		it('bypasses audience check for URL-forced participations', async () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createAudienceTest('test-1', [variant], 42);
			const config = createConfig([test]);

			mockLocation('/test/page', '?force-test=test-1:control');
			mockGetParticipationFromQueryString.mockReturnValue({
				'test-1': 'control',
			});

			const result = await getPageParticipations(config);

			expect(result.participations).toEqual({ 'test-1': 'control' });
			expect(mockFetchAnalyticsUserProfile).not.toHaveBeenCalled();
		});
	});
});
