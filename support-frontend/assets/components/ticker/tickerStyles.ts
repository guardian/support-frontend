import { css } from '@emotion/react';
import { palette, space } from '@guardian/source-foundations';

export const tickerProgressBar = css`
	position: relative;
`;

export const tickerProgressBarBackground = css`
	width: calc(100%);
	height: ${space[3]}px;
	overflow: hidden;
	background-color: #d9d9d9;
	position: absolute;
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

export const tickerCount = css`
	font-weight: bold;
`;

export const tickerLabelContainer = css`
	position: relative;
	display: flex;
	justify-content: space-between;
	margin-bottom: ${space[1]}px;
`;

export const tickerLabel = css`
	display: flex;
	flex-wrap: wrap;
	max-width: 40%;
`;

export const tickerGoal = css`
	justify-content: flex-end;
	margin-right: -10%;
`;

export const tickerGoalPosition = css`
	display: flex;
	justify-content: flex-end;
	position: absolute;
	right: 0;
	width: 100%;
`;

export const tickerStatus = css`
	justify-content: flex-start;
`;

export const tickerMarker = css`
	border-right: 2px solid ${palette.neutral[7]};
	content: ' ';
	display: block;
	height: ${space[4]}px;
`;
