import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';
import { from, palette, space, textSans } from '@guardian/source-foundations';

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

const defaultOptionGap = space[2];
const fromMobileMediumOptionGap = 10;
const fromTabletOptionGap = space[3];

export const amountsContainer = css`
	display: flex;
	flex-wrap: nowrap;
	gap: ${defaultOptionGap}px;
	width: calc(100% + ${space[4]}px);
	transform: translateX(-${space[2]}px);
	${from.mobileMedium} {
		gap: ${fromMobileMediumOptionGap}px;
		width: 100%;
		transform: none;
	}
	${from.tablet} {
		gap: ${fromTabletOptionGap}px;
	}
`;

export const amountOption = (
	isSelected: boolean,
	numOfOptions: number,
): SerializedStyles => {
	const defaultOptionWidth = `calc(${100 / numOfOptions}% - ${
		(defaultOptionGap * (numOfOptions - 1)) / numOfOptions
	}px)`;
	const fromMobileMediumOptionWidth = `calc(${100 / numOfOptions}% - ${
		(fromMobileMediumOptionGap * (numOfOptions - 1)) / numOfOptions
	}px)`;
	const fromTabletOptionWidth = `calc(${100 / numOfOptions}% - ${
		(fromTabletOptionGap * (numOfOptions - 1)) / numOfOptions
	}px)`;
	return css`
		width: ${defaultOptionWidth};
		${from.mobileMedium} {
			width: ${fromMobileMediumOptionWidth};
		}
		${from.tablet} {
			width: ${fromTabletOptionWidth};
		}
		display: grid;
		text-align: center;
		outline: ${isSelected ? 2 : 1}px solid
			${isSelected ? palette.brand[500] : palette.neutral[60]};
		background-color: ${isSelected ? '#e3f6ff' : palette.neutral[100]};
		border-radius: 10px;
		aspect-ratio: 1 / 1;
		${from.mobileLandscape} {
			aspect-ratio: 1.25 / 1;
		}
		cursor: pointer;
		:hover {
			outline: 2px solid ${palette.brand[500]};
			& span {
				color: ${palette.brand[400]};
			}
			& span[data-amount-action] {
				font-weight: bold;
			}
		}
	`;
};

export const amountOptionValue = (isSelected: boolean): SerializedStyles => css`
	${textSans.xlarge({ fontWeight: 'bold' })};
	line-height: 1;
	${from.tablet} {
		line-height: 1.25;
	}
	color: ${isSelected ? palette.brand[400] : palette.neutral[46]};
	align-self: center;
	${from.mobile} {
		align-self: end;
	}
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
	display: none;
	${from.mobile} {
		display: inline;
	}
`;
