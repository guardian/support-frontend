import {
	type CountryGroupId,
	countryGroups,
} from '@modules/internationalisation/countryGroup';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import GiftNonGiftCta from 'components/product/giftNonGiftCta';
import { routes } from 'helpers/urls/routes';
import {
	centredContainerDigitalWeekly,
	displayRowEvenlyWeeklyDigital,
} from './weeklyAlternatveSubsStyles';

function getStudentBeanLink(countryGroupId: CountryGroupId) {
	if (countryGroupId === 'AUDCountries') {
		return routes.guardianWeeklyStudentAU;
	}
	return routes.guardianWeeklyStudentUK;
}

export function WeeklyAlternativeSubs({
	countryGroupId,
	orderIsAGift,
}: {
	countryGroupId: CountryGroupId;
	orderIsAGift: boolean;
}): JSX.Element {
	const giftNonGiftLink = orderIsAGift
		? routes.guardianWeeklySubscriptionLanding
		: routes.guardianWeeklySubscriptionLandingGift;
	const regionId = countryGroups[countryGroupId].supportRegionId;
	return (
		<FullWidthContainer>
			<CentredContainer cssOverrides={centredContainerDigitalWeekly}>
				<div css={displayRowEvenlyWeeklyDigital}>
					<GiftNonGiftCta
						product="Guardian Weekly"
						href={`/${regionId}${giftNonGiftLink}`}
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
