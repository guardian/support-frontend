import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { AnalyticsProfileCacheProvider } from 'helpers/customHooks/analyticsProfileCache';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import { resolveInvitation } from 'helpers/onboardingInvitee/invitation';
import ErrorPage from 'pages/error/components/errorPage';
import OnboardingInviteeComponent from './components/onboardingInviteeComponent';

type JoinProps = {
	supportRegionId: SupportRegionId;
	landingPageSettings: LandingPageVariant;
};

export function Join({ supportRegionId, landingPageSettings }: JoinProps) {
	const searchParams = new URLSearchParams(window.location.search);
	const invitationId = searchParams.get('invitationId');

	if (!invitationId) {
		return (
			<ErrorPage
				headings={['This invitation', 'link is invalid']}
				copy="Please check the link in your email and try again. If the problem persists, "
				reportLink={true}
			/>
		);
	}

	const csrf = { token: window.guardian.csrf.token };
	const invitation = resolveInvitation(invitationId);

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
