import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useSearchParams } from 'react-router';
import OnboardingLayout from 'components/onboarding/layout';
import {
	OnboardingInviteeSteps,
	OnboardingSteps,
} from 'components/onboarding/onboardingSteps';
import type {
	HandleStepNavigationFunction,
	OnboardingMessageEventData,
} from 'components/onboarding/onboardingTypes';
import { OnboardingAppsDiscovery } from 'components/onboarding/sections/appsDiscovery';
import { OnboardingCreateAccount } from 'components/onboarding/sections/createAccount';
import { OnboardingDigitalPlusDiscovery } from 'components/onboarding/sections/digitalPlusDiscovery';
import { InvitationUnavailable } from 'components/onboarding/sections/invitationUnavailable';
import { OnboardingInviteeCompleted } from 'components/onboarding/sections/onboardingInviteeCompleted';
import { WrongEmail } from 'components/onboarding/sections/wrongEmail';
import { GuardianHoldingContent } from 'components/serverSideRendered/guardianHoldingContent';
import useAnalyticsProfile from 'helpers/customHooks/useAnalyticsProfile';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type {
	AcceptInvitationResult,
	OnboardingInviteeInvitation,
} from 'helpers/onboardingInvitee/invitation';
import { acceptInvitation } from 'helpers/onboardingInvitee/invitation';
import * as cookie from 'helpers/storage/cookie';
import type { CsrfState } from 'helpers/types/csrf';
import { getUser } from 'helpers/user/user';

interface OnboardingInviteeProps {
	supportRegionId: SupportRegionId;
	csrf: CsrfState;
	invitation: OnboardingInviteeInvitation;
	landingPageSettings: LandingPageVariant;
}

