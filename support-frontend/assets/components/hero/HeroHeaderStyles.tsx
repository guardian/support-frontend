// ----- Imports ----- //
import { css } from '@emotion/react';
import {
	article17,
	from,
	headlineBold28,
	headlineLight24,
	palette,
	space,
	until,
} from '@guardian/source/foundations';

export const printHeroCssOverrides = css`
	background-color: ${palette.neutral[97]};
	color: ${palette.neutral[7]};
	flex-direction: column-reverse;
	& div:nth-child(2) {
		${until.tablet} {
			background: linear-gradient(
				${palette.neutral[97]},
				${palette.neutral[86]}
			);
		}
	}
`;

export const heroCopy = css`
	padding: ${space[3]}px ${space[5]}px ${space[10]}px;
`;

export const heroTitle = (skipMargin: boolean = false) => css`
	${headlineBold28};
	margin-bottom: ${skipMargin ? 0 : space[3]}px;
`;

export const heroSubTitle = css`
	${headlineLight24};
	margin-bottom: ${space[3]}px;
`;

export const heroParagraph = css`
	${article17};
	line-height: 1.4;
	margin-bottom: ${space[6]}px;

	/* apply the same margin to paragraphs parsed from markdown from promo codes */
	& p:not(:last-of-type) {
		margin-bottom: ${space[9]}px;
	}

	${from.desktop} {
		max-width: min(550px, 75%);
		margin-bottom: ${space[9]}px;
	}
`;
