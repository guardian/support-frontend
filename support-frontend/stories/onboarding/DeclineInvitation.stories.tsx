import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type React from 'react';
import { MemoryRouter } from 'react-router';
import { OnboardingDeclineInvitation } from 'components/onboarding/sections/declineInvitation';
import { OnboardingInvitationDeclined } from 'components/onboarding/sections/invitationDeclined';
import { fallBackLandingPageSelection } from 'helpers/abTests/landingPageAbTests';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Onboarding/DeclineInvitation',
	decorators: [
		(Story: React.FC): JSX.Element => (
			<MemoryRouter>
				<div style={{ maxWidth: '600px', margin: '40px auto' }}>
					<Story />
				</div>
			</MemoryRouter>
		),
		withSourceReset,
	],
	parameters: {
		layout: 'fullscreen',
	},
};

export const Confirm = {
	render: () => (
		<OnboardingDeclineInvitation
			supportRegionId={SupportRegionId.UK}
			landingPageSettings={fallBackLandingPageSelection}
			handleStepNavigation={() => {}}
			invitationCode="test-invitation"
			csrf={{ token: 'storybook-csrf-token' }}
			onDeclineFailed={() => {}}
		/>
	),
};

export const Declined = {
	render: () => <OnboardingInvitationDeclined />,
};
