import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type React from 'react';
import { OnboardingInviteeCompleted } from 'components/onboarding/sections/onboardingInviteeCompleted';
import { fallBackLandingPageSelection } from 'helpers/abTests/landingPageAbTests';
import { resolveInvitation } from 'helpers/onboardingInvitee/invitation';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Onboarding/OnboardingInviteeCompleted',
	component: OnboardingInviteeCompleted,
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
		invitation: resolveInvitation('test-invitation'),
		landingPageSettings: fallBackLandingPageSelection,
		supportRegionId: SupportRegionId.UK,
	},
};
