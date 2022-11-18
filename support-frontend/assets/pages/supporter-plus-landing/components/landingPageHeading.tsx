import { css } from '@emotion/react';
import {
	from,
	headline,
	neutral,
	space,
	until,
} from '@guardian/source-foundations';

const headingStyles = css`
	color: ${neutral[100]};
	display: inline-block;
	${headline.medium({ fontWeight: 'bold' })}
	font-size: 28px;
	max-width: 400px;

	${from.tablet} {
		font-size: 34px;
		max-width: 480px;
	}

	${until.desktop} {
		margin: 0 auto;
		margin-bottom: ${space[5]}px;
	}
	${from.desktop} {
		${headline.large({ fontWeight: 'bold' })}
		margin-bottom: ${space[3]}px;
	}
`;

export function LandingPageHeading(): JSX.Element {
	return (
		<h1 css={headingStyles}>Support&nbsp;fearless, independent journalism</h1>
	);
}
