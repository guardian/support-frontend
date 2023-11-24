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

type Props = { heading?: string | JSX.Element };
export function LandingPageHeading({
	heading = 'Support fearless, independent journalism',
}: Props): JSX.Element {
	return <h1 css={headingStyles}>{heading}</h1>;
}
