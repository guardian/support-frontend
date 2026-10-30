import { InvitationUnavailable } from 'components/onboarding/sections/invitationUnavailable';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Onboarding/InvitationUnavailable',
	component: InvitationUnavailable,
	decorators: [withSourceReset],
	parameters: {
		layout: 'fullscreen',
	},
};

export const Default = {};
