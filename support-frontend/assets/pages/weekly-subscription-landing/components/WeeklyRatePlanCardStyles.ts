import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	headlineBold34,
	headlineLight34,
	palette,
	space,
	textSans12,
	textSans15,
} from '@guardian/source/foundations';

export const card = css`
	background-color: ${palette.neutral[100]};
	color: ${palette.neutral[7]};
	padding: ${space[3]}px ${space[4]}px ${space[5]}px;
	border-radius: ${space[2]}px;
	flex: 1;
`;

export const cardHeading = css`
	${headlineBold24};
	margin-bottom: ${space[2]}px;
`;

export const cardPrice = css`
	${headlineBold34};
	margin-top: ${space[2]}px;
	small {
		${textSans15};
	}
`;

export const strikethroughPriceStyle = css`
	${headlineLight34}
	text-decoration-line: line-through;
	text-decoration-thickness: 1px;
	margin-right: ${space[2]}px;
`;

export const savingsTextStyle = css`
	${textSans15};
	margin-top: 2px;
	${from.tablet} {
		min-height: 24px;
	}
`;

export const cardOffer = css`
	${textSans12};
	margin-top: ${space[2]}px;
	color: ${palette.neutral[38]};
	text-align: center;
	${from.tablet} {
		min-height: 20px;
	}
`;

export const ButtonCTA = css`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	margin: ${space[5]}px 0 ${space[2]}px;
`;
