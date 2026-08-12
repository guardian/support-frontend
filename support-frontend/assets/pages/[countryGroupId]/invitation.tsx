import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { useEffect, useState } from 'preact/hooks';
import { useParams } from 'react-router';
import { InvitationUnavailable } from 'components/onboarding/sections/invitationUnavailable';
import { GuardianHoldingContent } from 'components/serverSideRendered/guardianHoldingContent';
import { AnalyticsProfileCacheProvider } from 'helpers/customHooks/analyticsProfileCache';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type { VerifyInvitationResult } from 'helpers/onboardingInvitee/invitation';
import { verifyInvitation } from 'helpers/onboardingInvitee/invitation';
import OnboardingDeclineComponent from './components/onboardingDeclineComponent';
import OnboardingInviteeComponent from './components/onboardingInviteeComponent';

type InvitationMode = 'accept' | 'reject';

type InvitationProps = {
	supportRegionId: SupportRegionId;
	landingPageSettings: LandingPageVariant;
	mode: InvitationMode;
};

export function Invitation({
	supportRegionId,
	landingPageSettings,
	mode,
}: InvitationProps) {
	const { code: invitationCode } = useParams<{ code: string }>();

	const [verification, setVerification] = useState<VerifyInvitationResult>();

	useEffect(() => {
		if (!invitationCode) {
			return;
		}

		void verifyInvitation(invitationCode).then(setVerification);
	}, [invitationCode]);

	if (!invitationCode) {
		return <InvitationUnavailable />;
	}

	if (!verification) {
		return <GuardianHoldingContent />;
	}

	if (verification.status === 'invalid') {
		return <InvitationUnavailable />;
	}

	if (verification.status === 'expired') {
		return <InvitationUnavailable />;
	}

	if (mode === 'reject') {
		return (
			<OnboardingDeclineComponent
				supportRegionId={supportRegionId}
				landingPageSettings={landingPageSettings}
				invitationCode={invitationCode}
			/>
		);
	}

	const { invitation } = verification;

	if (!invitation) {
		return <InvitationUnavailable />;
	}

	const csrf = { token: window.guardian.csrf.token };

	return (
		<AnalyticsProfileCacheProvider>
			<OnboardingInviteeComponent
				supportRegionId={supportRegionId}
				csrf={csrf}
				invitation={invitation}
				landingPageSettings={landingPageSettings}
			/>
		</AnalyticsProfileCacheProvider>
	);
}
