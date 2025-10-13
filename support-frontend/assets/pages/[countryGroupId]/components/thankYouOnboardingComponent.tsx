import { css } from '@emotion/react';
import { neutral, space } from '@guardian/source/foundations';
import { Container } from '@guardian/source/react-components';
import { FooterWithContents } from '@guardian/source-development-kitchen/react-components';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { useEffect, useMemo, useState } from 'react';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import { fetchJson } from 'helpers/async/fetch';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type { ActiveProductKey, ActiveRatePlanKey } from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import type { UserType } from 'helpers/redux/checkout/personalDetails/state';
import * as cookie from 'helpers/storage/cookie';
import { getUser } from 'helpers/user/user';


const onboardingContainer = css`
	background-color: ${neutral[97]};
	padding: ${space[4]}px 0;
	min-height: 400px;
`;

const contentStyle = css`
	text-align: center;
	padding: ${space[6]}px ${space[3]}px;
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

type ThankYouOnboardingProps = {
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
};

enum OnboardingSteps {
	Summary = 'summary',
	GuardianApp = 'guardian-app',
	FeastApp = 'feast-app',
	ThankYou = 'thank-you',
}

function ThankYouOnboardingComponent({
	supportRegionId,
	payment,
	productKey,
	ratePlanKey,
	promotion,
	landingPageSettings,
	identityUserType,
}: ThankYouOnboardingProps) {
	const user = getUser();

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

	const [currentStep, setCurrentStep] = useState<OnboardingSteps>();
	const [hasMobileAppDownloaded, setHasMobileAppDownloaded] = useState(false);
	const [hasFeastMobileAppDownloaded, setHasFeastMobileAppDownloaded] = useState(false);

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

	useEffect(() => {
		const COOKIE_NAME = 'GU_user_analytics_profile';
		const COOKIE_TTL_DAYS = 1;

		const loadAnalyticsData = async () => {
			if (!user.isSignedIn) {
				return;
			}

            const cachedData = cookie.get(COOKIE_NAME);
			
			if (cachedData) {
				try {
					const parsedData = JSON.parse(cachedData) as {
						hasMobileAppDownloaded?: boolean;
						hasFeastMobileAppDownloaded?: boolean;
					};
					
					setHasMobileAppDownloaded(parsedData.hasMobileAppDownloaded ?? false);
					setHasFeastMobileAppDownloaded(parsedData.hasFeastMobileAppDownloaded ?? false);
					return;
				} catch (error) {
					console.error('Error parsing cached analytics data:', error);
				    cookie.set(COOKIE_NAME, '', -1);
				}
			}

			try {
				const response = await fetchJson<{
					identityId: string;
					status: string;
					message: string;
					hasMobileAppDownloaded: boolean;
					hasFeastMobileAppDownloaded: boolean;
				}>('/analytics-user-profile', {
					mode: 'cors',
					credentials: 'include',
				});
				
				setHasMobileAppDownloaded(response.hasMobileAppDownloaded);
				setHasFeastMobileAppDownloaded(response.hasFeastMobileAppDownloaded);
				
				const dataToCache = {
					hasMobileAppDownloaded: response.hasMobileAppDownloaded,
					hasFeastMobileAppDownloaded: response.hasFeastMobileAppDownloaded,
					timestamp: Date.now()
				};
				
				try {
                    const cookieValue = JSON.stringify(dataToCache);
                    cookie.set(COOKIE_NAME, cookieValue, COOKIE_TTL_DAYS);
				} catch (cookieError) {
					console.error('Error setting cookie:', cookieError);
				}
			} catch (error) {
				console.error('Error calling Analytics endpoint:', error);
			}
		};

		void loadAnalyticsData();
	}, [user.isSignedIn]);

	return (
		<PageScaffold
			header={<Header />}
			footer={
				<FooterWithContents>
					<></>
				</FooterWithContents>
			}
		>
			<div css={onboardingContainer}>
				<Container>
					<div css={contentStyle}>
						<h1 css={headingStyle}>
							Welcome to your new onboarding experience!
						</h1>
						<p css={textStyle}>
							Thank you for supporting The Guardian. This is a new onboarding
							flow for region: <strong>{supportRegionId}</strong>
						</p>

                        {/* TODO: Improve on this placeholder navigation */}
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
				</Container>
			</div>
		</PageScaffold>
	);
};

export default ThankYouOnboardingComponent;
