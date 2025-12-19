import { fetchJson } from '../../async/fetch';
import { AnalyticsProfileCache } from '../analyticsProfileCache';
// Mock the network fetch used by the cache
jest.mock('../../async/fetch', () => ({
	fetchJson: jest.fn(),
}));

const successResponse = {
	identityId: 'abc',
	hasMobileAppDownloaded: true,
	hasFeastMobileAppDownloaded: false,
};

describe('AnalyticsProfileCache (class)', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	test('dedupes concurrent requests on initial fetch', async () => {
		const resolveFns: Array<(v: unknown) => void> = [];
		(fetchJson as jest.Mock).mockImplementation(
			() => new Promise((resolve) => resolveFns.push(resolve)),
		);

		const cache = new AnalyticsProfileCache(1000);

		const p1 = cache.get();
		const p2 = cache.get();

		expect(fetchJson).toHaveBeenCalledTimes(1);

		// Resolve the in-flight request
		resolveFns[0]?.(successResponse);
		await expect(p1).resolves.toEqual({
			hasMobileAppDownloaded: true,
			hasFeastMobileAppDownloaded: false,
		});
		await expect(p2).resolves.toEqual({
			hasMobileAppDownloaded: true,
			hasFeastMobileAppDownloaded: false,
		});
	});

	test('returns cached value when fresh within TTL', async () => {
		(fetchJson as jest.Mock)
			.mockResolvedValueOnce(successResponse)
			.mockResolvedValueOnce({ ...successResponse });

		const cache = new AnalyticsProfileCache(1000);

		const v1 = await cache.get();
		expect(v1).toEqual({
			hasMobileAppDownloaded: true,
			hasFeastMobileAppDownloaded: false,
		});

		const v2 = await cache.get();
		expect(fetchJson).toHaveBeenCalledTimes(1);
		expect(v2).toEqual(v1);
	});

	test('stale-while-revalidate: returns last good value and refreshes; on failure keeps last', async () => {
		(fetchJson as jest.Mock).mockResolvedValueOnce(successResponse);
		const cache = new AnalyticsProfileCache(10);

		const v1 = await cache.get();
		expect(v1).toEqual({
			hasMobileAppDownloaded: true,
			hasFeastMobileAppDownloaded: false,
		});

		// Advance time beyond TTL
		const realNow = Date.now;
		const base = realNow();
		jest.spyOn(Date, 'now').mockImplementation(() => base + 1000);

		(fetchJson as jest.Mock).mockRejectedValue(new Error('network failed'));
		const v2 = await cache.get();
		expect(v2).toEqual(v1);
		expect(fetchJson).toHaveBeenCalledTimes(2);

		const v3 = await cache.get();
		expect(v3).toEqual(v1);

		(Date.now as unknown as jest.SpyInstance).mockRestore();
	});
});
