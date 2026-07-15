import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { useEffect, useState } from 'preact/hooks';
import { GuardianHoldingContent } from 'components/serverSideRendered/guardianHoldingContent';
import { AnalyticsProfileCacheProvider } from 'helpers/customHooks/analyticsProfileCache';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type { VerifyInvitationResult } from 'helpers/onboardingInvitee/invitation';
import { verifyInvitation } from 'helpers/onboardingInvitee/invitation';
import ErrorPage from 'pages/error/components/errorPage';
import OnboardingDeclineComponent from './components/onboardingDeclineComponent';
import OnboardingInviteeComponent from './components/onboardingInviteeComponent';

type JoinProps = {
	supportRegionId: SupportRegionId;
	landingPageSettings: LandingPageVariant;
};

function InvalidInvitation() {
	return (
		<ErrorPage
			headings={['This invitation', 'link is invalid']}
			copy="Please check the link in your email and try again. If the problem persists, "
			reportLink={true}
		/>
	);
}

export function InvitationExpired() {
	return (
		<ErrorPage
			headings={['This invitation', 'has expired']}
			copy="Please ask whoever invited you to send a new invitation. If the problem persists, "
			reportLink={true}
		/>
	);
}

export function Join({ supportRegionId, landingPageSettings }: JoinProps) {
	const searchParams = new URLSearchParams(window.location.search);
	const invitationId = searchParams.get('invitationId');
	const isDecline = searchParams.has('decline');

	const [verification, setVerification] = useState<VerifyInvitationResult>();

	useEffect(() => {
		if (!invitationId) {
			return;
		}

		void verifyInvitation(invitationId).then(setVerification);
	}, [invitationId]);

	if (!invitationId) {
		return <InvalidInvitation />;
	}

	if (!verification) {
		return <GuardianHoldingContent />;
	}

	if (verification.status === 'invalid') {
		return <InvalidInvitation />;
	}

	if (verification.status === 'expired') {
		return <InvitationExpired />;
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
		return <InvalidInvitation />;
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
