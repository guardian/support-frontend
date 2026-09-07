import type React from 'react';
import { OnboardingInviteeSteps } from 'components/onboarding/onboardingSteps';
import { OnboardingDigitalPlusDiscovery } from 'components/onboarding/sections/digitalPlusDiscovery';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Onboarding/DigitalPlusDiscovery',
	component: OnboardingDigitalPlusDiscovery,
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

export const Default = {
	args: {
		handleStepNavigation: () => {},
		nextStep: OnboardingInviteeSteps.Completed,
		backStep: OnboardingInviteeSteps.GuardianApp,
	},
};
