import { css } from '@emotion/react';
import {
	brand,
	from,
	neutral,
	space,
	textSans,
} from '@guardian/source-foundations';
import { Column, Columns, Hide } from '@guardian/source-react-components';
import { Container } from 'components/layout/container';
import type { CSSOverridable } from 'helpers/types/cssOverrideable';

const mainStyles = css`
	left: 0;
	right: 0;
	color: ${neutral[100]};
	${from.desktop} {
		position: absolute;
	}
`;

const headingContainerStyle = css`
	> div {
		${from.tablet} {
			min-height: 430px;
		}
	}
`;

const headingContainerContent = css`
	padding-top: ${space[2]}px;
	${textSans.large({ fontWeight: 'bold' })}
	${from.tablet} {
		margin: auto;
		max-width: 456px;
	}
	${from.desktop} {
		padding-top: ${space[6]}px;
		max-width: 100%;
	}
`;

export interface CheckoutHeadingProps extends CSSOverridable {
	heading?: React.ReactNode;
	children?: React.ReactNode;
	image?: React.ReactNode;
	withTopborder?: true;
}

export function CheckoutHeading(props: CheckoutHeadingProps): JSX.Element {
	return (
		<div css={mainStyles}>
			<Container
				sideBorders={true}
				topBorder={props.withTopborder}
				borderColor={brand[600]}
				backgroundColor={brand[400]}
				cssOverrides={headingContainerStyle}
			>
				<Columns collapseUntil="desktop">
					<Column span={[1, 2, 5]}>
						<div css={headingContainerContent}>
							{props.heading}
							<Hide until="desktop">
								{props.children}
								{props.image}
							</Hide>
						</div>
					</Column>
				</Columns>
			</Container>
		</div>
	);
}
