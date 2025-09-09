import { css } from '@emotion/react';
import { from, titlepiece42 } from '@guardian/source/foundations';

export const tier3LineBreak = css`
	display: none;
	${from.tablet} {
		display: inline-block;
	}
`;

export const weeklyGiftLineBreak = css`
	span {
		display: inline-block;
		${from.desktop} {
			display: inline;
		}
	}
`;

export const headerTitleText = css`
	${titlepiece42};
	font-size: 24px;
	${from.tablet} {
		font-size: 40px;
	}
`;

export const longHeaderTitleText = css`
	${titlepiece42};
	font-size: 24px;
	${from.tablet} {
		font-size: 28px;
	}
`;
