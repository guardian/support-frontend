import { css } from '@emotion/react';
import {
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
	textSansBold14,
	textSansBold15,
} from '@guardian/source/foundations';

export const productOption = css`
	${textSans17};
	position: relative;
	display: flex;
	flex-direction: column;

	background-color: ${neutral[100]};
	color: ${neutral[7]};
	padding: ${space[3]}px;
	border-radius: ${space[2]}px;
	${from.tablet} {
		min-width: 338px;
	}
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
	${textSansBold14}
	color: ${palette.neutral[100]};
	background: ${palette.brand[500]};
	border-radius: ${space[1]}px;
	padding: 2.5px ${space[2]}px;
`;

export const productOptionLabelObserver = css`
	background: #963c00;
`;

export const productOptionOfferCopy = css`
	${textSans14};
	color: ${neutral[38]};
	text-align: center;
	${from.tablet} {
		min-height: 20px;
	}
`;

export const productOptionInfo = css`
	${textSans15}
	display: flex;
	align-items: center;
	margin-bottom: ${space[4]}px;
	margin-top: auto;
	position: relative;

	&:before {
		position: absolute;
		content: '';
		width: 12px;
		height: 12px;
		border-radius: 50%;
		left: 6px;
		top: 6px;
		background-color: ${palette.neutral[7]};
	}

	svg {
		flex-shrink: 0;
		margin-right: ${space[1]}px;
		fill: ${palette.brandAlt[400]};
		z-index: 0;
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

export const ButtonCTA = css`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	padding: ${space[2]}px 0;
	margin: ${space[4]}px 0 ${space[1]}px;
`;

export const planDescription = css`
	${textSans15}
	margin: ${space[5]}px 0 ${space[2]}px;
	${from.tablet} {
		display: none;
	}
`;
