import { css } from '@emotion/react';
import {
	from,
	headlineMedium20,
	palette,
	space,
	textSans15,
	textSansBold17,
	until,
} from '@guardian/source/foundations';

export const wrapper = css`
	background-color: ${palette.neutral[100]};
	color: ${palette.neutral[7]};
`;
export const contentBlock = css`
	display: block;
	width: 100%;
`;
export const imageContainer = css`
	display: inline-flex;
	align-items: flex-start;
	width: calc(100% - 30px);
	padding: ${space[4]}px ${space[4]}px 0;
	background-color: ${palette.neutral[97]};

	img {
		width: 100%;
		height: auto;
		margin-left: auto;
		margin-right: auto;
	}

	${until.tablet} {
		box-sizing: border-box;
		width: 100%;
		margin-top: 20px;
		padding: ${space[2]}px ${space[2]}px 0;
	}
`;
export const untilTablet = css`
	${from.tablet} {
		display: none;
	}
`;
export const fromTablet = css`
	${until.tablet} {
		display: none;
	}
`;
export const textBlock = css`
	h3 {
		${headlineMedium20};
		font-weight: bold;
		margin: ${space[2]}px ${space[2]}px 2px;
	}
`;
export const list = css`
	color: ${palette.neutral[7]};
	border-top: 1px solid ${palette.neutral[86]};
	margin: ${space[3]}px;
	padding-top: ${space[3]}px;
	${from.desktop} {
		width: calc(100%-${space[3]}px * 2);
	}

	li {
		margin-bottom: ${space[4]}px;
	}
`;
export const listMain = css`
	${textSansBold17};
	margin-left: ${space[3]}px;
	display: inline-block;
	max-width: 90%;
`;
export const subText = css`
	display: block;
	${textSans15};
	margin-left: ${space[5]}px;
	line-height: 135%;
`;
export const dot = css`
	display: inline-block;
	height: 9px;
	width: 9px;
	border-radius: 50%;
	background-color: ${palette.brand[400]};
	vertical-align: top;
	margin-top: ${space[2]}px;
`;
