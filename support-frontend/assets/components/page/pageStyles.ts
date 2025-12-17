import { css } from '@emotion/react';
import { neutral } from '@guardian/source/foundations';

export const mainContentStyles = css`
	background-color: ${neutral[93]};
	@supports (display: flex) {
		flex: 1 0 auto;
	}
`;
