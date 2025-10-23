import { css } from '@emotion/react';
import { from } from '@guardian/source/foundations';

export const weeklyPackShotContainer = css`
	width: 100%;

	${from.tablet} {
		position: absolute;
		bottom: 0;
	}

	img {
		width: 100%;
		vertical-align: bottom;
	}
`;
