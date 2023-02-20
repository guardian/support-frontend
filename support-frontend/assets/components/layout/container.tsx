import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { from, neutral } from '@guardian/source-foundations';
import { Container as SourceContainer } from '@guardian/source-react-components';
import type { HTMLAttributes } from 'react';
import React from 'react';

type ContainerElement =
	| 'div'
	| 'article'
	| 'aside'
	| 'footer'
	| 'header'
	| 'nav'
	| 'section';

interface ContainerProps extends HTMLAttributes<HTMLElement> {
	children: React.ReactNode;
	element?: ContainerElement;
	sidePadding?: boolean;
	topBorder?: boolean;
	sideBorders?: boolean;
	borderColor?: string;
	backgroundColor?: string;
	cssOverrides?: SerializedStyles;
}

const sidePaddingStyles = css`
	> div {
		padding-left: 10px;
		padding-right: 10px;
		${from.mobileLandscape} {
			padding-left: 20px;
			padding-right: 20px;
		}
	}
`;

const noPaddingStyles = css`
	> div {
		padding: 0;
	}
`;

const sideBorderStyles = (color: string = neutral[86]) => css`
	> div {
		${from.tablet} {
			border-left: 1px solid ${color};
			border-right: 1px solid ${color};
		}
	}
`;

const topBorderStyles = (color: string = neutral[86]) => css`
	> div {
		${from.tablet} {
			border-top: 1px solid ${color};
		}
	}
`;

export function Container({
	children,
	element,
	sidePadding = true,
	topBorder,
	sideBorders,
	borderColor = neutral[86],
	backgroundColor,
	cssOverrides = css``,
	...props
}: ContainerProps): JSX.Element {
	return (
		<SourceContainer
			element={element}
			topBorder={topBorder}
			borderColor={borderColor}
			backgroundColor={backgroundColor}
			cssOverrides={[
				sidePadding ? sidePaddingStyles : noPaddingStyles,
				sideBorders ? sideBorderStyles(borderColor) : css``,
				topBorder ? topBorderStyles(borderColor) : css``,
				cssOverrides,
			]}
			{...props}
		>
			{children}
		</SourceContainer>
	);
}
