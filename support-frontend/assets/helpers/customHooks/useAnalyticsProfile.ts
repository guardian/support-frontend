import { useCallback, useEffect, useState } from 'react';
import { fetchAnalyticsUserProfile } from 'helpers/analytics/analyticsUserProfile';

const useAnalyticsProfile = () => {
	const [hasMobileAppDownloaded, setHasMobileAppDownloaded] = useState(false);
	const [hasFeastMobileAppDownloaded, setHasFeastMobileAppDownloaded] =
		useState(false);
	const [dataLoaded, setDataLoaded] = useState(false);

	const loadAnalyticsData = useCallback(async () => {
		if (dataLoaded) {
			return;
		}

		const data = await fetchAnalyticsUserProfile();
		setHasMobileAppDownloaded(data.hasMobileAppDownloaded);
		setHasFeastMobileAppDownloaded(data.hasFeastMobileAppDownloaded);
		setDataLoaded(true);
	}, [dataLoaded]);

	useEffect(() => {
		void loadAnalyticsData();
	}, [loadAnalyticsData]);

	return {
		hasMobileAppDownloaded,
		hasFeastMobileAppDownloaded,
		dataLoaded,
		loadAnalyticsData,
	};
};

export default useAnalyticsProfile;
