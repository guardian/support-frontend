import { css } from '@emotion/react';
import { from, palette, space, textSans12 } from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { Container } from 'components/layout/container';
import { privacyLink } from 'helpers/legal';

const container = css`
	${textSans12}
	color: ${palette.neutral[97]};
	background-color: ${palette.brand[400]};
	position: relative;
	align-items: flex-end;
	> div {
		padding: ${space[3]}px ${space[4]}px ${space[4]}px;
		display: flex;
		justify-content: center;
		border-bottom: 1px solid ${palette.brand[600]};
		${from.tablet} {
			width: 742px;
			border-left: 1px solid ${palette.brand[600]};
			border-right: 1px solid ${palette.brand[600]};
		}
		${from.desktop} {
			width: 982px;
		}
		${from.leftCol} {
			width: 1142px;
		}
	}
	> div > div {
		max-width: 940px;
		& a {
			font-weight: bold;
			color: ${palette.neutral[97]};
			:visited {
				color: ${palette.neutral[97]};
			}
		}
	}
`;

const studentTsAndCs: Partial<Record<CountryGroupId, JSX.Element>> = {
	AUDCountries: (
		<div>
			Access to the All-access digital subscription offered under this agreement
			is strictly limited to currently enrolled students of the University of
			Technology Sydney (UTS). Redemption of the offer is conditional upon
			registration using a valid and active UTS email address. Your email
			address may be subjected to an internal verification process to confirm
			your eligibility as a UTS student – you may refer to the Guardian’s{` `}
			<a href={privacyLink} target="_blank" rel="noopener noreferrer">
				privacy policy
			</a>{' '}
			which explains how personal information is handled by the Guardian. The
			Guardian reserves the right to cancel, suspend, or revoke any subscription
			claimed through this offer if it is reasonably suspected or determined
			that the subscriber does not meet the eligibility criteria.
		</div>
	),
};
interface StudentTsAndCsProps {
	countryGroupId: CountryGroupId;
}
export function StudentTsAndCs({
	countryGroupId,
}: StudentTsAndCsProps): JSX.Element {
	return (
		<Container sideBorders cssOverrides={container}>
			{studentTsAndCs[countryGroupId]}
		</Container>
	);
}
