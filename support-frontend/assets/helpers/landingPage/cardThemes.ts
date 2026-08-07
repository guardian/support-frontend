import { palette } from '@guardian/source/foundations';

export type CardTheme = {
	titlePillColor: string;
	cardPillColor: string;
	cardBackColor: string;
	benefitIconColor: string;
};

export type CardThemes = [CardTheme, CardTheme, CardTheme];

export const defaultCardTheme: CardTheme = {
	titlePillColor: palette.news[400],
	cardPillColor: palette.brand[500],
	cardBackColor: '#F1FBFF',
	benefitIconColor: palette.brand[500],
};
export const defaultCardThemes: CardThemes = [
	defaultCardTheme,
	defaultCardTheme,
	defaultCardTheme,
];
export const redCardTheme: CardTheme = {
	titlePillColor: palette.news[400],
	cardPillColor: palette.news[400],
	cardBackColor: palette.news[800],
	benefitIconColor: palette.news[400],
};
export const redCardThemes: CardThemes = [
	redCardTheme,
	defaultCardTheme,
	{ ...defaultCardTheme, titlePillColor: palette.brand[500] },
];
