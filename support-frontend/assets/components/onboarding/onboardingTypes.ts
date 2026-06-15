import type {
	OnboardingInviteeSteps,
	OnboardingSteps,
} from './onboardingSteps';

export type OnboardingFlow = 'supporter' | 'invitee';

export type OnboardingFlowStep = OnboardingSteps | OnboardingInviteeSteps;

type UserStateChange = 'userSignedIn' | 'userRegistered';

type HrefIframeAllowList = 'recaptchaPrivacyPolicy' | 'recaptchaTerms';

export type OnboardingMessageEventData =
	| {
			type: 'iframeHeightChange';
			context: 'supporterOnboarding';
			value: number;
	  }
	| {
			type: 'userStateChange';
			context: 'supporterOnboarding';
			value: UserStateChange;
	  }
	| {
			type: 'iframedLinkClicked';
			context: 'supporterOnboarding';
			value: HrefIframeAllowList;
	  };

export type CurrentUserState = UserStateChange | 'existingUserSignedIn';

export type HandleStepNavigationFunction = (
	targetStep: OnboardingFlowStep,
) => void;
