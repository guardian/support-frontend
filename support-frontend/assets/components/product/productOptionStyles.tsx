import { css } from '@emotion/react';
import {
	between,
	brandAlt,
	from,
	headlineBold20,
	headlineBold24,
	headlineBold28,
	headlineBold42,
	neutral,
	palette,
	size,
	space,
	textSans14,
	textSans15,
	textSans17,
	textSansBold12,
	textSansBold14,
	until,
} from '@guardian/source/foundations';

export const productOption = css`
	${textSans17};
	position: relative;
	display: grid;
	grid-template-columns: 2fr 1fr;
	grid-template-rows: min-content 1fr min-content;
	grid-template-areas:
		'. priceCopy'
		'. priceCopy'
		'button button';
	width: 100%;
	background-color: ${neutral[100]};
	color: ${neutral[7]};
	padding: ${space[3]}px;
	${from.leftCol} {
		min-height: 272px;
		width: 300px;
		grid-template-columns: none;
		grid-template-rows: 48px minmax(66px, max-content) minmax(100px, 1fr) 72px;
		grid-template-areas: none;
	}
`;

export const productOptionWithLabel = css`
	${from.leftCol} {
		grid-template-rows: 100px minmax(66px, max-content) minmax(100px, 1fr) 72px;
	}
`;

export const specialOfferOption = css`
	background-color: #fffdeb;
	border: 5px solid ${brandAlt[400]};
	/* Reduce top and bottom padding to account for the border */
	padding: 7px ${space[3]}px;
`;

export const productOptionUnderline = css`
	${from.leftCol} {
		border-bottom: 1px solid ${neutral[86]};
	}
`;

export const productOptionVerticalLine = css`
	${until.leftCol} {
		border-right: 1px solid ${neutral[86]};
		margin-right: ${space[3]}px;
		padding-right: ${space[3]}px;
	}
`;

export const productOptionTitle = css`
	padding-bottom: ${space[2]}px;
`;

export const productOptionTitleHeading = css`
	${headlineBold24};
	margin-bottom: ${space[1]}px;
`;

export const productOptionLabel = css`
	display: block;
	width: max-content;
	max-width: 120px;
	${textSansBold12}
	color: ${palette.neutral[100]};
	background: ${palette.brand[500]};
	border-radius: ${space[2]}px;
	padding: ${space[1]}px ${space[3]}px;
	${between.mobileMedium.and.leftCol} {
		max-width: unset;
	}
	${from.leftCol} {
		${textSansBold14}
	}
`;

export const productOptionLabelObserver = css`
	background: #963c00;
`;

export const productOptionOfferCopy = css`
	${textSans17};
	${from.tablet} {
		height: 100%;
		padding-bottom: ${space[2]}px;
	}
	${between.tablet.and.leftCol} {
		${textSans15};
	}
	${from.leftCol} {
		margin-top: ${space[1]}px;
	}
`;

export const productOptionInfo = css`
	display: flex;
	flex: 0 1 auto;
	svg {
		fill: ${palette.brand[500]};
		min-height: ${size.xsmall}px;
		min-width: ${size.xsmall}px;
		height: ${size.xsmall}px;
		width: ${size.xsmall}px;
	}
	p {
		margin-left: 4px;
	}
`;

export const productOptionPrice = css`
	display: block;
	padding-bottom: ${space[5]}px;
	${headlineBold24};
	${between.tablet.and.leftCol} {
		${headlineBold28};
	}
	${from.leftCol} {
		${headlineBold42};
		padding-bottom: 0;
	}
`;

export const productOptionPriceCopy = css`
	${textSans14};
	margin-top: ${space[1]}px;
	${from.tablet} {
		height: 100%;
		margin-bottom: ${space[4]}px;
	}
	${from.leftCol} {
		${textSans17};
	}
`;

export const productOptionHighlight = css`
	background-color: ${brandAlt[400]};
	color: ${neutral[7]};
	position: absolute;
	left: 0;
	top: 1px;
	transform: translateY(-100%);
	text-align: center;
	padding: ${space[2]}px ${space[3]}px;
	${headlineBold20};
`;

export const specialOfferHighlight = css`
	width: calc(100% + 10px);
	top: 0;
	left: -5px;
`;

export const buttonDiv = css`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	grid-area: button;
	padding: ${space[3]}px 0;

	${from.leftCol} {
		grid-area: auto;
		padding: 0;
	}
`;

export const button = css`
	display: flex;
	justify-content: center;
	${from.mobileLandscape} {
		grid-area: priceCopy;
		display: inline-flex;
	}
	${from.tablet} {
		grid-area: auto;
		display: inline-flex;
	}
`;

export const priceCopyGridPlacement = css`
	${until.leftCol} {
		grid-area: priceCopy;
	}
`;