function OnboardingInviteeComponent({
	invitation,
	csrf,
	landingPageSettings,
	supportRegionId,
}: OnboardingInviteeProps) {
	const scrollToTopRef = useRef<HTMLDivElement>(null);
	const acceptStartedRef = useRef(false);

	const { isSignedIn } = getUser();
	const {
		hasMobileAppDownloaded,
		hasFeastMobileAppDownloaded,
		loadAnalyticsData,
	} = useAnalyticsProfile();
	const searchParams = useSearchParams();

	const documentLocation = document.location;
	const iframeOrigin = `${
		documentLocation.protocol
	}//${documentLocation.hostname.replace('support', 'profile')}`;

	const getIframeTargetUrl = (email: string) => {
		const iframeTargetUrl = new URL(`${iframeOrigin}/iframed/register/email`);
		iframeTargetUrl.searchParams.set('appClientId', 'maj');

		if (email) {
			iframeTargetUrl.searchParams.set('prepopulateEmail', email);
		}

		return iframeTargetUrl.toString();
	};

	const [currentStep, setCurrentStep] = useState<OnboardingInviteeSteps>();
	const [showIdentityIframe, setShowIdentityIframe] = useState(!isSignedIn);
	const [acceptStatus, setAcceptStatus] =
		useState<AcceptInvitationResult>('pending');
	const identityIframeRef = useRef<HTMLIFrameElement>(null);

	const handleStepNavigation: HandleStepNavigationFunction = (targetStep) => {
		searchParams[1]((prev) => {
			prev.set('step', targetStep);
			return prev;
		});
	};

	useEffect(() => {
		if (searchParams[0].has('step')) {
			const urlStep = searchParams[0].get('step') as OnboardingInviteeSteps;
			setCurrentStep(urlStep);

			requestAnimationFrame(() => {
				scrollToTopRef.current?.scrollIntoView({ behavior: 'smooth' });
			});
		} else {
			setCurrentStep(OnboardingInviteeSteps.CreateAccount);
			searchParams[1]((prev) => {
				prev.set('step', OnboardingInviteeSteps.CreateAccount);
				return prev;
			});
		}
	}, [searchParams, isSignedIn]);

	const redeemInvitation = async () => {
		if (acceptStartedRef.current) {
			return;
		}
		acceptStartedRef.current = true;

		const result = await acceptInvitation(invitation.invitationCode, csrf);
		void loadAnalyticsData();
		setAcceptStatus(result);
	};

	const ensureAccessTokenThenAccept = () => {
		if (cookie.get('GU_ACCESS_TOKEN')) {
			void redeemInvitation();
			return;
		}

		try {
			const iframe = document.createElement('iframe');
			iframe.style.display = 'none';
			iframe.src = '/oauth/authorize';

			document.body.appendChild(iframe);

			const MAX_ATTEMPTS = 30;
			const POLL_INTERVAL = 200;
			let attempts = 0;

			const pollForAccessToken = () => {
				attempts++;

				const hasAccessToken = cookie.get('GU_ACCESS_TOKEN');

				if (hasAccessToken) {
					document.body.removeChild(iframe);
					void redeemInvitation();
				} else if (attempts < MAX_ATTEMPTS) {
					setTimeout(pollForAccessToken, POLL_INTERVAL);
				} else {
					document.body.removeChild(iframe);
					setAcceptStatus('failed');
				}
			};

			setTimeout(pollForAccessToken, POLL_INTERVAL);
		} catch (error) {
			console.error('Failed to trigger OAuth flow:', error);
			setAcceptStatus('failed');
		}
	};

	useEffect(() => {
		if (isSignedIn) {
			ensureAccessTokenThenAccept();
		}
	}, []);

	useEffect(() => {
		const receiveIframeMessage = (
			event: MessageEvent<OnboardingMessageEventData>,
		) => {
			if (event.origin !== iframeOrigin) {
				return;
			}

			const data = event.data;

			if (data.type === 'iframeHeightChange') {
				const iframeEl = identityIframeRef.current;

				if (iframeEl) {
					iframeEl.style.height = `${data.value}px`;
				}
			}

			if (data.type === 'userStateChange') {
				if (['userSignedIn', 'userRegistered'].includes(data.value)) {
					setShowIdentityIframe(false);
					ensureAccessTokenThenAccept();
				}
			}

			if (data.type === 'iframedLinkClicked') {
				switch (data.value) {
					case 'recaptchaPrivacyPolicy':
						window.location.href = 'https://policies.google.com/privacy';
						break;
					case 'recaptchaTerms':
						window.location.href = 'https://policies.google.com/terms';
						break;
				}
			}
		};

		window.addEventListener('message', receiveIframeMessage);

		return () => {
			window.removeEventListener('message', receiveIframeMessage);
		};
	}, []);

	if (acceptStatus === 'failed') {
		return <InvitationUnavailable />;
	}

	if (acceptStatus === 'wrongUser') {
		return <WrongEmail />;
	}

	const invitationAccepted = acceptStatus === 'accepted';

	if (!invitationAccepted && !showIdentityIframe) {
		return <GuardianHoldingContent />;
	}

	return (
		<OnboardingLayout
			flow="invitee"
			scrollToTopRef={scrollToTopRef}
			onboardingStep={
				invitationAccepted
					? currentStep ?? OnboardingInviteeSteps.CreateAccount
					: OnboardingInviteeSteps.CreateAccount
			}
		>
			{(currentStep === OnboardingInviteeSteps.CreateAccount ||
				!invitationAccepted) && (
				<OnboardingCreateAccount
					iframeRef={identityIframeRef}
					iframeSrc={getIframeTargetUrl(invitation.email)}
					showIframe={showIdentityIframe}
					handleStepNavigation={handleStepNavigation}
					csrf={csrf}
					userNewslettersSubscriptions={null}
				/>
			)}
			{invitationAccepted &&
				currentStep === OnboardingInviteeSteps.GuardianApp && (
					<OnboardingAppsDiscovery
						hasMobileAppDownloaded={hasMobileAppDownloaded}
						hasFeastMobileAppDownloaded={hasFeastMobileAppDownloaded}
						onboardingStep={OnboardingSteps.GuardianApp}
						handleStepNavigation={handleStepNavigation}
						nextStep={OnboardingInviteeSteps.DigitalPlus}
						backStep={OnboardingInviteeSteps.CreateAccount}
						supporterRegion={supportRegionId}
					/>
				)}
			{invitationAccepted &&
				currentStep === OnboardingInviteeSteps.DigitalPlus && (
					<OnboardingDigitalPlusDiscovery
						handleStepNavigation={handleStepNavigation}
					/>
				)}
			{invitationAccepted &&
				currentStep === OnboardingInviteeSteps.Completed && (
					<OnboardingInviteeCompleted
						invitation={invitation}
						landingPageSettings={landingPageSettings}
						supportRegionId={supportRegionId}
					/>
				)}
		</OnboardingLayout>
	);
}

export default OnboardingInviteeComponent;
