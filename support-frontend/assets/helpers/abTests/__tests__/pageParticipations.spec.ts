import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { CountryGroup } from '../../internationalisation/classes/countryGroup';
import { fetchAudienceMemberships } from '../../mparticle';
import {
	countryGroupMatches,
	getParticipationFromQueryString,
	randomNumber,
} from '../helpers';
import type { PageParticipationsConfig, PageTest } from '../models';
import { getMvtId } from '../mvt';
import {
	getPageParticipations,
	getPageParticipationsWithFallback,
} from '../pageParticipations';
import {
	getSessionParticipations,
	type Key,
	setSessionParticipations,
} from '../sessionStorage';

jest.mock('../../mparticle', () => ({
	__esModule: true,
	fetchAudienceMemberships: jest.fn(),
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
const mockFetchAudienceMemberships = jest.mocked(fetchAudienceMemberships);

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
	getVariantName: (variant: TestVariant) => string = (v) => v.name,
): PageParticipationsConfig<TestVariant> => ({
	tests,
	pageRegex,
	forceParamName,
	sessionStorageKey,
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
		mockFetchAudienceMemberships.mockResolvedValue([]);
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

		it('stores forced participation in session storage', async () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant]);
			const config = createConfig([test]);

			mockLocation('/test/page', '?force-test=test-1:control');
			mockGetParticipationFromQueryString.mockReturnValue({
				'test-1': 'control',
			});

			await getPageParticipations(config);

			expect(mockSetSessionParticipations).toHaveBeenCalledWith(
				{ 'test-1': 'control' },
				'landingPageParticipations',
			);
		});

		it('returns undefined variant when forced participation test not found', async () => {
			const test = createPageTest('test-1', [
				createTestVariant('control', 'control-value'),
			]);
			const config = createConfig([test]);

			mockLocation('/test/page', '?force-test=test-2:control');
			mockGetParticipationFromQueryString.mockReturnValue({
				'test-2': 'control',
			});

			const result = await getPageParticipations(config);

			expect(result).toEqual({
				participations: { 'test-2': 'control' },
				variant: undefined,
			});
		});

		it('returns undefined variant when forced variant name not found in test', async () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant]);
			const config = createConfig([test]);

			mockLocation('/test/page', '?force-test=test-1:variant-b');
			mockGetParticipationFromQueryString.mockReturnValue({
				'test-1': 'variant-b',
			});

			const result = await getPageParticipations(config);

			expect(result).toEqual({
				participations: { 'test-1': 'variant-b' },
				variant: undefined,
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

		it('clears cache and re-assigns when session storage variant not found', async () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant], 'Live', [
				'GBPCountries',
			]);
			const config = createConfig([test]);

			mockLocation('/test/page');
			mockGetSessionParticipations.mockReturnValue({
				'test-1': 'non-existent-variant',
			});
			mockCountryGroupMatches.mockReturnValue(true);
			mockRandomNumber.mockReturnValue(0);

			const result = await getPageParticipations(config);

			// Should clear stale cache and assign new variant
			expect(result).toEqual({
				participations: { 'test-1': 'control' },
				variant: variant,
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
			const config = createConfig([draftTest]);

			mockLocation('/test/page');
			mockDetect.mockReturnValue('GBPCountries');

			const result = await getPageParticipations(config);

			expect(result.variant).toBeUndefined();
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

	describe('Fallback behavior (getPageParticipationsWithFallback)', () => {
		it('returns fallback when no test matches country group', async () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant], 'Live', [
				'UnitedStates',
			]);
			const fallback = createFallbackVariant();
			const config = createConfig([test]);

			mockLocation('/test/page');
			mockDetect.mockReturnValue('GBPCountries');
			mockCountryGroupMatches.mockReturnValue(false);

			const result = await getPageParticipationsWithFallback(
				config,
				() => fallback,
				'FALLBACK_TEST',
			);

			expect(result).toEqual({
				participations: { FALLBACK_TEST: 'variant-fallback' },
				variant: fallback,
			});
		});

		it('returns fallback when no tests are configured', async () => {
			const fallback = createFallbackVariant();
			const config = createConfig([]);

			mockLocation('/test/page');

			const result = await getPageParticipationsWithFallback(
				config,
				() => fallback,
				'FALLBACK_TEST',
			);

			expect(result).toEqual({
				participations: { FALLBACK_TEST: 'variant-fallback' },
				variant: fallback,
			});
		});

		it('passes country group ID to fallback variant function', async () => {
			const fallbackFn = jest.fn((countryGroupId: CountryGroupId) =>
				createFallbackVariant(countryGroupId),
			);
			const config = createConfig([]);

			mockLocation('/test/page');
			mockDetect.mockReturnValue('AUDCountries');

			const result = await getPageParticipationsWithFallback(
				config,
				fallbackFn,
				'FALLBACK_TEST',
			);

			expect(fallbackFn).toHaveBeenCalledWith('AUDCountries');
			expect(result.variant.name).toBe('variant-AUDCountries');
		});

		it('returns undefined when no fallback and no test matches', async () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant], 'Live', [
				'UnitedStates',
			]);
			const config = createConfig([test]);

			mockLocation('/test/page');
			mockDetect.mockReturnValue('GBPCountries');
			mockCountryGroupMatches.mockReturnValue(false);

			const result = await getPageParticipations(config);

			expect(result.variant).toBeUndefined();
			expect(result.participations).toEqual({});
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
			const config = createConfig([]);

			mockLocation('/test/page');

			const result = await getPageParticipationsWithFallback(
				config,
				() => fallback,
				'CUSTOM_FALLBACK_KEY',
			);

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

		it('returns undefined variant when variant is undefined in test', async () => {
			const test = createPageTest('test-1', [], 'Live', ['GBPCountries']);
			const config = createConfig([test]);

			mockLocation('/test/page');
			mockDetect.mockReturnValue('GBPCountries');
			mockCountryGroupMatches.mockReturnValue(true);
			mockRandomNumber.mockReturnValue(0);

			const result = await getPageParticipations(config);

			expect(result.variant).toBeUndefined();
		});

		it('handles empty pathname', async () => {
			const config = createConfig([]);

			mockLocation('');

			const result = await getPageParticipations(config);

			expect(result.participations).toEqual({});
			expect(result.variant).toBeUndefined();
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
			mockFetchAudienceMemberships.mockResolvedValue([42]);

			const result = await getPageParticipations(config);

			expect(result.variant).toEqual(variant);
			expect(result.participations).toEqual({ 'test-1': 'control' });
		});

		it('returns undefined variant when user is NOT in the mParticle audience', async () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createAudienceTest('test-1', [variant], 42);
			const config = createConfig([test]);

			mockLocation('/test/page');
			mockDetect.mockReturnValue('GBPCountries');
			mockCountryGroupMatches.mockReturnValue(true);
			mockFetchAudienceMemberships.mockResolvedValue([99]);

			const result = await getPageParticipations(config);

			expect(result.variant).toBeUndefined();
			expect(mockSetSessionParticipations).not.toHaveBeenCalled();
		});

		it('honours session participation even when user is not in the mParticle audience', async () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createAudienceTest('test-1', [variant], 42);
			const config = createConfig([test]);

			mockLocation('/test/page');
			mockGetSessionParticipations.mockReturnValue({ 'test-1': 'control' });

			const result = await getPageParticipations(config);

			expect(result.variant).toEqual(variant);
			expect(mockFetchAudienceMemberships).not.toHaveBeenCalled();
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
			expect(mockFetchAudienceMemberships).not.toHaveBeenCalled();
		});
	});

	describe('Session storage validation and pruning (validate-and-prune logic)', () => {
		it('prunes stale participations that do not match current test names', async () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant], 'Live', [
				'GBPCountries',
			]);
			const config = createConfig([test]);

			mockLocation('/test/page');
			// Session has participation for a test that no longer exists
			mockGetSessionParticipations.mockReturnValue({
				'stale-test': 'variant-a',
				'test-1': 'control',
			});
			mockCountryGroupMatches.mockReturnValue(true);
			mockRandomNumber.mockReturnValue(0);

			const result = await getPageParticipations(config);

			// Should prune stale-test and keep test-1
			expect(result.participations).toEqual({ 'test-1': 'control' });
			expect(result.variant).toEqual(variant);
		});

		it('prunes participations that do not match methodology testName overrides', async () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant], 'Live', [
				'GBPCountries',
			]);
			test.methodologies = [
				{
					name: 'EpsilonGreedyBandit',
					testName: 'test-1-ABTest',
				},
			];
			const config = createConfig([test]);

			mockLocation('/test/page');
			// Session has participation for an old methodology that no longer exists
			mockGetSessionParticipations.mockReturnValue({
				'test-1-old-methodology': 'variant-a',
				'test-1-ABTest': 'control',
			});
			mockCountryGroupMatches.mockReturnValue(true);
			mockRandomNumber.mockReturnValue(0);

			const result = await getPageParticipations(config);

			// Should prune old methodology and keep current one
			expect(result.participations).toEqual({ 'test-1-ABTest': 'control' });
			expect(result.variant).toEqual(variant);
		});

		it('re-selects when all session participations are stale', async () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant], 'Live', [
				'GBPCountries',
			]);
			const config = createConfig([test]);

			mockLocation('/test/page');
			// Session has only stale participations
			mockGetSessionParticipations.mockReturnValue({
				'stale-test-1': 'variant-a',
				'stale-test-2': 'variant-b',
			});
			mockCountryGroupMatches.mockReturnValue(true);
			mockRandomNumber.mockReturnValue(0);

			const result = await getPageParticipations(config);

			// Should re-select and store fresh participation
			expect(result.participations).toEqual({ 'test-1': 'control' });
			expect(result.variant).toEqual(variant);
			expect(mockSetSessionParticipations).toHaveBeenCalledWith(
				{ 'test-1': 'control' },
				'landingPageParticipations',
			);
		});

		it('preserves methodology testName participations', async () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant], 'Live', [
				'GBPCountries',
			]);
			test.methodologies = [
				{ name: 'EpsilonGreedyBandit', testName: 'test-1-ABTest' },
			];
			const config = createConfig([test]);

			mockLocation('/test/page');
			mockGetSessionParticipations.mockReturnValue({
				'test-1-ABTest': 'control',
			});
			mockCountryGroupMatches.mockReturnValue(true);

			const result = await getPageParticipations(config);

			// Should preserve participation keyed by methodology testName
			expect(result.participations).toEqual({ 'test-1-ABTest': 'control' });
			expect(result.variant).toEqual(variant);
		});
	});

	describe('Cross-page consistency (landing → checkout)', () => {
		it('maintains same variant and tracking name across page navigation', async () => {
			const variant1 = createTestVariant('control', 'control-value');
			const variant2 = createTestVariant('variant-a', 'variant-a-value');
			const test = createPageTest('test-1', [variant1, variant2], 'Live', [
				'GBPCountries',
			]);
			test.methodologies = [
				{ name: 'EpsilonGreedyBandit', testName: 'test-1-ABTest' },
			];
			const config = createConfig([test], '^/.*/contribute(/.*)?$');

			// Simulate landing page visit
			mockLocation('/uk/contribute');
			mockCountryGroupMatches.mockReturnValue(true);
			mockRandomNumber.mockReturnValue(0);
			mockGetSessionParticipations.mockReturnValue(undefined);

			const landingResult = await getPageParticipations(config);

			// Store the participation that was set
			const storedParticipation =
				mockSetSessionParticipations.mock.calls[0]?.[0];

			// Simulate checkout page visit (same session)
			mockLocation('/uk/checkout');
			mockGetSessionParticipations.mockReturnValue(storedParticipation);

			const checkoutResult = await getPageParticipations(config);

			// Should return same variant from session storage but not track on checkout
			expect(checkoutResult.variant).toEqual(landingResult.variant);
			expect(checkoutResult.participations).toEqual({});
		});
	});

	describe('Direct checkout entry', () => {
		it('runs selection when user enters directly on checkout page', async () => {
			const variant = createTestVariant('control', 'control-value');
			const test = createPageTest('test-1', [variant], 'Live', [
				'GBPCountries',
			]);
			test.methodologies = [
				{ name: 'EpsilonGreedyBandit', testName: 'test-1-ABTest' },
			];
			const config = createConfig([test], '^/.*/contribute(/.*)?$');

			// Direct checkout entry (no session storage)
			mockLocation('/uk/checkout');
			mockGetSessionParticipations.mockReturnValue(undefined);
			mockCountryGroupMatches.mockReturnValue(true);
			mockRandomNumber.mockReturnValue(0);

			const result = await getPageParticipations(config);

			// Should select variant but not track on checkout
			expect(result.variant).toBeDefined();
			expect(result.participations).toEqual({});
			expect(mockSetSessionParticipations).toHaveBeenCalledWith(
				{ 'test-1': 'control' },
				'landingPageParticipations',
			);
		});
	});
});
