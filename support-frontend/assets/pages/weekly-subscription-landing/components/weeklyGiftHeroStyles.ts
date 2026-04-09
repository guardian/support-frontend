import { css } from '@emotion/react';
import {
	from,
	headlineBold28,
	headlineBold42,
	palette,
	space,
	textEgyptian17,
} from '@guardian/source/foundations';
import { guardianWeeklyHeroBlue } from 'stylesheets/emotion/colours';

export const weeklyGiftHeroCopy = css`
	padding: 0 ${space[3]}px ${space[3]}px;
	color: ${palette.neutral[7]};
`;
export const weeklyGiftHeroTitle = css`
	${headlineBold28};
	margin-bottom: ${space[3]}px;
	${from.mobileLandscape} {
		width: 75%;
	}
	${from.tablet} {
		${headlineBold42};
		width: 100%;
	}
`;
export const weeklyGiftHeroParagraph = css`
	${textEgyptian17};
	margin-bottom: ${space[9]}px;
	/* apply the same margin to paragraphs parsed from markdown from promo codes */
	& p:not(:last-of-type) {
		margin-bottom: ${space[9]}px;
	}
`;

export const linkButtonColour = css`
	color: ${palette.neutral[7]};
`;
export const containerHero = css`
	background-color: ${guardianWeeklyHeroBlue};
	margin-bottom: 0px;
`;
