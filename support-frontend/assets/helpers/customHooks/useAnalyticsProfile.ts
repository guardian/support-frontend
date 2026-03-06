import { useCallback, useEffect, useState } from 'react';
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

		try {
			const cachedData = await cache.get();
			setHasMobileAppDownloaded(cachedData.hasMobileAppDownloaded);
			setHasFeastMobileAppDownloaded(cachedData.hasFeastMobileAppDownloaded);
			setDataLoaded(true);
		} catch (error) {
			console.error('Error calling Analytics endpoint:', error);
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
