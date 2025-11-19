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
import ObserverQRCode from './qr-codes/ObserverQRCode';

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
	title: string | null;
	description: string;
	appIcon: JSX.Element | null;
	playStoreUrl: string;
	getAppStoreUrl: (arg: CountryGroupId) => string;
	qrCodeImage?: JSX.Element;
};

type AppDownloadKey =
	| 'GuardianNews'
	| 'guardianFeast'
	| 'guardianEditions'
	| 'observer';

const downloadApps: Record<AppDownloadKey, AppDownload> = {
	GuardianNews: {
		title: 'The Guardian News app',
		description:
			'Unlock limitless Guardian journalism in our quality news app today.',
		appIcon: <AppImageGuardianNews />,
		playStoreUrl: androidAppUrl,
		getAppStoreUrl: (countryGroupId: CountryGroupId) =>
			getIosAppUrl(countryGroupId),
	},
	guardianFeast: {
		title: 'The Guardian Feast app',
		description:
			'Make a feast out of anything with the Guardian’s new recipe app : Feast.',
		appIcon: <AppImageFeast />,
		playStoreUrl: feastAppUrl,
		getAppStoreUrl: () => feastAppUrl,
	},
	guardianEditions: {
		title: 'The Guardian Editions app',
		description:
			'Enjoy unlimited access to our full range of e-magazines and paper, available for mobile and tablet.',
		appIcon: <AppImageGuardianEditions />,
		playStoreUrl:
			'https://play.google.com/store/apps/details?id=com.guardian.editions&hl=en_GB&gl=US',
		getAppStoreUrl: (countryGroupId: CountryGroupId) =>
			getDailyEditionUrl(countryGroupId),
	},
	observer: {
		title: null,
		description:
			'download the subscriber-only Observer app and gain instant access to all The Observer articles, podcasts, puzzles and recipes.',
		appIcon: null,
		playStoreUrl: '',
		getAppStoreUrl: () => 'https://apps.apple.com/gb/app/tortoise/id1441428990',
		qrCodeImage: <ObserverQRCode />,
	},
};

export function getDownloadApps(appKeys: AppDownloadKey[]): AppDownload[] {
	return appKeys.map((appKey) => downloadApps[appKey]);
}
