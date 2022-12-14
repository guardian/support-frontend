import { css } from '@emotion/react';
import { resets } from '@guardian/source-foundations';

export const reset = css`
	${resets.resetCSS}

	button {
		background: transparent;
	}
`;
