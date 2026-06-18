import type React from 'react';
import { OnboardingCompleted } from 'components/onboarding/sections/completed';
import { fallBackLandingPageSelection } from 'helpers/abTests/landingPageAbTests';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Onboarding/OnboardingCompleted',
	component: OnboardingCompleted,
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

export const SupporterPlus = {
	args: {
		productKey: 'SupporterPlus',
		landingPageSettings: fallBackLandingPageSelection,
	},
};
