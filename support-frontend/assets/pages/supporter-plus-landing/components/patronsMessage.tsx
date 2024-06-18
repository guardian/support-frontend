import { css } from '@emotion/react';
import { headline, space } from '@guardian/source/foundations';
import { Link } from '@guardian/source/react-components';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { getPatronsLink } from 'helpers/urls/externalLinks';
import type { FinePrintTheme } from './finePrint';
import { FinePrint } from './finePrint';

const headingStyles = css`
	${headline.xxxsmall({ fontWeight: 'bold' })};
	margin-bottom: ${space[1]}px;
`;

const linkStyles = css`
	font-size: inherit;
	line-height: inherit;
	color: inherit;
`;

const intCMPParameter = 'gdnwb_copts_support_contributions_referral';

export function PatronsMessage({
	countryGroupId,
	mobileTheme = 'dark',
}: {
	countryGroupId: CountryGroupId;
	mobileTheme?: FinePrintTheme;
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
		<FinePrint mobileTheme={mobileTheme} size="xsmall">
			<h2 css={headingStyles}>
				{isUSA ? 'Support another way' : 'Guardian Patrons programme'}
			</h2>
			{isUSA ? (
				<p>
					If you are interested in contributing through a donor-advised fund,
					foundation or retirement account, or by mailing a check, please visit
					our{' '}
					<Link
						css={linkStyles}
						priority="secondary"
						href={getPatronsLink(intCMPParameter, countryGroupId)}
					>
						help page
					</Link>{' '}
					to learn how.
				</p>
			) : (
				<p>
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
		</FinePrint>
	);
}
