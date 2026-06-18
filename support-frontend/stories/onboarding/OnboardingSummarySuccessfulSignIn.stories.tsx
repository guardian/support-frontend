import type React from 'react';
import ContentBox from 'components/onboarding/contentBox';
import { OnboardingSummarySuccessfulSignIn } from 'components/onboarding/sections/summary';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Onboarding/OnboardingSummarySuccessfulSignIn',
	component: OnboardingSummarySuccessfulSignIn,
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div style={{ maxWidth: '600px', margin: '40px auto' }}>
				<ContentBox>
					<Story />
				</ContentBox>
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
	userNewslettersSubscriptions: [],
	csrf: { token: 'mock-csrf-token' },
};

export const ExistingUserSignedIn = {
	args: {
		...defaultArgs,
		userState: 'existingUserSignedIn',
	},
};

export const ExistingUserJustSignedIn = {
	args: {
		...defaultArgs,
		userState: 'userSignedIn',
	},
};

export const NewUserJustRegistered = {
	args: {
		...defaultArgs,
		userState: 'userRegistered',
	},
};

export const ExistingUserSignedInWithNewsletterSubscriptions = {
	args: {
		...defaultArgs,
		userState: 'existingUserSignedIn',
		userNewslettersSubscriptions: [{ listId: '6031' }],
	},
};
