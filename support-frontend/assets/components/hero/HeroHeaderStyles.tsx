// ----- Imports ----- //
import { css } from '@emotion/react';
import {
	article17,
	from,
	headlineBold28,
	headlineBold34,
	palette,
	space,
	until,
} from '@guardian/source/foundations';

export const printHeroCssOverrides = css`
	background-color: ${palette.neutral[100]};
	color: ${palette.neutral[7]};
	flex-direction: column-reverse;
`;

export const weeklyDigitalHeroCssOverrides = css`
	background-color: ${palette.neutral[97]};
	color: ${palette.neutral[7]};
	flex-direction: column-reverse;
	& div:nth-child(2) {
		align-self: center;
		${until.tablet} {
			background: linear-gradient(
				${palette.neutral[97]},
				${palette.neutral[86]}
			);
		}
		${from.desktop} {
			width: 50%;
		}
	}
`;

export const weeklyDigitalContainerCssOverrides = css`
	${until.tablet} {
		section {
			padding: ${space[3]}px ${space[3]}px ${space[6]}px;
		}
		a {
			width: 100%;
		}
	}

	${from.desktop} {
		width: calc(100% - 64px);

		h1 {
			padding-left: 0px;
		}
	}
`;

export const heroCopy = css`
	padding: ${space[1]}px ${space[5]}px ${space[10]}px;
	/* TODO : padding: ${space[3]}px ${space[5]}px ${space[10]}px; */
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

	/* apply the same margin to paragraphs parsed from markdown from promo codes */
	& p:not(:last-of-type) {
		margin-bottom: ${space[9]}px;
	}

	${from.desktop} {
		max-width: min(550px, 75%);
		margin-bottom: ${space[9]}px;
	}
`;
