import { palette } from '@guardian/source/foundations';
import type { ThemeButton } from '@guardian/source/react-components';

export const themeButtonLegacyGray: Partial<ThemeButton> = {
	textPrimary: palette.neutral[100],
	backgroundPrimary: palette.neutral[20],
	textTertiary: palette.neutral[20],
	backgroundTertiary: 'transparent',
	borderTertiary: palette.neutral[20],
} as const;
