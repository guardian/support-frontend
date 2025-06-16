import { css } from '@emotion/react';
import {
	between,
	brandAlt,
	from,
	headlineBold24,
	headlineBold34,
	neutral,
	palette,
	space,
	textSans14,
	textSans15,
	textSans17,
	textSansBold12,
	textSansBold14,
	textSansBold15,
	until,
} from '@guardian/source/foundations';

export const productOption = css`
	${textSans17};
	position: relative;

	background-color: ${neutral[100]};
	color: ${neutral[7]};
	padding: ${space[3]}px;
	border-radius: ${space[2]}px;
`;

export const productCardWithLabel = css`
	border-top-left-radius: 0;
`;

export const specialOfferOption = css`
	background-color: #fffdeb;
	border: 5px solid ${brandAlt[400]};
	/* Reduce top and bottom padding to account for the border */
	padding: 7px ${space[3]}px;
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
	${textSansBold12}
	color: ${palette.neutral[100]};
	background: ${palette.brand[500]};
	border-radius: ${space[1]}px;
	padding: 2.5px ${space[2]}px;
	${until.mobileMedium} {
		max-width: 98px;
	}
	${between.leftCol.and.wide} {
		max-width: 112px;
	}
	${from.leftCol} {
		${textSansBold14}
	}
`;

export const productOptionLabelObserver = css`
	background: #963c00;
`;

export const productOptionOfferCopy = css`
	${textSans14};
	color: ${neutral[38]};
	text-align: center;
	${from.tablet} {
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
	position: absolute;
	bottom: ${space[5]}px;
	${textSans15}
	display: flex;
	align-items: flex-start;
	svg {
		flex-shrink: 0;
		margin-right: ${space[1]}px;
		fill: ${palette.brandAlt[400]};
	}
`;

export const productOptionPrice = css`
	${headlineBold34};

	small {
		${textSans15};
	}
`;

export const productOptionHighlight = css`
	background-color: #c1d8fc;
	color: ${neutral[7]};
	position: absolute;
	left: 0;
	top: 1px;
	transform: translateY(-100%);
	text-align: center;
	padding: ${space[1]}px ${space[2]}px;
	${textSansBold15};
	border-top-left-radius: ${space[2]}px;
	border-top-right-radius: ${space[2]}px;
`;

export const buttonDiv = css`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	grid-area: button;
	padding: ${space[3]}px 0;
	margin-top: ${space[5]}px;

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

export const planDescription = css`
	${textSans15}
	margin: ${space[5]}px 0 ${space[4]}px;
	${from.tablet} {
		display: none;
	}
`;
