import { css } from '@emotion/react';
import { from, space, sport } from '@guardian/source-foundations';
import React from 'react';
import type { ThankYouModuleProps } from 'components/thankYou/thankYouModule';
import ThankYouModule from 'components/thankYou/thankYouModule';

const container = css`
	padding: 0px ${space[3]}px;

	${from.tablet} {
		background-color: ${sport[800]};
		width: 100%;
		padding: 50px;
	}
`;

export default {
	title: 'Checkouts/Thank You Module',
	component: ThankYouModule,
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div css={container}>
				<Story />
			</div>
		),
	],
};

function Template(args: ThankYouModuleProps): JSX.Element {
	return (
		<ThankYouModule
			moduleType={args.moduleType}
			isSignedIn={args.isSignedIn}
			contryGroupId={args.contryGroupId}
		/>
	);
}

Template.args = {} as Record<string, unknown>;

export const DownloadTheAppSignedIn = Template.bind({});

DownloadTheAppSignedIn.args = {
	moduleType: 'downloadTheApp',
	isSignedIn: true,
	contryGroupId: 'GBPCountries',
};

export const DownloadTheAppSignedOut = Template.bind({});

DownloadTheAppSignedOut.args = {
	moduleType: 'downloadTheApp',
	isSignedIn: false,
	contryGroupId: 'GBPCountries',
};

export const ShareYourSupport = Template.bind({});

ShareYourSupport.args = {
	moduleType: 'shareSupport',
	isSignedIn: true,
	contryGroupId: 'GBPCountries',
};
