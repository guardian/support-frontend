import type { CountryCode } from '@modules/internationalisation/country';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { Participations } from 'helpers/abTests/models';
import { isContributionsOnlyCountry } from 'helpers/contributions';
import { Country } from 'helpers/internationalisation/classes/country';
import { ContributionsOnlyLanding } from 'pages/supporter-plus-landing/twoStepPages/contributionsOnlyLanding';
import { ThreeTierLanding } from 'pages/supporter-plus-landing/twoStepPages/threeTierLanding';
import type { LandingPageVariant } from '../../helpers/globalsAndSwitches/landingPageSettings';

type Props = {
	supportRegionId: SupportRegionId;
	abParticipations: Participations;
	landingPageSettings: LandingPageVariant;
	enableStudentBeansEurope: boolean;
};

const countryId: CountryCode = Country.detect();

export function LandingPage({
	supportRegionId,
	abParticipations,
	landingPageSettings,
	enableStudentBeansEurope,
}: Props) {
	const inThreeTier = !isContributionsOnlyCountry(countryId);

	if (inThreeTier) {
		return (
			<ThreeTierLanding
				supportRegionId={supportRegionId}
				abParticipations={abParticipations}
				settings={landingPageSettings}
				enableStudentBeansEurope={enableStudentBeansEurope}
			/>
		);
	} else {
		return <ContributionsOnlyLanding supportRegionId={supportRegionId} />;
	}
}
