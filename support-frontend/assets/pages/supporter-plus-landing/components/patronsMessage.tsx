import { css } from '@emotion/react';
import { headline, space, textSans } from '@guardian/source-foundations';
import { Link } from '@guardian/source-react-components';
import { getPatronsLink } from 'helpers/urls/externalLinks';

const headingStyles = css`
	${headline.xxxsmall({ fontWeight: 'bold' })};
	color: #606060;
	margin-bottom: ${space[1]}px;
`;

const copyStyles = css`
	${textSans.xsmall({ lineHeight: 'regular' })};
	color: #606060;
`;

const linkStyles = css`
	font-size: inherit;
	line-height: inherit;
	color: #606060;
`;

const intCMPParameter = 'gdnwb_copts_support_contributions_referral';

export function PatronsMessage(): JSX.Element {
	return (
		<>
			<h2 css={headingStyles}>Guardian Patrons programme</h2>
			<p css={copyStyles}>
				If you would like to support us at a higher level, from £100 a month,
				you can join us as a Guardian Patron.{' '}
				<Link
					css={linkStyles}
					priority="secondary"
					href={getPatronsLink(intCMPParameter)}
				>
					Find out more today.
				</Link>
			</p>
		</>
	);
}
