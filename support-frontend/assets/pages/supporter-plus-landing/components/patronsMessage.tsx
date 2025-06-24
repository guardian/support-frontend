import { css } from '@emotion/react';
import { headlineBold17, space } from '@guardian/source/foundations';
import { Link } from '@guardian/source/react-components';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { getPatronsLink } from 'helpers/urls/externalLinks';
import { CheckoutDivider } from './checkoutDivider';
import type { FinePrintTheme } from './finePrint';
import { FinePrint } from './finePrint';

const headingStyles = css`
	${headlineBold17};
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
		<>
			{!isUSA && (
				<>
					<CheckoutDivider spacing="loose" mobileTheme={'light'} />
					<FinePrint mobileTheme={mobileTheme}>
						<h2 css={headingStyles}>{'Guardian Patrons programme'}</h2>
						<p>
							If you would like to support us at a higher level, from{' '}
							{patronageAmountsWithGlyph[countryGroupId]} a month, you can join
							us as a Guardian Patron.{' '}
							<Link
								cssOverrides={linkStyles}
								priority="secondary"
								href={getPatronsLink(intCMPParameter, countryGroupId)}
							>
								Find out more today.
							</Link>
						</p>
					</FinePrint>
				</>
			)}
		</>
	);
}
