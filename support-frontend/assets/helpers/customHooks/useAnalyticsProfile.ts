import { useCallback, useEffect, useState } from 'react';
import { fetchAnalyticsUserProfile } from 'helpers/analytics/analyticsUserProfile';

const useAnalyticsProfile = () => {
	const [hasMobileAppDownloaded, setHasMobileAppDownloaded] = useState(false);
	const [hasFeastMobileAppDownloaded, setHasFeastMobileAppDownloaded] =
		useState(false);
	const [audienceMemberships, setAudienceMemberships] = useState<number[]>([]);
	const [dataLoaded, setDataLoaded] = useState(false);

	const loadAnalyticsData = useCallback(async () => {
		if (dataLoaded) {
			return;
		}

		const data = await fetchAnalyticsUserProfile();
		setHasMobileAppDownloaded(data.hasMobileAppDownloaded);
		setHasFeastMobileAppDownloaded(data.hasFeastMobileAppDownloaded);
		setAudienceMemberships(data.audienceMemberships);
		setDataLoaded(true);
	}, [dataLoaded]);

	useEffect(() => {
		void loadAnalyticsData();
	}, [loadAnalyticsData]);

	return {
		hasMobileAppDownloaded,
		hasFeastMobileAppDownloaded,
		audienceMemberships,
		dataLoaded,
		loadAnalyticsData,
	};
};

export default useAnalyticsProfile;
