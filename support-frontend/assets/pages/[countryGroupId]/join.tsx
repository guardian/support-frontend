import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { useEffect, useState } from 'preact/hooks';
import { InvitationUnavailable } from 'components/onboarding/sections/invitationUnavailable';
import { GuardianHoldingContent } from 'components/serverSideRendered/guardianHoldingContent';
import { AnalyticsProfileCacheProvider } from 'helpers/customHooks/analyticsProfileCache';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type { VerifyInvitationResult } from 'helpers/onboardingInvitee/invitation';
import { verifyInvitation } from 'helpers/onboardingInvitee/invitation';
import OnboardingDeclineComponent from './components/onboardingDeclineComponent';
import OnboardingInviteeComponent from './components/onboardingInviteeComponent';

type JoinProps = {
	supportRegionId: SupportRegionId;
	landingPageSettings: LandingPageVariant;
};

export function Join({ supportRegionId, landingPageSettings }: JoinProps) {
	const searchParams = new URLSearchParams(window.location.search);
	const invitationCode = searchParams.get('invitationCode');
	const isDecline = searchParams.has('decline');

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

	if (isDecline) {
		return (
			<OnboardingDeclineComponent
				supportRegionId={supportRegionId}
				landingPageSettings={landingPageSettings}
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
