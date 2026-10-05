import type { CountryCode } from '@modules/internationalisation/country';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { isContributionsOnlyCountry } from 'helpers/contributions';
import { Country } from 'helpers/internationalisation/classes/country';
import { ContributionsOnlyLanding } from 'pages/supporter-plus-landing/twoStepPages/contributionsOnlyLanding';
import { ThreeTierLanding } from 'pages/supporter-plus-landing/twoStepPages/threeTierLanding';
import type { LandingPageVariant } from '../../helpers/globalsAndSwitches/landingPageSettings';

type Props = {
	supportRegionId: SupportRegionId;
	landingPageSettings: LandingPageVariant;
};

const countryId: CountryCode = Country.detect();

export function LandingPage({ supportRegionId, landingPageSettings }: Props) {
	const inThreeTier = !isContributionsOnlyCountry(countryId);

	if (inThreeTier) {
		return (
			<ThreeTierLanding
				supportRegionId={supportRegionId}
				settings={landingPageSettings}
			/>
		);
	} else {
		return <ContributionsOnlyLanding supportRegionId={supportRegionId} />;
	}
}
