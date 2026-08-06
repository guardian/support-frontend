import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import GiftNonGiftCta from 'components/product/giftNonGiftCta';
import { routes } from 'helpers/urls/routes';
import {
	centredContainerWeeklyDigital,
	containerWeeklyDigital,
	displayRowEvenlyWeeklyDigital,
	displayRowEvenlyWeeklyGift,
} from './weeklyAlternativeSubsStyles';

function getStudentBeanLink(supportRegionId: SupportRegionId) {
	if (supportRegionId === 'au') {
		return routes.guardianWeeklyStudentAU;
	}
	return routes.guardianWeeklyStudentUK;
}

export function WeeklyAlternativeSubs({
	supportRegionId,
	orderIsAGift,
}: {
	supportRegionId: SupportRegionId;
	orderIsAGift: boolean;
}): JSX.Element {
	const giftNonGiftLink = orderIsAGift
		? routes.guardianWeeklySubscriptionLanding
		: routes.guardianWeeklySubscriptionLandingGift;
	const displayRowEvenly = orderIsAGift
		? displayRowEvenlyWeeklyGift
		: displayRowEvenlyWeeklyDigital;

	return (
		<FullWidthContainer
			cssOverrides={orderIsAGift ? containerWeeklyDigital : undefined}
		>
			<CentredContainer
				cssOverrides={orderIsAGift ? undefined : centredContainerWeeklyDigital}
			>
				<div css={displayRowEvenly}>
					<GiftNonGiftCta
						product="Guardian Weekly"
						href={`/${supportRegionId}${giftNonGiftLink}`}
						isGift={orderIsAGift}
					/>
					{(supportRegionId === 'uk' || supportRegionId === 'au') && (
						<GiftNonGiftCta
							product="Student"
							href={getStudentBeanLink(supportRegionId)}
							isGift={orderIsAGift}
							isStudent={true}
						/>
					)}
				</div>
			</CentredContainer>
		</FullWidthContainer>
	);
}
