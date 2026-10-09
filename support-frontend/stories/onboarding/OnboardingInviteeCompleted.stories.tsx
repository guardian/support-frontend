import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type React from 'react';
import { OnboardingInviteeCompleted } from 'components/onboarding/sections/onboardingInviteeCompleted';
import { AbParticipationsProvider } from 'contexts/AbParticipationsContext';
import { fallBackLandingPageSelection } from 'helpers/abTests/landingPageAbTests';
import type { OnboardingInviteeInvitation } from 'helpers/onboardingInvitee/invitation';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

const mockInvitation: OnboardingInviteeInvitation = {
	invitationCode: 'test-invitation',
	email: 'invitee@jontho.com',
	inviterFirstName: 'Jontho',
};

export default {
	title: 'Onboarding/OnboardingInviteeCompleted',
	component: OnboardingInviteeCompleted,
	decorators: [
		(Story: React.FC): JSX.Element => (
			<AbParticipationsProvider
				participations={{ multipleAccounts: 'control' }}
			>
				<div style={{ maxWidth: '600px', margin: '40px auto' }}>
					<Story />
				</div>
			</AbParticipationsProvider>
		),
		withSourceReset,
	],
	parameters: {
		layout: 'fullscreen',
	},
};

export const Default = {
	args: {
		invitation: mockInvitation,
		landingPageSettings: fallBackLandingPageSelection,
		supportRegionId: SupportRegionId.UK,
	},
};
