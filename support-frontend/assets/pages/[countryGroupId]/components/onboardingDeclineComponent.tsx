import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useSearchParams } from 'react-router';
import OnboardingLayout from 'components/onboarding/layout';
import { OnboardingDeclineSteps } from 'components/onboarding/onboardingSteps';
import type { HandleStepNavigationFunction } from 'components/onboarding/onboardingTypes';
import { OnboardingDeclineInvitation } from 'components/onboarding/sections/declineInvitation';
import { OnboardingDeclineSave } from 'components/onboarding/sections/declineSave';
import { OnboardingInvitationDeclined } from 'components/onboarding/sections/invitationDeclined';
import { InvitationUnavailable } from 'components/onboarding/sections/invitationUnavailable';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';

interface OnboardingDeclineComponentProps {
	supportRegionId: SupportRegionId;
	landingPageSettings: LandingPageVariant;
}

function OnboardingDeclineComponent({
	supportRegionId,
	landingPageSettings,
}: OnboardingDeclineComponentProps) {
	const scrollToTopRef = useRef<HTMLDivElement>(null);
	const searchParams = useSearchParams();
	const invitationCode = searchParams[0].get('invitationCode');

	const [currentStep, setCurrentStep] = useState<OnboardingDeclineSteps>();
	const [declineFailed, setDeclineFailed] = useState(false);

	const handleStepNavigation: HandleStepNavigationFunction = (targetStep) => {
		searchParams[1]((prev) => {
			prev.set('step', targetStep);
			return prev;
		});
	};

	useEffect(() => {
		if (searchParams[0].has('step')) {
			const urlStep = searchParams[0].get('step') as OnboardingDeclineSteps;
			setCurrentStep(urlStep);

			requestAnimationFrame(() => {
				scrollToTopRef.current?.scrollIntoView({ behavior: 'smooth' });
			});
		} else {
			setCurrentStep(OnboardingDeclineSteps.Decline);
			searchParams[1]((prev) => {
				prev.set('step', OnboardingDeclineSteps.Decline);
				return prev;
			});
		}
	}, [searchParams]);

	if (!invitationCode) {
		return <InvitationUnavailable />;
	}

	if (declineFailed) {
		return <InvitationUnavailable />;
	}

	const csrf = { token: window.guardian.csrf.token };

	return (
		<OnboardingLayout
			flow="decline"
			scrollToTopRef={scrollToTopRef}
			onboardingStep={currentStep ?? OnboardingDeclineSteps.Decline}
		>
			{currentStep === OnboardingDeclineSteps.Decline && (
				<OnboardingDeclineInvitation
					supportRegionId={supportRegionId}
					landingPageSettings={landingPageSettings}
					handleStepNavigation={handleStepNavigation}
					invitationCode={invitationCode}
					csrf={csrf}
					onDeclineFailed={() => {
						setDeclineFailed(true);
					}}
				/>
			)}
			{currentStep === OnboardingDeclineSteps.Declined && (
				<OnboardingInvitationDeclined />
			)}
			{currentStep === OnboardingDeclineSteps.Save && (
				<OnboardingDeclineSave
					supportRegionId={supportRegionId}
					landingPageSettings={landingPageSettings}
					invitationCode={invitationCode}
				/>
			)}
		</OnboardingLayout>
	);
}

export default OnboardingDeclineComponent;
