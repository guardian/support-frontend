import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';
import type { ReactNode } from 'react';
import { Container } from 'components/layout/container';

const container = css`
	> div {
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

export type GuardianLightContainerProps = {
	children: ReactNode;
	borderColor?: string;
	sideBorders?: boolean;
	topBorder?: boolean;
	cssOverrides?: SerializedStyles;
};

export function GuardianLightContainer({
	children,
	borderColor,
	sideBorders,
	topBorder,
	cssOverrides,
}: GuardianLightContainerProps): JSX.Element {
	const cssContainerAndOverride = css([cssOverrides, container]);
	return (
		<Container
			sideBorders={!!sideBorders}
			topBorder={!!topBorder}
			borderColor={borderColor}
			cssOverrides={cssContainerAndOverride}
		>
			{children}
		</Container>
	);
}
