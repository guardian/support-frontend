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
import { OnboardingInviteeCompleted } from 'components/onboarding/sections/onboardingInviteeCompleted';
import useAnalyticsProfile from 'helpers/customHooks/useAnalyticsProfile';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type { NewsletterSubscription } from 'helpers/identity/newsletters';
import { getNewslettersSubscriptions } from 'helpers/identity/newsletters';
import type { OnboardingInviteeInvitation } from 'helpers/onboardingInvitee/invitation';
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

	const [userNewslettersSubscriptions, setUserNewslettersSubscriptions] =
		useState<NewsletterSubscription[] | null>(null);

	const fetchUserNewslettersSubscriptions = async () => {
		try {
			const newslettersData = await getNewslettersSubscriptions(csrf);
			setUserNewslettersSubscriptions(newslettersData);
			console.debug('User Newsletters Subscriptions fetched:', newslettersData);
		} catch (error) {
			console.error('Error fetching User Newsletters Subscriptions:', error);
		}
	};

	useEffect(() => {
		void fetchUserNewslettersSubscriptions();
	}, []);

	const { isSignedIn } = getUser();
	const { hasMobileAppDownloaded, hasFeastMobileAppDownloaded, loadAnalyticsData } =
		useAnalyticsProfile();
	const searchParams = useSearchParams();

	const documentLocation = document.location;
	const iframeOrigin = `${documentLocation.protocol
		}//${documentLocation.hostname.replace('support', 'profile')}`;

	// This might need tweaking since we don't have the guestUser URL Param
	const getIframeTargetUrl = (email: string) => {
		const iframeTargetUrl = new URL(`${iframeOrigin}/iframed/register/email`);

		if (email) {
			iframeTargetUrl.searchParams.set(
				'prepopulateEmail',
				encodeURIComponent(email),
			);
		}

		return iframeTargetUrl.toString();
	};

	const [currentStep, setCurrentStep] = useState<OnboardingInviteeSteps>();
	const [showIdentityIframe, setShowIdentityIframe] = useState(!isSignedIn);
	const identityIframeRef = useRef<HTMLIFrameElement>(null);

	const handleStepNavigation: HandleStepNavigationFunction = (
		targetStep,
	) => {
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

	const triggerOAuthFlow = () => {
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

					void fetchUserNewslettersSubscriptions();
					void loadAnalyticsData();
				} else if (attempts < MAX_ATTEMPTS) {
					setTimeout(pollForAccessToken, POLL_INTERVAL);
				} else {
					document.body.removeChild(iframe);
				}
			};

			setTimeout(pollForAccessToken, POLL_INTERVAL);
		} catch (error) {
			console.error('Failed to trigger OAuth flow:', error);
		}
	};

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

					triggerOAuthFlow();
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

	return (
		<OnboardingLayout
			flow="invitee"
			scrollToTopRef={scrollToTopRef}
			onboardingStep={currentStep ?? OnboardingInviteeSteps.CreateAccount}
		>
			{currentStep === OnboardingInviteeSteps.CreateAccount && (
				<OnboardingCreateAccount
					iframeRef={identityIframeRef}
					iframeSrc={getIframeTargetUrl(invitation.email)}
					showIframe={showIdentityIframe}
					handleStepNavigation={handleStepNavigation}
					csrf={csrf}
					userNewslettersSubscriptions={userNewslettersSubscriptions}
				/>
			)}
			{currentStep === OnboardingInviteeSteps.GuardianApp && (
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
			{currentStep === OnboardingInviteeSteps.DigitalPlus && (
				<OnboardingDigitalPlusDiscovery
					handleStepNavigation={handleStepNavigation}
				/>
			)}
			{currentStep === OnboardingInviteeSteps.Completed && (
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
