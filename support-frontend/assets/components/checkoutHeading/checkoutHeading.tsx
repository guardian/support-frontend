import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import {
	from,
	neutral,
	palette,
	space,
	textSansBold20,
} from '@guardian/source/foundations';
import { Column, Columns, Hide } from '@guardian/source/react-components';
import { Container } from 'components/layout/container';
import type { CSSOverridable } from 'helpers/types/cssOverrideable';

const mainStyles = css`
	position: absolute;
	left: 0;
	right: 0;
	color: ${neutral[100]};
`;

const headingContentContainer = css`
	height: 480px;
	${from.tablet} {
		height: 432px;
	}
	padding-top: ${space[6]}px;
	${textSansBold20}
`;

export interface CheckoutHeadingProps extends CSSOverridable {
	children?: React.ReactNode;
	image?: React.ReactNode;
	withTopBorder?: boolean;
	withSideBorders?: boolean;
	cssOverrides?: SerializedStyles;
}

export function CheckoutHeading({
	children,
	image,
	withTopBorder = true,
	withSideBorders = true,
	cssOverrides,
}: CheckoutHeadingProps): JSX.Element {
	return (
		<div css={mainStyles}>
			<Container
				sideBorders={withSideBorders}
				topBorder={withTopBorder}
				borderColor={palette.brand[600]}
				backgroundColor={palette.brand[400]}
			>
				<Columns collapseUntil="desktop">
					<Column span={[1, 2, 5]}>
						<div css={[cssOverrides, headingContentContainer]}>
							<Hide until="desktop">
								{children}
								{image}
							</Hide>
						</div>
					</Column>
				</Columns>
			</Container>
		</div>
	);
}
