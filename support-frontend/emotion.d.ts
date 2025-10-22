// src/emotion.d.ts
import '@emotion/react';
import { type ThemeButton } from '@guardian/source/react-components';

declare module '@emotion/react' {
	export interface Theme {
		observerThemeButton?: ThemeButton;
	}
}
