import { css } from '@emotion/react';
import { between } from '@guardian/source-foundations';

const downloadCopy = css`
	${between.desktop.and.leftCol} {
		max-width: 260px;
		display: block;
	}
`;

export const appDownloadHeader = 'Download the Guardian app';

export const appDownloadBodyCopy = (
	<span css={downloadCopy}>
		Unlock full access to our quality news app today
	</span>
);
