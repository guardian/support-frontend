import { getAmountsTestVariant } from 'helpers/abTests/abtest';
import type { Participations } from 'helpers/abTests/models';
import { Country } from 'helpers/internationalisation/classes/country';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { type GeoId, getGeoIdConfig } from 'pages/geoIdConfig';
import { threeTierCheckoutEnabled } from 'pages/supporter-plus-landing/setup/threeTierChecks';
import { ContributionsOnlyLanding } from 'pages/supporter-plus-landing/twoStepPages/contributionsOnlyLanding';
import { ThreeTierLanding } from 'pages/supporter-plus-landing/twoStepPages/threeTierLanding';
import { getLandingPageVariant } from '../../helpers/abTests/landingPageAbTests';
import { getSettings } from '../../helpers/globalsAndSwitches/globals';

type Props = {
	geoId: GeoId;
	abParticipations: Participations;
};

const countryId: IsoCountry = Country.detect();

export function LandingPage({ geoId, abParticipations }: Props) {
	const { countryGroupId } = getGeoIdConfig(geoId);

	const { selectedAmountsVariant: amounts } = getAmountsTestVariant(
		countryId,
		countryGroupId,
		window.guardian.settings,
	);

	const settings = getLandingPageVariant(
		abParticipations,
		getSettings().landingPageTests,
	);

	const inThreeTier = threeTierCheckoutEnabled(abParticipations, amounts);

	if (inThreeTier) {
		return (
			<ThreeTierLanding
				geoId={geoId}
				abParticipations={abParticipations}
				settings={settings}
			/>
		);
	} else {
		return <ContributionsOnlyLanding geoId={geoId} />;
	}
}
