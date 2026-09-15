import type React from 'react';
import { OnboardingShareAccess } from 'components/onboarding/sections/shareAccess';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Onboarding/OnboardingShareAccess',
	component: OnboardingShareAccess,
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
	},
};
