import { css } from '@emotion/react';
import { headline, space, textSans } from '@guardian/source-foundations';
import { Link } from '@guardian/source-react-components';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
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

export function PatronsMessage({
	countryGroupId,
}: {
	countryGroupId: CountryGroupId;
}): JSX.Element {
	const patronageAmountsWithGlyph = {
		GBPCountries: '£100',
		AUDCountries: '$185',
		EURCountries: '€117',
		International: '$135',
		NZDCountries: '$200',
		Canada: '$167',
	};

	const isUSA = countryGroupId === 'UnitedStates';

	return (
		<>
			<h2 css={headingStyles}>
				{isUSA ? 'Support another way' : 'Guardian Patrons programme'}
			</h2>
			{isUSA ? (
				<p css={copyStyles}>
					To learn more about other ways to support the Guardian, including
					checks and tax-exempt options, please visit our{' '}
					<Link
						css={linkStyles}
						priority="secondary"
						href={getPatronsLink(intCMPParameter, countryGroupId)}
					>
						help page
					</Link>{' '}
					on this topic.
				</p>
			) : (
				<p css={copyStyles}>
					If you would like to support us at a higher level, from{' '}
					{patronageAmountsWithGlyph[countryGroupId]} a month, you can join us
					as a Guardian Patron.{' '}
					<Link
						css={linkStyles}
						priority="secondary"
						href={getPatronsLink(intCMPParameter, countryGroupId)}
					>
						Find out more today.
					</Link>
				</p>
			)}
		</>
	);
}
