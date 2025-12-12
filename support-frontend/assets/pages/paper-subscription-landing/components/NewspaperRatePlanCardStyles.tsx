import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	headlineBold34,
	neutral,
	palette,
	space,
	textSans12,
	textSans14,
	textSans15,
	textSans17,
	textSansBold14,
	textSansBold15,
} from '@guardian/source/foundations';

export const card = css`
	${textSans17};
	position: relative;
	display: flex;
	flex-direction: column;

	background-color: ${neutral[100]};
	color: ${neutral[7]};
	padding: ${space[3]}px ${space[4]}px;
	border-radius: ${space[2]}px;
	${from.tablet} {
		min-width: 338px;
	}
`;

export const cardWithLabel = css`
	border-top-left-radius: 0;
`;

export const cardHeader = css`
	padding-bottom: ${space[2]}px;
`;

export const cardHeading = css`
	${headlineBold24};
	margin-bottom: ${space[1]}px;
`;

export const badge = css`
	display: block;
	width: max-content;
	${textSansBold14}
	color: ${palette.neutral[100]};
	background: ${palette.brand[500]};
	border-radius: ${space[1]}px;
	padding: 2.5px ${space[2]}px;
`;

export const badgeObserver = css`
	background: #963c00;
`;

export const cardOffer = css`
	${textSans14};
	color: ${neutral[38]};
	text-align: center;
	${from.tablet} {
		min-height: 20px;
	}
`;

export const cardInfo = css`
	${textSans15}
	display: flex;
	align-items: center;
	margin-bottom: ${space[1]}px;
	margin-top: auto;
	position: relative;
	padding-top: ${space[3]}px;

	${from.tablet} {
		padding-top: ${space[12]}px;
	}

	&:before {
		position: absolute;
		content: '';
		width: 8px;
		height: 8px;
		border-radius: 50%;
		left: 6px;
		bottom: 6px;
		background-color: ${palette.neutral[7]};
	}

	svg {
		flex-shrink: 0;
		margin-right: ${space[1]}px;
		fill: ${palette.brandAlt[400]};
		z-index: 0;
	}
`;

export const cardLegalCopy = css`
	${textSans12};
	text-align: left;
	margin-top: ${space[2]}px;
`;

export const cardPrice = css`
	${headlineBold34};
	small {
		${textSans15};
	}
`;

export const cardLabel = css`
	background-color: #c1d8fc;
	color: ${neutral[7]};
	position: absolute;
	left: 0;
	top: 0;
	transform: translateY(-100%);
	text-align: center;
	padding: ${space[1]}px ${space[2]}px;
	${textSansBold15};
	border-top-left-radius: ${space[1]}px;
	border-top-right-radius: ${space[1]}px;
`;

export const ButtonCTA = css`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	margin: ${space[5]}px 0 ${space[2]}px;
`;

export const planDescription = css`
	${textSans15}
	margin: ${space[5]}px 0 ${space[2]}px;
	${from.tablet} {
		display: none;
	}
`;

export const sectionMarginZero = css`
	> section {
		margin-bottom: 0;
	}
`;

export const planDetailsContainer = css`
	height: 100%;
	display: flex;
	flex-direction: column;
`;

export const planDetailsEndSection = css`
	margin-top: auto;
`;
