import type React from 'react';
import { OnboardingAppsDiscovery } from 'components/onboarding/sections/appsDiscovery';
import { OnboardingSteps } from 'pages/[countryGroupId]/components/onboardingSteps';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Onboarding/OnboardingAppsDiscovery',
	component: OnboardingAppsDiscovery,
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div style={{ maxWidth: '600px', margin: '40px auto' }}>
				<Story />
			</div>
		),
		withSourceReset,
	],
	parameters: {
		layout: 'fullscreen',
	},
};

const defaultArgs = {
	handleStepNavigation: () => {},
	hasMobileAppDownloaded: false,
	hasFeastMobileAppDownloaded: false,
};

export const GuardianAppNotDownloaded = {
	args: {
		...defaultArgs,
		onboardingStep: OnboardingSteps.GuardianApp,
	},
};

export const GuardianAppAlreadyDownloaded = {
	args: {
		...defaultArgs,
		onboardingStep: OnboardingSteps.GuardianApp,
		hasMobileAppDownloaded: true,
	},
};

export const FeastAppNotDownloaded = {
	args: {
		...defaultArgs,
		onboardingStep: OnboardingSteps.FeastApp,
	},
};

export const FeastAppAlreadyDownloaded = {
	args: {
		...defaultArgs,
		onboardingStep: OnboardingSteps.FeastApp,
		hasFeastMobileAppDownloaded: true,
	},
};
