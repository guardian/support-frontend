import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	space,
	until,
} from '@guardian/source/foundations';
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
const centredContainerDigitalWeekly = css`
	padding: ${space[5]}px ${space[3]}px ${space[10]}px;
	${from.tablet} {
		width: 100%;
		padding: ${space[8]}px ${space[5]}px ${space[12]}px;
	}
	${from.wide} {
		padding-left: ${space[8]}px;
		padding-right: ${space[8]}px;
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
	section {
		padding-top: 0;
		padding-bottom: 0;
		${from.tablet} {
			padding-left: 0;
		}
		div > h2 {
			${headlineBold24};
			${from.tablet} {
				font-size: 28px;
			}
			${from.wide} {
				font-size: 34px;
			}
		}
	}
	section:nth-child(1) {
		${until.tablet} {
			border-top: none;
			margin-bottom: ${space[8]}px;
		}
	}
	section:nth-child(2) {
		${until.tablet} {
			padding-top: ${space[5]}px;
		}
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
			cssOverrides={enableWeeklyDigital ? undefined : containerWeekly}
		>
			<CentredContainer
				cssOverrides={
					enableWeeklyDigital ? centredContainerDigitalWeekly : undefined
				}
			>
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
