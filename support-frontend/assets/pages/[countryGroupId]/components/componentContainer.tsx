import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';
import type { ReactNode } from 'react';
import { Container } from 'components/layout/container';

const headingContentContainer = css`
	${from.tablet} {
		min-height: 450px;
	}
`;

const container = css`
	> div {
		min-height: 480px;
		${from.tablet} {
			min-height: 432px;
		}
		padding: ${space[5]}px 10px;
		${from.mobileLandscape} {
			padding-left: ${space[5]}px;
			padding-right: ${space[5]}px;
		}
		${from.desktop} {
			max-width: 940px;
		}
	}
`;

export type ComponentContainerProps = {
	children: ReactNode;
	borderColor?: string;
	sideBorders?: boolean;
	topBorder?: boolean;
	cssOverrides?: SerializedStyles;
};

export function ComponentContainer({
	children,
	borderColor,
	sideBorders,
	topBorder,
	cssOverrides,
}: ComponentContainerProps): JSX.Element {
	const cssContainerAndOverride = css([cssOverrides, container]);
	return (
		<Container
			sideBorders={!!sideBorders}
			topBorder={!!topBorder}
			borderColor={borderColor}
			cssOverrides={cssContainerAndOverride}
		>
			<div css={headingContentContainer}>{children}</div>
		</Container>
	);
}
