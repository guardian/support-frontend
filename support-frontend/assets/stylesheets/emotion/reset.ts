import { css } from '@emotion/react';
import { resets } from '@guardian/source/foundations';

export const reset = css`
	${resets.resetCSS}

	-webkit-font-smoothing: antialiased;
	body {
		line-height: 1.5;
	}

	strong {
		font-weight: bolder;
	}

	button {
		background: transparent;
	}
`;
