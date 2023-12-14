import { css } from '@emotion/react';
import { from, headline, neutral, space } from '@guardian/source-foundations';

const headingStyles = css`
	display: none;

	color: ${neutral[100]};
	max-width: 480px;
	${headline.large({ fontWeight: 'bold' })}
	margin-bottom: ${space[3]}px;

	${from.desktop} {
		display: inline-block;
	}
`;

type Props = { heading?: string | JSX.Element };
export function LandingPageHeading({ heading = '' }: Props): JSX.Element {
	return <h1 css={headingStyles}>{heading}</h1>;
}
