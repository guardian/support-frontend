import { initCoreWebVitals } from '@guardian/core-web-vitals';
import { getCookie } from '@guardian/libs';
import { getViewId } from '@guardian/ophan-tracker-js';
import { useEffect } from 'react';
import { isProd } from 'helpers/urls/url';

export function WithCoreWebVitals({ children }: { children: React.ReactNode }) {
	useEffect(function initialiseCoreWebVitals() {
		void initCoreWebVitals({
			pageViewId: getViewId(),
			browserId: getCookie({ name: 'bwid', shouldMemoize: true }) ?? undefined,
			isDev: !isProd(),
			team: 'supporterRevenue',
			platform: 'support',
			sampling: 20 / 100,
		});
	}, []);

	return <>{children}</>;
}
