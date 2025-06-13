import type { IsoCountry } from '@modules/internationalisation/country';
import { getAmountsTestVariant } from 'helpers/abTests/abtest';
import type { Participations } from 'helpers/abTests/models';
import { Country } from 'helpers/internationalisation/classes/country';
import { type GeoId, getGeoIdConfig } from 'pages/geoIdConfig';
import { threeTierCheckoutEnabled } from 'pages/supporter-plus-landing/setup/threeTierChecks';
import { ContributionsOnlyLanding } from 'pages/supporter-plus-landing/twoStepPages/contributionsOnlyLanding';
import { ThreeTierLanding } from 'pages/supporter-plus-landing/twoStepPages/threeTierLanding';
import type { LandingPageVariant } from '../../helpers/globalsAndSwitches/landingPageSettings';

type Props = {
	geoId: GeoId;
	abParticipations: Participations;
	landingPageSettings: LandingPageVariant;
};

const countryId: IsoCountry = Country.detect();

export function LandingPage({
	geoId,
	abParticipations,
	landingPageSettings,
}: Props) {
	const { countryGroupId } = getGeoIdConfig(geoId);

	const { selectedAmountsVariant: amounts } = getAmountsTestVariant(
		countryId,
		countryGroupId,
		window.guardian.settings,
	);

	const inThreeTier = threeTierCheckoutEnabled(abParticipations, amounts);

	if (inThreeTier) {
		return (
			<ThreeTierLanding
				geoId={geoId}
				abParticipations={abParticipations}
				settings={landingPageSettings}
			/>
		);
	} else {
		return <ContributionsOnlyLanding geoId={geoId} />;
	}
}
