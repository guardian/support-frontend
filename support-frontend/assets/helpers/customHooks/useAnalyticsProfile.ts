import { useCallback, useEffect, useState } from 'react';
import { fetchJson } from 'helpers/async/fetch';
import { useAnalyticsProfileCache } from './analyticsProfileCache';

const useAnalyticsProfile = () => {
	const cache = useAnalyticsProfileCache();
	const [hasMobileAppDownloaded, setHasMobileAppDownloaded] = useState(false);
	const [hasFeastMobileAppDownloaded, setHasFeastMobileAppDownloaded] =
		useState(false);
	const [dataLoaded, setDataLoaded] = useState(false);

	const loadAnalyticsData = useCallback(async () => {
		if (dataLoaded) {
			return;
		}

		// Check in-memory cache first (shared across all hook instances)
		const cachedData = cache.get();
		if (cachedData) {
			setHasMobileAppDownloaded(cachedData.hasMobileAppDownloaded);
			setHasFeastMobileAppDownloaded(cachedData.hasFeastMobileAppDownloaded);
			setDataLoaded(true);
			return;
		}

		// Check if there's already a pending request to avoid duplicate calls
		const pendingRequest = cache.getPendingRequest();
		if (pendingRequest) {
			try {
				const data = await pendingRequest;
				setHasMobileAppDownloaded(data.hasMobileAppDownloaded);
				setHasFeastMobileAppDownloaded(data.hasFeastMobileAppDownloaded);
				setDataLoaded(true);
				return;
			} catch (error) {
				// Fall through to make a new request
				console.error('Error with pending request:', error);
			}
		}

		// Make the API call and cache the promise to deduplicate concurrent requests
		const requestPromise = fetchJson<{
			identityId: string;
			hasMobileAppDownloaded: boolean;
			hasFeastMobileAppDownloaded: boolean;
		}>('/analytics-user-profile', {
			mode: 'cors',
			credentials: 'include',
		}).then((response) => ({
			hasMobileAppDownloaded: response.hasMobileAppDownloaded,
			hasFeastMobileAppDownloaded: response.hasFeastMobileAppDownloaded,
		}));

		cache.setPendingRequest(requestPromise);

		try {
			const data = await requestPromise;

			setHasMobileAppDownloaded(data.hasMobileAppDownloaded);
			setHasFeastMobileAppDownloaded(data.hasFeastMobileAppDownloaded);
			setDataLoaded(true);

			// Store in cache for subsequent requests within this page load
			cache.set(data);
		} catch (error) {
			console.error('Error calling Analytics endpoint:', error);
		} finally {
			cache.clearPendingRequest();
		}
	}, [dataLoaded, cache]);

	useEffect(() => {
		void loadAnalyticsData();
	}, [loadAnalyticsData]);

	return {
		hasMobileAppDownloaded,
		hasFeastMobileAppDownloaded,
		loadAnalyticsData,
	};
};

export default useAnalyticsProfile;
