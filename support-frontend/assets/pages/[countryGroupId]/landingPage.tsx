import type { IsoCountry } from '@modules/internationalisation/country';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { GuardianHoldingContent } from 'components/serverSideRendered/guardianHoldingContent';
import { getAmountsTestVariant } from 'helpers/abTests/abtest';
import type { Participations } from 'helpers/abTests/models';
import { useMparticleAudienceCheck } from 'helpers/abTests/useMparticleAudienceCheck';
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

	// Filter landing page tests that:
	// 1. The user is participating in (present in abParticipations)
	// 2. Have an mParticleAudience defined
	const testsWithAudience = (
		window.guardian.settings.landingPageTests ?? []
	).filter(
		(test) =>
			abParticipations[test.name] !== undefined &&
			test.mParticleAudience !== undefined,
	);

	// Check each test's audience sequentially, return first match
	const { matchedTest } = useMparticleAudienceCheck(testsWithAudience);

	// While checking audiences, show loading
	if (matchedTest === null) {
		return <GuardianHoldingContent />;
	}

	// If we found a matching test, use its variant
	const effectiveSettings =
		matchedTest !== undefined
			? matchedTest.variants.find(
					(v) => v.name === abParticipations[matchedTest.name],
			  ) ?? landingPageSettings
			: landingPageSettings;

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
				settings={effectiveSettings}
			/>
		);
	} else {
		return <ContributionsOnlyLanding supportRegionId={supportRegionId} />;
	}
}
