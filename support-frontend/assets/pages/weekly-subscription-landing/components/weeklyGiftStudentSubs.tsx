import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import GiftNonGiftCta from 'components/product/giftNonGiftCta';
import { routes } from 'helpers/urls/routes';

const containerWeekly = css`
	background-color: white;
	section {
		border-top: none;
		padding: ${space[3]}px ${space[3]}px ${space[12]}px;
	}
	section > div {
		margin-bottom: ${space[9]}px;
	}
	section > a {
		width: auto;
	}
`;
const displayRowEvenlyWeekly = css`
	background-color: white;
	display: block;
	${from.phablet} {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
	}
`;
const displayRowEvenlyWeeklyDigital = css`
	display: block;
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
	enableWeeklyDigital: boolean;
};
export function WeeklyGiftStudentSubs({
	countryGroupId,
	orderIsAGift,
	enableWeeklyDigital,
}: WeeklyGiftStudentSubsPropTypes): JSX.Element {
	const giftNonGiftLink = orderIsAGift
		? routes.guardianWeeklySubscriptionLanding
		: routes.guardianWeeklySubscriptionLandingGift;
	const displayRowEvenly = enableWeeklyDigital
		? displayRowEvenlyWeeklyDigital
		: displayRowEvenlyWeekly;
	return (
		<FullWidthContainer
			cssOverrides={!enableWeeklyDigital ? containerWeekly : undefined}
		>
			<CentredContainer>
				<div css={displayRowEvenly}>
					<GiftNonGiftCta
						product="Guardian Weekly"
						href={giftNonGiftLink}
						isGift={orderIsAGift}
					/>
					{(countryGroupId === 'GBPCountries' ||
						countryGroupId === 'AUDCountries') && (
						<GiftNonGiftCta
							product="Student"
							href={getStudentBeanLink(countryGroupId)}
							isGift={orderIsAGift}
							isStudent={true}
						/>
					)}
				</div>
			</CentredContainer>
		</FullWidthContainer>
	);
}
