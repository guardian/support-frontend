import { css } from '@emotion/react';
import { neutral } from '@guardian/source/foundations';

export const pageContainer = css`
	display: flex;
	flex-direction: column;
	min-height: 100vh;
`;

export const mainContentStyles = css`
	background-color: ${neutral[93]};
	@supports (display: flex) {
		flex: 1 0 auto;
	}
`;
