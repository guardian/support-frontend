import { palette } from '@guardian/source/foundations';

export type CardTheme = {
	titlePillColor: string;
	cardPillColor: string;
	cardBackColor: string;
	benefitIconColor: string;
};

export const defaultCardTheme: CardTheme = {
	titlePillColor: palette.news[400],
	cardPillColor: palette.brand[500],
	cardBackColor: '#F1FBFF',
	benefitIconColor: palette.brand[500],
};
export const redCardTheme: CardTheme = {
	titlePillColor: palette.brand[500],
	cardPillColor: palette.news[400],
	cardBackColor: palette.news[800],
	benefitIconColor: palette.news[400],
};
