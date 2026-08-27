import { cmp, onConsent } from '@guardian/consent-manager';
import { getUser } from 'helpers/user/user';
import { fetchAudienceData } from '../mparticle';

jest.mock('@guardian/consent-manager', () => ({
	onConsent: jest.fn(),
	cmp: {
		willShowPrivacyMessage: jest.fn(),
	},
}));

jest.mock('helpers/user/user', () => ({
	getUser: jest.fn(),
}));

describe('fetchAudienceData', () => {
	const mockFetch = jest.fn();
	const mockOnConsent = onConsent as jest.MockedFunction<typeof onConsent>;
	const mockWillShowPrivacyMessage =
		cmp.willShowPrivacyMessage as jest.MockedFunction<
			typeof cmp.willShowPrivacyMessage
		>;
	const mockGetUser = jest.mocked(getUser);

	beforeEach(() => {
		global.fetch = mockFetch;
		mockFetch.mockClear();
		mockOnConsent.mockClear();
		mockGetUser.mockClear();
		mockOnConsent.mockResolvedValue({ canTarget: true, framework: null });
		mockGetUser.mockReturnValue({ isSignedIn: true });
		mockWillShowPrivacyMessage.mockClear();
		mockWillShowPrivacyMessage.mockResolvedValue(false);
		jest.clearAllTimers();
	});

	afterEach(() => {
		jest.restoreAllMocks();
		jest.useRealTimers();
	});

	it('should return empty array when user is not signed in', async () => {
		mockGetUser.mockReturnValue({ isSignedIn: false });

		const result = await fetchAudienceData();
		expect(result).toEqual({ audienceMemberships: [], userAttributes: {} });
		expect(mockFetch).not.toHaveBeenCalled();
	});

	it('should return empty array when user does not have targeting consent', async () => {
		mockOnConsent.mockResolvedValue({ canTarget: false, framework: null });

		const result = await fetchAudienceData();
		expect(result).toEqual({ audienceMemberships: [], userAttributes: {} });
		expect(mockFetch).not.toHaveBeenCalled();
	});

	it('should return empty array when privacy message will be shown', async () => {
		mockWillShowPrivacyMessage.mockResolvedValue(true);

		const result = await fetchAudienceData();
		expect(result).toEqual({ audienceMemberships: [], userAttributes: {} });
		expect(mockOnConsent).not.toHaveBeenCalled();
		expect(mockFetch).not.toHaveBeenCalled();
	});

	it('should return empty array when consent check throws an error', async () => {
		mockOnConsent.mockRejectedValueOnce(new Error('Consent error'));

		const result = await fetchAudienceData();
		expect(result).toEqual({ audienceMemberships: [], userAttributes: {} });
		expect(mockFetch).not.toHaveBeenCalled();
	});

	it('should return audience memberships when fetch succeeds', async () => {
		const audienceData = {
			audienceMemberships: [123, 456, 789],
			userAttributes: { appVersion: '1.0' },
		};
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => audienceData,
		});

		const result = await fetchAudienceData();
		expect(result).toEqual(audienceData);
		expect(mockFetch).toHaveBeenCalledWith(
			'/audience-data',
			expect.objectContaining({
				mode: 'cors',
				credentials: 'include',
			}),
		);
	});

	it('should return empty array when fetch response is not ok', async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 500,
		});

		const result = await fetchAudienceData();
		expect(result).toEqual({ audienceMemberships: [], userAttributes: {} });
	});

	it('should return empty array when fetch throws an error', async () => {
		mockFetch.mockRejectedValueOnce(new Error('Network error'));

		const result = await fetchAudienceData();
		expect(result).toEqual({ audienceMemberships: [], userAttributes: {} });
	});

	it('should return empty array on timeout', async () => {
		jest.useFakeTimers();
		mockFetch.mockReturnValueOnce(new Promise(() => undefined));

		const resultPromise = fetchAudienceData();
		await jest.advanceTimersByTimeAsync(2000);
		const result = await resultPromise;
		expect(result).toEqual({ audienceMemberships: [], userAttributes: {} });
	});

	it('should de-duplicate concurrent requests while a request is in flight', async () => {
		const audienceData = {
			audienceMemberships: [123, 456],
			userAttributes: {},
		};
		let resolveFetch: (value: unknown) => void = () => undefined;
		let resolveConsent: (value: {
			canTarget: boolean;
			framework: null;
		}) => void = () => undefined;
		mockOnConsent.mockReturnValueOnce(
			new Promise((resolve) => {
				resolveConsent = resolve;
			}),
		);
		mockFetch.mockReturnValueOnce(
			new Promise((resolve) => {
				resolveFetch = resolve;
			}),
		);

		const firstCall = fetchAudienceData();
		const secondCall = fetchAudienceData();
		resolveConsent({ canTarget: true, framework: null });
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(mockFetch).toHaveBeenCalledTimes(1);

		resolveFetch({
			json: () => audienceData,
		});

		const [firstResult, secondResult] = await Promise.all([
			firstCall,
			secondCall,
		]);
		expect(firstResult).toEqual(audienceData);
		expect(secondResult).toEqual(audienceData);
	});

	it('should clear cache after a successful response', async () => {
		mockFetch
			.mockResolvedValueOnce({
				json: () => ({ audienceMemberships: [111], userAttributes: {} }),
			})
			.mockResolvedValueOnce({
				json: () => ({ audienceMemberships: [222], userAttributes: {} }),
			});

		const firstResult = await fetchAudienceData();
		const secondResult = await fetchAudienceData();

		expect(firstResult).toEqual({ audienceMemberships: [111], userAttributes: {} });
		expect(secondResult).toEqual({ audienceMemberships: [222], userAttributes: {} });
		expect(mockFetch).toHaveBeenCalledTimes(2);
	});

	it('should clear cache after a failed response and allow retry', async () => {
		mockFetch
			.mockRejectedValueOnce(new Error('Network error'))
			.mockResolvedValueOnce({
				json: () => ({ audienceMemberships: [999], userAttributes: {} }),
			});

		const firstResult = await fetchAudienceData();
		const secondResult = await fetchAudienceData();

		expect(firstResult).toEqual({ audienceMemberships: [], userAttributes: {} });
		expect(secondResult).toEqual({ audienceMemberships: [999], userAttributes: {} });
		expect(mockFetch).toHaveBeenCalledTimes(2);
	});
});
