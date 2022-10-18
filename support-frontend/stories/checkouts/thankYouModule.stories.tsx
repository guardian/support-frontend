import React from 'react';
import type { ThankYouModuleProps } from 'components/thankYou/thankYouModule';
import ThankYouModule from 'components/thankYou/thankYouModule';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';

export default {
	title: 'Checkouts/Thank You Module',
	component: ThankYouModule,
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div>
				<Story />
			</div>
		),
		withCenterAlignment,
	],
};

function Template(args: ThankYouModuleProps): JSX.Element {
	return (
		<ThankYouModule moduleType={args.moduleType} isSignedIn={args.isSignedIn} />
	);
}

Template.args = {} as Record<string, unknown>;

export const DownloadTheAppSignedIn = Template.bind({});

DownloadTheAppSignedIn.args = {
	moduleType: 'downloadTheApp',
	isSignedIn: true,
};

export const DownloadTheAppSignedOut = Template.bind({});

DownloadTheAppSignedOut.args = {
	moduleType: 'downloadTheApp',
	isSignedIn: false,
};
