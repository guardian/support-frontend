import type { IsoCountry } from '@modules/internationalisation/country';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { getAmountsTestVariant } from 'helpers/abTests/abtest';
import type { Participations } from 'helpers/abTests/models';
import { Country } from 'helpers/internationalisation/classes/country';
import { threeTierCheckoutEnabled } from 'pages/supporter-plus-landing/setup/threeTierChecks';
import { ContributionsOnlyLanding } from 'pages/supporter-plus-landing/twoStepPages/contributionsOnlyLanding';
import { ThreeTierLanding } from 'pages/supporter-plus-landing/twoStepPages/threeTierLanding';
import type { LandingPageVariant } from '../../helpers/globalsAndSwitches/landingPageSettings';
import { getSupportRegionIdConfig } from '../supportRegionConfig';

type Props = {
	supportRegionId: SupportRegionId;
	abParticipations: Participations;
	landingPageSettings: LandingPageVariant;
};

const countryId: IsoCountry = Country.detect();

export function LandingPage({
	supportRegionId,
	abParticipations,
	landingPageSettings,
}: Props) {
	const { countryGroupId } = getSupportRegionIdConfig(supportRegionId);

	const { selectedAmountsVariant: amounts } = getAmountsTestVariant(
		countryId,
		countryGroupId,
		window.guardian.settings,
	);

	const inThreeTier = threeTierCheckoutEnabled(abParticipations, amounts);

	if (inThreeTier) {
		return (
			<ThreeTierLanding
				supportRegionId={supportRegionId}
				abParticipations={abParticipations}
				settings={landingPageSettings}
			/>
		);
	} else {
		return <ContributionsOnlyLanding supportRegionId={supportRegionId} />;
	}
}
