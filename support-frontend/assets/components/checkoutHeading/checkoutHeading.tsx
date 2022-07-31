import { css } from '@emotion/react';
import {
	brand,
	from,
	headline,
	neutral,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import { Column, Columns, Hide } from '@guardian/source-react-components';
import { Container } from 'components/layout/container';
import type { CSSOverridable } from 'helpers/types/cssOverrideable';

const mainStyles = css`
	position: absolute;
	left: 0;
	right: 0;
	color: ${neutral[100]};
`;

const headingContentContainer = css`
	min-height: 480px;
	${from.desktop} {
		min-height: 440px;
	}
	padding-top: ${space[6]}px;
	${textSans.large({ fontWeight: 'bold' })}
`;

const heading = css`
	display: inline-block;
	${headline.medium({ fontWeight: 'bold' })}
	${until.desktop} {
		margin: 0 auto;
	}
	${from.desktop} {
		${headline.large({ fontWeight: 'bold' })}
		margin-bottom: ${space[3]}px;
	}
`;

const headingImage = css`
	height: 140px;
	margin-top: ${space[12]}px;
	margin-left: -${space[9]}px;
`;

export interface CheckoutHeadingProps extends CSSOverridable {
	heading: string;
	children?: React.ReactNode;
	image?: React.ReactNode;
}

export function CheckoutHeading(props: CheckoutHeadingProps): JSX.Element {
	return (
		<div css={mainStyles}>
			<Container
				sideBorders={true}
				borderColor={brand[600]}
				backgroundColor={brand[400]}
			>
				<Columns collapseUntil="desktop">
					<Column width={1 / 3}>
						<div css={headingContentContainer}>
							<h1 css={heading}>{props.heading}</h1>
							<Hide until="desktop">
								{props.children}
								{props.image && (
									<figure css={headingImage}>{props.image}</figure>
								)}
							</Hide>
						</div>
					</Column>
				</Columns>
			</Container>
		</div>
	);
}
