import { css } from '@emotion/react';
import { between } from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import AppImageGuardianEditions from 'components/svgs/appGuardianEditions';
import AppImageGuardianNews from 'components/svgs/appGuardianNews';
import AppImageFeast from 'components/svgs/appImageFeast';
import {
	androidAppUrl,
	feastAppUrl,
	getDailyEditionUrl,
	getIosAppUrl,
} from 'helpers/urls/externalLinks';

const downloadCopy = css`
	${between.desktop.and.leftCol} {
		max-width: 260px;
		display: block;
	}
`;

export const appDownloadHeader = 'Download the Guardian app';

export function AppDownloadBodyCopy(): JSX.Element {
	return (
		<span css={downloadCopy}>
			Unlock full access to our quality news app today
		</span>
	);
}

export const appDownloadEditionsHeader = 'Download the Guardian Editions app';

export function AppDownloadEditionsBodyCopy(): JSX.Element {
	return (
		<span css={downloadCopy}>
			Unlock full access to our quality news app today
		</span>
	);
}

export const appsDownloadHeader = 'Explore Guardian Apps';

export const appNewsDownloadHeader = 'The Guardian News app';

export function AppNewsDownloadBodyCopy(): JSX.Element {
	return (
		<span css={downloadCopy}>
			Unlock limitless Guardian journalism in our quality news app today.
		</span>
	);
}

export const appFeastDownloadHeader = 'The Guardian Feast app';

export function AppFeastDownloadBodyCopy(): JSX.Element {
	return (
		<span css={downloadCopy}>
			Make a feast out of anything with the Guardian’s new recipe app : Feast.
		</span>
	);
}

/* Data for rendering Download apps */

export type AppDownload = {
	name: string;
	description: string;
	appIcon: JSX.Element;
	playStoreUrl: string;
	getAppStoreUrl: (arg: CountryGroupId) => string;
};

type AppDownloadKey = 'GuardianNews' | 'guardianFeast' | 'guardianEditions';

const downloadApps: Record<AppDownloadKey, AppDownload> = {
	GuardianNews: {
		name: 'The Guardian News app',
		description:
			'Unlock limitless Guardian journalism in our quality news app today.',
		appIcon: <AppImageGuardianNews />,
		playStoreUrl: androidAppUrl,
		getAppStoreUrl: (countryGroupId: CountryGroupId) =>
			getIosAppUrl(countryGroupId),
	},
	guardianFeast: {
		name: 'The Guardian Feast app',
		description:
			'Make a feast out of anything with the Guardian’s new recipe app : Feast.',
		appIcon: <AppImageFeast />,
		playStoreUrl: feastAppUrl,
		getAppStoreUrl: () => feastAppUrl,
	},
	guardianEditions: {
		name: 'The Guardian Editions app',
		description: 'Unlock full access to our quality news app today.',
		appIcon: <AppImageGuardianEditions />,
		playStoreUrl:
			'https://play.google.com/store/apps/details?id=com.guardian.editions&hl=en_GB&gl=US',
		getAppStoreUrl: (countryGroupId: CountryGroupId) =>
			getDailyEditionUrl(countryGroupId),
	},
};

export function getDownloadApps(appKeys: AppDownloadKey[]): AppDownload[] {
	return appKeys.map((appKey) => downloadApps[appKey]);
}
