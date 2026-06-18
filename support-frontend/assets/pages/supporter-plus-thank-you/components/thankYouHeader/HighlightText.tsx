import { css, useTheme } from '@emotion/react';
import type { ReactNode } from 'react';

const highlightText = css`
	background-color: #ffe500;
	padding: 0 5px;
`;

const observerHighlightColor = css`
	background-color: #f1c7aa;
`;

export default function HighlightText({ children }: { children: ReactNode }) {
	const { observerThemeButton } = useTheme();

	return (
		<span css={[highlightText, observerThemeButton && observerHighlightColor]}>
			{children}
		</span>
	);
}
