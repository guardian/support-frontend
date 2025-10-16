import { palette } from '@guardian/source/foundations';
import { type ThemeButton } from '@guardian/source/react-components';

export const observerThemeButton: ThemeButton = {
	textPrimary: palette.neutral[100],
	backgroundPrimary: palette.opinion[400],
	textSecondary: palette.brand[400],
	backgroundSecondary: palette.brand[800],
	textTertiary: palette.brand[400],
	backgroundTertiary: 'transparent',
	borderTertiary: palette.brand[400],
	textSubdued: palette.brand[400],
} as const;
