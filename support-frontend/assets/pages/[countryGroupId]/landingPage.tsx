import type { IsoCountry } from '@modules/internationalisation/country';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { Participations } from 'helpers/abTests/models';
import { isVatComplianceCountry } from 'helpers/contributions';
import { Country } from 'helpers/internationalisation/classes/country';
import { ContributionsOnlyLanding } from 'pages/supporter-plus-landing/twoStepPages/contributionsOnlyLanding';
import { ThreeTierLanding } from 'pages/supporter-plus-landing/twoStepPages/threeTierLanding';
import type { LandingPageVariant } from '../../helpers/globalsAndSwitches/landingPageSettings';

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
	const inThreeTier = !isVatComplianceCountry(countryId);

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
