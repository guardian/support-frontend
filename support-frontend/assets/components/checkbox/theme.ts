import { palette } from '@guardian/source/foundations';
import type {
	ThemeLabel,
	ThemeUserFeedback,
} from '@guardian/source/react-components';
import {
	labelThemeBrand,
	labelThemeDefault,
	themeLabel,
	themeLabelBrand,
} from '@guardian/source/react-components';
import type { Theme } from './Checkbox';

export type ThemeCheckbox = {
	borderUnselected: string;
	borderHover: string;
	borderSelected: string;
	borderError: string;
	fillSelected: string;
	fillUnselected: string;
	textLabel: string;
	textSupporting: string;
	textIndeterminate: string;
};

export type ThemeCheckboxGroup = ThemeLabel & ThemeUserFeedback;

export const themeCheckbox: ThemeCheckbox = {
	borderUnselected: palette.neutral[46],
	borderHover: palette.brand[500],
	borderSelected: palette.brand[500],
	borderError: palette.error[400],
	fillSelected: palette.brand[500],
	fillUnselected: 'transparent',
	textLabel: palette.neutral[7],
	textSupporting: palette.neutral[46],
	textIndeterminate: palette.neutral[46],
} as const;

export const themeCheckboxGroup: ThemeCheckboxGroup = {
	...themeLabel,
} as const;

export const themeCheckboxBrand: ThemeCheckbox = {
	borderUnselected: palette.brand[800],
	borderSelected: palette.neutral[100],
	borderHover: palette.neutral[100],
	borderError: palette.error[500],
	fillSelected: palette.neutral[100],
	fillUnselected: 'transparent',
	textLabel: palette.neutral[100],
	textSupporting: palette.brand[800],
	textIndeterminate: palette.brand[800],
} as const;

export const themeCheckboxGroupBrand: ThemeCheckboxGroup = {
	...themeLabelBrand,
} as const;

const userFeedbackThemeBrand = {
	userFeedback: {
		textSuccess: palette.success[500],
		textError: palette.error[500],
	},
};

const userFeedbackThemeDefault = {
	userFeedback: {
		textSuccess: palette.success[400],
		textError: palette.error[400],
	},
};

/** @deprecated Use `themeCheckbox` and component `theme` prop instead of emotion's `ThemeProvider` */
export const checkboxThemeDefault = {
	checkbox: {
		border: palette.neutral[46],
		borderHover: palette.brand[500],
		borderChecked: palette.brand[500],
		borderError: palette.error[400],
		backgroundChecked: palette.brand[500],
		textLabel: palette.neutral[7],
		textLabelSupporting: palette.neutral[46],
		textIndeterminate: palette.neutral[46],
	},
	...userFeedbackThemeDefault,
	...labelThemeDefault,
};
/** @deprecated Use `themeCheckboxBrand` and component `theme` prop instead of emotion's `ThemeProvider` */
export const checkboxThemeBrand = {
	checkbox: {
		border: palette.brand[800],
		borderHover: palette.neutral[100],
		borderChecked: palette.neutral[100],
		borderError: palette.error[500],
		backgroundChecked: palette.neutral[100],
		textLabel: palette.neutral[100],
		textLabelSupporting: palette.brand[800],
		textIndeterminate: palette.brand[800],
	},
	...userFeedbackThemeBrand,
	...labelThemeBrand,
};

export const transformProviderTheme = (
	providerTheme: Theme['checkbox'],
): Partial<ThemeCheckbox> => {
	const transformedTheme: Partial<ThemeCheckbox> = {};

	if (providerTheme?.backgroundChecked) {
		transformedTheme.fillSelected = providerTheme.backgroundChecked;
	}
	if (providerTheme?.borderChecked) {
		transformedTheme.borderSelected = providerTheme.borderChecked;
	}
	if (providerTheme?.border) {
		transformedTheme.borderUnselected = providerTheme.border;
	}
	if (providerTheme?.textLabelSupporting) {
		transformedTheme.textSupporting = providerTheme.textLabelSupporting;
	}
	return { ...transformedTheme, ...providerTheme };
};
