import { css } from '@emotion/react';
import { palette, space, textSans } from '@guardian/source-foundations';

export const tickerProgressBar = css`
	position: relative;
	height: ${space[3]}px;
`;

export const tickerProgressBarBackground = css`
	width: calc(100%);
	height: ${space[3]}px;
	overflow: hidden;
	background-color: #d9d9d9;
	position: absolute;
	border-radius: ${space[2]}px;
`;

export const tickerProgressBarFill = css`
	background-color: ${palette.neutral[0]};
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	transform: translateX(-100%);
	transition: transform 3s cubic-bezier(0.25, 0.55, 0.2, 0.85);
`;

export const tickerHeadline = css`
	${textSans.medium({ fontWeight: 'bold' })}
	margin-bottom: ${space[2]}px;
`;

export const tickerLabelContainer = css`
	position: relative;
	display: flex;
	margin-top: ${space[1]}px;
`;

export const tickerLabel = css`
	${textSans.medium()}
`;

export const tickerLabelTotal = css`
	font-weight: 700;
`;
