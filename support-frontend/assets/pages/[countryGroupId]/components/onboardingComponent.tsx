import { css } from '@emotion/react';
import { storage } from '@guardian/libs';
import { space } from '@guardian/source/foundations';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useSearchParams } from 'react-router-dom';
import ContentBox from 'components/onboarding/contentBox';
import { OnboardingAppsDiscovery } from 'components/onboarding/sections/appsDiscovery';
import { OnboardingCompleted } from 'components/onboarding/sections/completed';
import OnboardingSummary, {
	OnboardingSummarySuccessfulSignIn,
} from 'components/onboarding/sections/summary';
import useAnalyticsProfile from 'helpers/customHooks/useAnalyticsProfile';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type { Newsletter } from 'helpers/identity/newsletters';
import { getNewsletters } from 'helpers/identity/newsletters';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import type { UserType } from 'helpers/redux/checkout/personalDetails/state';
import { getUser } from 'helpers/user/user';
import OnboardingLayout from '../../../components/onboarding/layout';
import { getThankYouOrder } from '../checkout/helpers/sessionStorage';
import { OnboardingSteps } from './onboardingSteps';

const identityFrameStyles = css`
	overflow: hidden;
	border-radius: ${space[2]}px;
`;

type UserStateChange = 'userSignedIn' | 'userRegistered';

type MessageEventData =
	| {
			type: 'iframeHeightChange';
			context: 'supporterOnboarding';
			value: number;
	  }
	| {
			type: 'userStateChange';
			context: 'supporterOnboarding';
			value: UserStateChange;
	  };

export type CurrentUserState = UserStateChange | 'existingUserSignedIn';

export type HandleStepNavigationFunction = (
	targetStep: OnboardingSteps,
) => void;

export type OnboardingProductKey = Extract<ActiveProductKey, 'SupporterPlus'>;

export interface OnboardingProps {
	supportRegionId: SupportRegionId;
	csrf: CsrfState;
	payment: {
		originalAmount: number;
		discountedAmount?: number;
		contributionAmount?: number;
		finalAmount: number;
	};
	productKey?: OnboardingProductKey;
	ratePlanKey?: ActiveRatePlanKey;
	promotion?: Promotion;
	landingPageSettings: LandingPageVariant;
	identityUserType: UserType;
}

function OnboardingComponent({
	supportRegionId,
	csrf,
	payment,
	productKey,
	ratePlanKey,
	promotion,
	landingPageSettings,
	identityUserType,
}: OnboardingProps) {
	const order = getThankYouOrder();
	if (!order) {
		const sessionStorageOrder = storage.session.get('thankYouOrder');
		return (
			<div>Unable to read your order {JSON.stringify(sessionStorageOrder)}</div>
		);
	}

	// -------------
	// Fetch newsletters from Identity API
	const [newsletters, setNewsletters] = useState<Newsletter[]>([]);

	const fetchNewsletters = async () => {
		const newslettersData = await getNewsletters();
		setNewsletters(newslettersData);
		console.debug('Newsletters fetched:', newslettersData);
	};

	useEffect(() => {
		void fetchNewsletters();
	}, []);

	console.debug('Newsletters:', newsletters);
	// -------------

	const { isSignedIn } = getUser();
	const { hasMobileAppDownloaded, hasFeastMobileAppDownloaded } =
		useAnalyticsProfile();
	const searchParams = useSearchParams();

	const userNotSignedIn = !isSignedIn && identityUserType === 'current';
	const guestUser = !isSignedIn && identityUserType === 'new';

	const documentLocation = document.location;
	const iframeOrigin = `${
		documentLocation.protocol
	}//${documentLocation.hostname.replace('support', 'profile')}`;
	const iframeTarget = `${iframeOrigin}${
		guestUser ? '/iframed/register/email' : '/iframed/signin'
	}`;

	const [currentStep, setCurrentStep] = useState<OnboardingSteps>();
	const [showIdentityIframe, setShowIdentityIframe] = useState(
		userNotSignedIn || guestUser,
	);
	const [userState, setUserState] = useState<CurrentUserState>(
		'existingUserSignedIn',
	);
	const identityIframeRef = useRef<HTMLIFrameElement>(null);

	// Handle URL params and set the current step from navigation
	const handleStepNavigation: HandleStepNavigationFunction = (targetStep) => {
		setCurrentStep(targetStep);
		searchParams[1]((prev) => {
			prev.set('step', targetStep);
			return prev;
		});
	};

	useEffect(() => {
		if (searchParams[0].has('step')) {
			const urlStep = searchParams[0].get('step') as OnboardingSteps;
			setCurrentStep(urlStep);
		} else {
			setCurrentStep(OnboardingSteps.Summary);
			searchParams[1]((prev) => {
				prev.set('step', OnboardingSteps.Summary);
				return prev;
			});
		}
	}, [searchParams]);

	// Handle iframe message from the identity iframe
	useEffect(() => {
		const receiveIframeMessage = (event: MessageEvent<MessageEventData>) => {
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
					setUserState(data.value);
					void fetchNewsletters();
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
			onboardingStep={currentStep ?? OnboardingSteps.Summary}
			supportRegionId={supportRegionId}
			csrf={csrf}
			payment={payment}
			productKey={productKey}
			ratePlanKey={ratePlanKey}
			promotion={promotion}
			landingPageSettings={landingPageSettings}
			identityUserType={identityUserType}
		>
			{currentStep === OnboardingSteps.Summary && (
				<>
					<ContentBox
						cssOverrides={css`
							margin-top: ${space[5]}px;
						`}
					>
						{showIdentityIframe ? (
							<iframe
								ref={identityIframeRef}
								src={iframeTarget}
								width="100%"
								css={identityFrameStyles}
							/>
						) : (
							<OnboardingSummarySuccessfulSignIn
								handleStepNavigation={handleStepNavigation}
								userState={userState}
							/>
						)}
					</ContentBox>
					<OnboardingSummary
						productKey={productKey}
						landingPageSettings={landingPageSettings}
						supportRegionId={supportRegionId}
						csrf={csrf}
						payment={payment}
						identityUserType={identityUserType}
						ratePlanKey={ratePlanKey}
					/>
				</>
			)}
			{(currentStep === OnboardingSteps.GuardianApp ||
				currentStep === OnboardingSteps.FeastApp) && (
				<OnboardingAppsDiscovery
					hasMobileAppDownloaded={hasMobileAppDownloaded}
					hasFeastMobileAppDownloaded={hasFeastMobileAppDownloaded}
					onboardingStep={currentStep}
					handleStepNavigation={handleStepNavigation}
				/>
			)}
			{currentStep === OnboardingSteps.Completed && (
				<OnboardingCompleted
					productKey={productKey}
					landingPageSettings={landingPageSettings}
				/>
			)}
		</OnboardingLayout>
	);
}

export default OnboardingComponent;
