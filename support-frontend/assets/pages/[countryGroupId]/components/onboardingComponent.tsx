import { css } from '@emotion/react';
import { neutral, space } from '@guardian/source/foundations';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { useEffect, useMemo, useState } from 'react';
import ContentBox from 'components/onboarding/contentBox';
import useAnalyticsProfile from 'helpers/customHooks/useAnalyticsProfile';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import type { UserType } from 'helpers/redux/checkout/personalDetails/state';
import { getUser } from 'helpers/user/user';
import OnboardingLayout from '../../../components/onboarding/layout';
import { OnboardingSteps } from './onboardingSteps';

// --------------------------- //
// Placeholder Styles for the onboarding content
const contentStyle = css`
	text-align: center;
	padding: ${space[6]}px 0;
`;

const headingStyle = css`
	color: ${neutral[7]};
	margin-bottom: ${space[4]}px;
`;

const textStyle = css`
	color: ${neutral[20]};
	line-height: 1.5;
	margin-bottom: ${space[3]}px;
`;
// --------------------------- //

interface OnboardingProps {
	supportRegionId: SupportRegionId;
	csrf: CsrfState;
	payment: {
		originalAmount: number;
		discountedAmount?: number;
		contributionAmount?: number;
		finalAmount: number;
	};
	productKey?: ActiveProductKey;
	ratePlanKey?: ActiveRatePlanKey;
	promotion?: Promotion;
	landingPageSettings: LandingPageVariant;
	identityUserType: UserType;
}

function OnboardingComponent({
	supportRegionId,
	payment,
	productKey,
	ratePlanKey,
	promotion,
	landingPageSettings,
	identityUserType,
}: OnboardingProps) {
	const user = getUser();
	const { hasMobileAppDownloaded, hasFeastMobileAppDownloaded } =
		useAnalyticsProfile();

	const [currentStep, setCurrentStep] = useState<OnboardingSteps>();

	// --------------------------- //
	// TODO: Dynamically generated based on Products and User profile
	const onboardingSteps = useMemo(() => {
		return [
			{
				label: 'Summary',
				step: OnboardingSteps.Summary,
			},
			{
				label: 'Guardian App',
				step: OnboardingSteps.GuardianApp,
			},
			{
				label: 'Feast App',
				step: OnboardingSteps.FeastApp,
			},
			{
				label: 'Thank You',
				step: OnboardingSteps.ThankYou,
			},
		];
	}, []);

	// User: New or Current? Signed In or not?
	console.debug('identityUserType', identityUserType);
	console.debug('user', user, user.isSignedIn);

	// Product information
	console.debug('payment', payment);
	console.debug('productKey', productKey);
	console.debug('ratePlanKey', ratePlanKey);
	console.debug('promotion', promotion);
	console.debug('landingPageSettings', landingPageSettings);

	// Analytics data
	console.debug('hasMobileAppDownloaded', hasMobileAppDownloaded);
	console.debug('hasFeastMobileAppDownloaded', hasFeastMobileAppDownloaded);
	// --------------------------- //

	const handleStepNavigation = (currentStep: OnboardingSteps) => {
		const nextStep =
			onboardingSteps[
				onboardingSteps.findIndex((step) => step.step === currentStep) + 1
			];

		if (nextStep) {
			const newParams = new URLSearchParams(window.location.search);
			newParams.set('step', nextStep.step);
			window.history.pushState({}, '', `?${newParams.toString()}`);
			setCurrentStep(nextStep.step);
		} else {
			window.history.pushState({}, '', 'https://www.theguardian.com');
		}
	};

	// Handle URL params and set the current step from navigation
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);

		if (urlParams.has('step')) {
			const urlStep = urlParams.get('step') as OnboardingSteps;
			setCurrentStep(urlStep);
		} else {
			setCurrentStep(OnboardingSteps.Summary);

			urlParams.set('step', OnboardingSteps.Summary);
			window.history.pushState({}, '', `?${urlParams.toString()}`);
		}
	}, []);

	return (
		<OnboardingLayout onboardingStep={currentStep ?? OnboardingSteps.Summary}>
			<ContentBox>
				{/* // --------------------------- // */}
				{/* Placeholder Content for the onboarding content */}
				<div css={contentStyle}>
					<h1 css={headingStyle}>Welcome to your new onboarding experience!</h1>
					<p css={textStyle}>
						Thank you for supporting The Guardian. This is a new onboarding flow
						for region: <strong>{supportRegionId}</strong>
					</p>

					{currentStep === OnboardingSteps.Summary && (
						<>
							<p>Summary</p>
							<button onClick={() => handleStepNavigation(currentStep)}>
								Next
							</button>
						</>
					)}
					{currentStep === OnboardingSteps.GuardianApp && (
						<>
							<p>Guardian App</p>
							<button onClick={() => handleStepNavigation(currentStep)}>
								Next
							</button>
						</>
					)}
					{currentStep === OnboardingSteps.FeastApp && (
						<>
							<p>Feast App</p>
							<button onClick={() => handleStepNavigation(currentStep)}>
								Next
							</button>
						</>
					)}
					{currentStep === OnboardingSteps.ThankYou && (
						<>
							<p>Thank You</p>
						</>
					)}
				</div>
				{/* // --------------------------- // */}
			</ContentBox>
			<ContentBox>Test Content</ContentBox>
		</OnboardingLayout>
	);
}

export default OnboardingComponent;
