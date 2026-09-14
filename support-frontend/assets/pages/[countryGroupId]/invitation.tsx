import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { useEffect, useState } from 'preact/hooks';
import { useParams } from 'react-router';
import { InvitationUnavailable } from 'components/onboarding/sections/invitationUnavailable';
import { GuardianHoldingContent } from 'components/serverSideRendered/guardianHoldingContent';
import { AnalyticsProfileCacheProvider } from 'helpers/customHooks/analyticsProfileCache';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type {
	InvitationMode,
	VerifyInvitationResult,
} from 'helpers/onboardingInvitee/invitation';
import {
	isInvitationUnavailable,
	verifyInvitation,
} from 'helpers/onboardingInvitee/invitation';
import { getUser } from 'helpers/user/user';
import OnboardingDeclineComponent from './components/onboardingDeclineComponent';
import OnboardingInviteeComponent from './components/onboardingInviteeComponent';

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

	if (isInvitationUnavailable(invitationCode, verification, mode)) {
		return <InvitationUnavailable />;
	}

	if (!invitationCode || !verification) {
		return <GuardianHoldingContent />;
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

	const invitation = verification.invitation ?? {
		invitationCode,
		email: getUser().email ?? '',
	};

	const csrf = { token: window.guardian.csrf.token };

	return (
		<AnalyticsProfileCacheProvider>
			<OnboardingInviteeComponent
				supportRegionId={supportRegionId}
				csrf={csrf}
				invitation={invitation}
				landingPageSettings={landingPageSettings}
				alreadyAccepted={verification.status === 'accepted'}
			/>
		</AnalyticsProfileCacheProvider>
	);
}
