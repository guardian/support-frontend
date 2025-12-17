import { css } from '@emotion/react';
import { from } from '@guardian/source/dist/foundations';

export const mapPage = css`
	display: flex;
	flex-shrink: 0;
	flex-direction: column;
	height: 100vh;
	box-sizing: content-box;
	* {
		box-sizing: content-box;
	}
	${from.desktop} {
		overflow-x: hidden;
	}
`;
