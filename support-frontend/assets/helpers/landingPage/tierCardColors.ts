import { palette } from '@guardian/source/foundations';

export type TierCardColors = {
	titlePillColor: string;
	cardPillColor: string;
	cardBackColor: string;
	benefitIconColor: string;
};

export const regularTierCardColor = {
	titlePillColor: palette.news[400],
	cardPillColor: palette.brand[500],
	cardBackColor: '#F1FBFF',
	benefitIconColor: palette.brand[500],
};
export const regularTierCardColors = [
	regularTierCardColor,
	regularTierCardColor,
	regularTierCardColor,
];
export const highlightTierCardColors = [
	regularTierCardColor,
	{
		titlePillColor: palette.news[400],
		cardPillColor: palette.news[400],
		cardBackColor: palette.news[800],
		benefitIconColor: palette.news[400],
	},
	{ ...regularTierCardColor, titlePillColor: palette.brand[500] },
];
