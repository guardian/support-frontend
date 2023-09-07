import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';
import {
	from,
	palette,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';

export const container = (customMargin?: string): SerializedStyles => css`
	background-color: #f0f6fe;
	border-radius: ${space[2]}px;
	padding: ${space[3]}px;
	margin: ${customMargin ?? '0 0'};
`;

export const title = css`
	${textSans.medium({ fontWeight: 'bold' })}
	color: ${palette.neutral[7]};
`;

export const standfirst = css`
	${textSans.xsmall()}
	color: ${palette.neutral[7]};
`;

export const hrCss = css`
	border: none;
	height: 1px;
	background-color: ${palette.neutral[86]};
	margin: ${space[3]}px 0 ${space[2]}px;
`;

export const supportTotalContainer = css`
	display: flex;
	justify-content: space-between;
	${textSans.small()}
`;

export const amountsAndNavigationContainer = css`
	position: relative;
	margin: ${space[6]}px 0 ${space[4]}px;
`;

export const amountsContainer = (
	hasLeftSideOverflow: boolean,
	hasRightSideOverflow: boolean,
): SerializedStyles => css`
	display: flex;
	flex-wrap: nowrap;
	gap: 3%;
	overflow-x: hidden;
	min-height: 20px;
	mask-image: linear-gradient(
		to right,
		rgba(0, 0, 0, ${hasLeftSideOverflow ? '0' : '1'}),
		rgba(0, 0, 0, 1) 15%,
		rgba(0, 0, 0, 1) 85%,
		rgba(0, 0, 0, ${hasRightSideOverflow ? '0' : '1'}) 100%
	);
`;

export const amountOption = (
	optionPercentageWidth: number,
	xOffset: number,
	isSelected: boolean,
): SerializedStyles => css`
	flex-shrink: 0;
	flex-grow: 0;
	flex-basis: ${optionPercentageWidth}%;
	display: grid;
	text-align: center;
	border: ${isSelected ? 2 : 1}px solid
		${isSelected ? palette.brand[500] : palette.neutral[60]};
	background-color: ${isSelected ? '#e3f6ff' : palette.neutral[100]};
	border-radius: 10px;
	aspect-ratio: 1 / 1;
	${from.tablet} {
		aspect-ratio: 1.6 / 1;
	}
	cursor: pointer;
	transition: transform 0.2s ease;
	transform: translateX(${xOffset}%);
	:hover {
		border: 2px solid ${palette.brand[500]};
		& span {
			color: ${palette.brand[400]};
		}
		& span[data-amount-action] {
			font-weight: bold;
		}
	}
`;

export const amountOptionValue = (isSelected: boolean): SerializedStyles => css`
	${textSans.xlarge({ fontWeight: 'bold' })};
	color: ${isSelected ? palette.brand[400] : palette.neutral[46]};
	align-self: end;
	pointer-events: none;
	user-select: none;
`;

export const amountOptionAction = (
	isSelected: boolean,
): SerializedStyles => css`
	${textSans.xxsmall({ fontWeight: isSelected ? 'bold' : 'regular' })};
	${from.mobileMedium} {
		${textSans.xsmall({ fontWeight: isSelected ? 'bold' : 'regular' })};
	}
	color: ${isSelected ? palette.brand[400] : palette.neutral[46]};
	align-self: start;
	pointer-events: none;
	user-select: none;
`;

export const progressBtnLeft = css`
	position: absolute;
	top: 50%;
	left: 0;
	transform: translate(-${space[6] + space[1]}px, -50%);
	background-color: ${palette.neutral[100]};
	${until.tablet} {
		display: none;
	}
`;

export const progressBtnRight = css`
	position: absolute;
	top: 50%;
	right: 0;
	transform: translate(${space[6] + space[1]}px, -50%);
	background-color: ${palette.neutral[100]};
	${until.tablet} {
		display: none;
	}
`;
