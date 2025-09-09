import { css } from '@emotion/react';
import { between } from '@guardian/source/foundations';

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
