import { type ThemeButton } from '@guardian/source/react-components';

const observerThemeButton: Partial<ThemeButton> = {
	textPrimary: '#FFFFFF',
	backgroundPrimary: '#C85000',
	backgroundPrimaryHover: '#AF4600',
	textTertiary: '#000',
	backgroundTertiary: '#FFF',
	backgroundTertiaryHover: '#E6E6E6',
	borderTertiary: '#000',
} as const;

const observerColours = {
	pageBackgroundColor: '#F6F5F3',
	footerBackgroundColor: '#000000',
	footerHoverColor: '#E6E6E6',
	HighlightTextColor: '#F1C7AA',
};

export { observerThemeButton, observerColours };
