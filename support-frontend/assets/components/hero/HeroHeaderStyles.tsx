// ----- Imports ----- //
import { css } from '@emotion/react';
import {
	article17,
	from,
	headlineBold28,
	headlineBold34,
	palette,
	space,
	textSansBold17,
} from '@guardian/source/foundations';

export const roundelStyles = css`
	${textSansBold17}
`;
export const heroCssOverrides = css`
	background-color: ${palette.neutral[100]};
	color: ${palette.neutral[7]};
	flex-direction: column-reverse;
`;

export const heroCopy = css`
	padding: ${space[1]}px ${space[5]}px ${space[10]}px;
`;

export const heroTitle = css`
	${headlineBold28};
	margin-bottom: ${space[3]}px;

	${from.desktop} {
		${headlineBold34};
	}
`;

export const heroParagraph = css`
	${article17};
	line-height: 1.4;
	margin-bottom: ${space[6]}px;
	max-width: 550px;

	/* apply the same margin to paragraphs parsed from markdown from promo codes */
	& p:not(:last-of-type) {
		margin-bottom: ${space[9]}px;
	}

	${from.desktop} {
		margin-bottom: ${space[9]}px;
	}
`;
