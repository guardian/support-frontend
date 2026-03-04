import { fetchJson } from 'helpers/async/fetch';
import { getUser } from 'helpers/user/user';

interface AnalyticsProfileData {
	hasMobileAppDownloaded: boolean;
	hasFeastMobileAppDownloaded: boolean;
	audienceMemberships: number[];
}

const emptyProfile: AnalyticsProfileData = {
	hasMobileAppDownloaded: false,
	hasFeastMobileAppDownloaded: false,
	audienceMemberships: [],
};

let cachedData: AnalyticsProfileData | null = null;
let pendingRequest: Promise<AnalyticsProfileData> | null = null;

/**
 * Fetches the analytics user profile from the backend.
 *
 * - Returns empty profile immediately for unauthenticated users.
 * - Deduplicates concurrent calls — only one network request is made per page load.
 * - Caches the result in memory for the lifetime of the page.
 */
export async function fetchAnalyticsUserProfile(): Promise<AnalyticsProfileData> {
	if (!getUser().isSignedIn) {
		return emptyProfile;
	}

	if (cachedData) {
		return cachedData;
	}

	if (pendingRequest) {
		return pendingRequest;
	}
	const timeoutPromise = new Promise<never>((_, reject) => {
		window.setTimeout(() => reject(new Error('Request timed out')), 2000);
	});

	pendingRequest = Promise.race([
		fetchJson<{
			identityId: string;
			hasMobileAppDownloaded: boolean;
			hasFeastMobileAppDownloaded: boolean;
			audienceMemberships: number[];
		}>('/analytics-user-profile', {
			mode: 'cors',
			credentials: 'include',
		}),
		timeoutPromise,
	])
		.then((response) => {
			cachedData = {
				hasMobileAppDownloaded: response.hasMobileAppDownloaded,
				hasFeastMobileAppDownloaded: response.hasFeastMobileAppDownloaded,
				audienceMemberships: response.audienceMemberships,
			};
			return cachedData;
		})
		.catch((error: unknown) => {
			pendingRequest = null;
			console.error('Error fetching analytics user profile:', error);
			return emptyProfile;
		});

	return pendingRequest;
}
