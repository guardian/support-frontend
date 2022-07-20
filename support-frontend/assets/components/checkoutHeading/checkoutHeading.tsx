import { css } from '@emotion/react';
import {
	brand,
	from,
	headline,
	neutral,
	space,
	textSans,
} from '@guardian/source-foundations';
import { Container, Hide } from '@guardian/source-react-components';
import type { CSSOverridable } from 'helpers/types/cssOverrideable';

const mainStyles = css`
	width: 100%;
	background-color: ${brand[400]};
	color: ${neutral[100]};
`;

const headingContentContainer = css`
	max-width: 335px;
	min-height: 440px;
	padding-top: ${space[6]}px;
	${textSans.large({ fontWeight: 'bold' })}
`;

const heading = css`
	${headline.medium({ fontWeight: 'bold' })}
	${from.desktop} {
		${headline.large({ fontWeight: 'bold' })}
		margin-bottom: ${space[3]}px;
	}
`;

const headingImage = css`
	height: 140px;
	position: relative;
	margin-top: ${space[12]}px;
	margin-left: -${space[9]}px;

	& img {
		position: absolute;
		right: 0;
	}
`;

export interface CheckoutHeadingProps extends CSSOverridable {
	heading: string;
	children?: React.ReactNode;
	image?: React.ReactNode;
}

export function CheckoutHeading(props: CheckoutHeadingProps): JSX.Element {
	return (
		<div css={mainStyles}>
			<Container sideBorders={true} borderColor={brand[600]}>
				<div css={headingContentContainer}>
					<h1 css={heading}>{props.heading}</h1>
					<Hide until="desktop">
						{props.children}
						{props.image && <figure css={headingImage}>{props.image}</figure>}
					</Hide>
				</div>
			</Container>
		</div>
	);
}
