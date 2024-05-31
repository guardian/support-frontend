import { css } from '@emotion/react';
import { from, neutral } from '@guardian/source/foundations';

export const mainCss = css`
	max-width: 1120px;
	${from.tablet} {
		display: flex;
		align-items: flex-start;
	}
`;
export const formCss = css`
	flex: 0 0 auto;
	width: 100%;
	${from.tablet} {
		max-width: 490px;
		border-right: 1px solid ${neutral['86']};
	}
	${from.leftCol} {
		max-width: 650px;
	}
`;
export const asideTopCss = css`
	flex-direction: row-reverse;
`;
export const asideBottomCss = css`
	flex-direction: row;
`;
export const stickyCss = css`
	position: sticky;
	top: 0;
`;
export const asideCss = (noBorders: boolean) => css`
	z-index: 99;
	width: 100%;
	border-bottom: ${noBorders ? 'none' : `1px solid ${neutral['86']}`};
	${from.leftCol} {
		border-right: ${noBorders ? 'none' : `1px solid ${neutral['86']}`};
	}
`;
