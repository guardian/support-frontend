import { css } from '@emotion/react';
import { from, space, until } from '@guardian/source/foundations';

export const mobileMenuContainer = css`
	display: none;
	${until.tablet} {
		display: block;
	}

	> button {
		margin-left: 5px;
		margin-top: 22px;
		${from.mobileLandscape} {
			margin-top: 28px;
		}
		${from.tablet} {
			margin-top: ${space[10]}px;
		}
	}
`;
