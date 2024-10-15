import { css } from '@emotion/react';
import {
	from,
	headlineBold42,
	neutral,
	space,
} from '@guardian/source/foundations';

const headingStyles = css`
	display: none;

	color: ${neutral[100]};
	max-width: 480px;
	${headlineBold42};
	margin-bottom: ${space[3]}px;

	${from.desktop} {
		display: inline-block;
	}
`;

interface LandingHeadingProps {
	heading: string | JSX.Element;
}
export function LandingPageHeading({
	heading,
}: LandingHeadingProps): JSX.Element {
	return <h1 css={headingStyles}>{heading}</h1>;
}
