import { useEffect, useState } from 'react';
import { fetchJson } from 'helpers/async/fetch';
import * as cookie from 'helpers/storage/cookie';
import { getUser } from 'helpers/user/user';

const useAnalyticsProfile = () => {
	const user = getUser();

	const [hasMobileAppDownloaded, setHasMobileAppDownloaded] = useState(false);
	const [hasFeastMobileAppDownloaded, setHasFeastMobileAppDownloaded] =
		useState(false);

	useEffect(() => {
		const COOKIE_NAME = 'GU_user_analytics_profile';
		const COOKIE_TTL_DAYS = 1;

		const loadAnalyticsData = async () => {
			if (!user.isSignedIn) {
				return;
			}

			const cachedData = cookie.get(COOKIE_NAME);

			if (cachedData) {
				try {
					const parsedData = JSON.parse(cachedData) as {
						hasMobileAppDownloaded?: boolean;
						hasFeastMobileAppDownloaded?: boolean;
					};

					setHasMobileAppDownloaded(parsedData.hasMobileAppDownloaded ?? false);
					setHasFeastMobileAppDownloaded(
						parsedData.hasFeastMobileAppDownloaded ?? false,
					);
					return;
				} catch (error) {
					console.error('Error parsing cached analytics data:', error);
					cookie.set(COOKIE_NAME, '', -1);
				}
			}

			try {
				const response = await fetchJson<{
					identityId: string;
					hasMobileAppDownloaded: boolean;
					hasFeastMobileAppDownloaded: boolean;
				}>('/analytics-user-profile', {
					mode: 'cors',
					credentials: 'include',
				});

				setHasMobileAppDownloaded(response.hasMobileAppDownloaded);
				setHasFeastMobileAppDownloaded(response.hasFeastMobileAppDownloaded);

				const dataToCache = {
					hasMobileAppDownloaded: response.hasMobileAppDownloaded,
					hasFeastMobileAppDownloaded: response.hasFeastMobileAppDownloaded,
					timestamp: Date.now(),
				};

				try {
					const cookieValue = JSON.stringify(dataToCache);
					cookie.set(COOKIE_NAME, cookieValue, COOKIE_TTL_DAYS);
				} catch (cookieError) {
					console.error('Error setting cookie:', cookieError);
				}
			} catch (error) {
				console.error('Error calling Analytics endpoint:', error);
			}
		};

		void loadAnalyticsData();
	}, [user.isSignedIn]);

	return {
		hasMobileAppDownloaded,
		hasFeastMobileAppDownloaded,
	};
};

export default useAnalyticsProfile;
