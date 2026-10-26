import type React from 'react';
import { useRef } from 'react';
import { OnboardingCreateAccount } from 'components/onboarding/sections/createAccount';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Onboarding/CreateAccount',
	component: OnboardingCreateAccount,
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

function CreateAccountStory({ showIframe }: { showIframe: boolean }) {
	const iframeRef = useRef<HTMLIFrameElement>(null);

	return (
		<OnboardingCreateAccount
			iframeRef={iframeRef}
			iframeSrc="about:blank"
			showIframe={showIframe}
			handleStepNavigation={() => {}}
			csrf={{ token: 'storybook-csrf-token' }}
			userNewslettersSubscriptions={null}
		/>
	);
}

export const Default = {
	render: () => <CreateAccountStory showIframe={true} />,
};

export const InviteeRegistered = {
	render: () => <CreateAccountStory showIframe={false} />,
};
