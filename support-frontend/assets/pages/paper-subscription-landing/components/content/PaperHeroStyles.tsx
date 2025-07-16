import { css } from '@emotion/react';
import {
	from,
	headlineBold34,
	headlineBold42,
	space,
	textEgyptian17,
	until,
} from '@guardian/source/foundations';

export const heroCopy = css`
	padding: 0 ${space[3]}px ${space[3]}px;
	${from.tablet} {
		padding-bottom: ${space[9]}px;
	}
	${from.desktop} {
		padding-bottom: ${space[24]}px;
	}
`;
export const heroTitle = css`
	${headlineBold34};
	margin-bottom: ${space[3]}px;

	${from.tablet} {
		${headlineBold42};
	}
`;
export const heroParagraph = css`
	${textEgyptian17};
	line-height: 1.4;
	margin-bottom: ${space[6]}px;

	/* apply the same margin to paragraphs parsed from markdown from promo codes */
	& p:not(:last-of-type) {
		margin-bottom: ${space[9]}px;
	}

	${from.desktop} {
		max-width: 75%;
		margin-bottom: ${space[9]}px;
	}
`;
export const desktopToWideLineBreak = css`
	${until.desktop} {
		display: none;
	}
	${from.wide} {
		display: none;
	}
`;
