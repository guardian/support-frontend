import type { SerializedStyles } from '@emotion/core';
import { css } from '@emotion/core';
import {
	brand,
	brandBackground,
	neutral,
} from '@guardian/src-foundations/palette';
import type { ReactNode } from 'react';
import React from 'react';

type Theme = 'light' | 'dark' | 'white' | 'brand';

type PropTypes = {
	cssOverrides?: string;
	children: ReactNode;
	theme?: Theme;
	hasOverlap?: boolean;
};
const containerThemes: Record<Theme, SerializedStyles> = {
	light: css`
		background-color: ${neutral[93]};
		color: ${neutral[7]};
	`,
	dark: css`
		background-color: ${brand[300]};
		color: ${neutral[100]};
	`,
	white: css`
		background-color: ${neutral[100]};
		color: ${neutral[7]};
	`,
	brand: css`
		background-color: ${brandBackground.primary};
		color: ${neutral[100]};
	`,
};
const fullWidthContainer = css`
	position: relative;
	width: 100%;
	display: flex;
`;
// This allows part of the colour of the container to appear to overlap the previous section of the page
const fullWidthContainerOverlap = css`
	:before {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		transform: translateY(-100%);
		height: 88px;
		width: 100%;
		background-color: inherit;
	}
`;

function FullWidthContainer({
	theme,
	hasOverlap,
	cssOverrides,
	children,
}: PropTypes): JSX.Element {
	const themeStyles = containerThemes[theme ?? 'light'];
	return (
		<div
			css={[
				fullWidthContainer,
				themeStyles,
				hasOverlap ? fullWidthContainerOverlap : '',
				cssOverrides,
			]}
		>
			{children}
		</div>
	);
}

FullWidthContainer.defaultProps = {
	cssOverrides: '',
	theme: 'light',
	hasOverlap: false,
};
export default FullWidthContainer;
