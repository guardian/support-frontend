import { css } from '@emotion/react';
import { from, headline, neutral, space } from '@guardian/source-foundations';

const headingStyles = css`
	color: ${neutral[100]};
	display: none;

	${from.desktop} {
		display: inline-block;
		${headline.large({ fontWeight: 'bold' })}
		margin-bottom: ${space[3]}px;
	}
`;

type Props = { heading?: string | JSX.Element };
export function LandingPageHeading({
	heading = 'Support fearless, independent journalism',
}: Props): JSX.Element {
	return <h1 css={headingStyles}>{heading}</h1>;
}
