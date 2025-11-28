import { onConsent } from '@guardian/libs';
import { fetchIsPastSingleContributor } from '../mparticle';

jest.mock('@guardian/libs', () => ({
	onConsent: jest.fn(),
}));

describe('fetchIsPastSingleContributor', () => {
	const mockFetch = jest.fn();
	const mockOnConsent = onConsent as jest.MockedFunction<typeof onConsent>;

	beforeEach(() => {
		global.fetch = mockFetch;
		mockFetch.mockClear();

		mockOnConsent.mockClear();
		mockOnConsent.mockResolvedValue({ canTarget: true, framework: null });
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should return false when isSignedIn = false', async () => {
		const isSignedIn = false;
		const variant = 'control';
		const result = await fetchIsPastSingleContributor(isSignedIn, variant);
		expect(result).toBe(false);
		expect(mockFetch).not.toHaveBeenCalled();
	});

	it('should return false when user is not in test', async () => {
		const isSignedIn = true;
		const variant = undefined;
		const result = await fetchIsPastSingleContributor(isSignedIn, variant);
		expect(result).toBe(false);
		expect(mockFetch).not.toHaveBeenCalled();
	});

	it('should return false when user does not have targeting consent', async () => {
		mockOnConsent.mockResolvedValue({ canTarget: false, framework: null });

		const isSignedIn = true;
		const variant = 'control';
		const result = await fetchIsPastSingleContributor(isSignedIn, variant);
		expect(result).toBe(false);
		expect(mockFetch).not.toHaveBeenCalled();
	});

	it('should return true when mparticle returns isPastSingleContributor: true', async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => ({ isAudienceMember: true }),
		});

		const isSignedIn = true;
		const variant = 'control';
		const result = await fetchIsPastSingleContributor(isSignedIn, variant);
		expect(result).toBe(true);
		expect(mockFetch).toHaveBeenCalled();
	});

	it('should return false when mparticle returns isPastSingleContributor: false', async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => ({ isAudienceMember: false }),
		});

		const isSignedIn = true;
		const variant = 'control';
		const result = await fetchIsPastSingleContributor(isSignedIn, variant);
		expect(result).toBe(false);
		expect(mockFetch).toHaveBeenCalled();
	});

	it('should return false when fetch response is not ok', async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 500,
		});

		const isSignedIn = true;
		const variant = 'control';
		const result = await fetchIsPastSingleContributor(isSignedIn, variant);
		expect(result).toBe(false);
	});

	it('should return false when fetch throws an error', async () => {
		mockFetch.mockRejectedValueOnce(new Error('Network error'));

		const isSignedIn = true;
		const variant = 'control';
		const result = await fetchIsPastSingleContributor(isSignedIn, variant);
		expect(result).toBe(false);
	});
});
