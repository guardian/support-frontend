import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { from } from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import GiftNonGiftCta from 'components/product/giftNonGiftCta';
import { routes } from 'helpers/urls/routes';

const displayRowEvenly = css`
	${from.phablet} {
		display: flex;
		flex-direction: row;
		justify-content: left;
	}
`;

function getStudentBeanLink(countryGroupId: CountryGroupId) {
	if (countryGroupId === 'AUDCountries') {
		return routes.guardianWeeklyStudentAU;
	}
	return routes.guardianWeeklyStudentUK;
}

type WeeklyGiftStudentSubsPropTypes = {
	countryGroupId: CountryGroupId;
	orderIsAGift: boolean;
	cssOverrides?: SerializedStyles;
};
export function WeeklyGiftStudentSubs({
	countryGroupId,
	orderIsAGift,
	cssOverrides,
}: WeeklyGiftStudentSubsPropTypes): JSX.Element {
	const giftNonGiftLink = orderIsAGift
		? routes.guardianWeeklySubscriptionLanding
		: routes.guardianWeeklySubscriptionLandingGift;
	return (
		<FullWidthContainer cssOverrides={cssOverrides}>
			<CentredContainer>
				<div css={[displayRowEvenly, cssOverrides]}>
					<GiftNonGiftCta
						product="Guardian Weekly"
						href={giftNonGiftLink}
						orderIsAGift={orderIsAGift}
					/>
					{(countryGroupId === 'GBPCountries' ||
						countryGroupId === 'AUDCountries') && (
						<GiftNonGiftCta
							product="Student"
							href={getStudentBeanLink(countryGroupId)}
							orderIsAGift={orderIsAGift}
							isStudent={true}
						/>
					)}
				</div>
			</CentredContainer>
		</FullWidthContainer>
	);
}
