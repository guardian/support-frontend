import { css } from '@emotion/react';
import { from, space, sport } from '@guardian/source-foundations';
import React from 'react';
import AppDownloadBadges from 'components/thankYou/appDownload/AppDownloadBadges';
import type { ThankYouModuleProps } from 'components/thankYou/thankYouModule';
import ThankYouModule from 'components/thankYou/thankYouModule';
import { getThankYouModuleIcon } from 'components/thankYou/thankYouModuleIcons';

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
			icon={args.icon}
			header={args.header}
			bodyCopy={args.bodyCopy}
			ctas={args.ctas}
		/>
	);
}

Template.args = {} as Record<string, unknown>;

export const DownloadTheAppSignedIn = Template.bind({});

DownloadTheAppSignedIn.args = {
	moduleType: 'appDownload',
	isSignedIn: true,
	icon: getThankYouModuleIcon('appDownload'),
	header: 'Download the Guardian app',
	bodyCopy: 'Unlock full access to our quality news app today',
	ctas: <AppDownloadBadges countryGroupId={'GBPCountries'} />,
};

export const DownloadTheAppSignedOut = Template.bind({});

DownloadTheAppSignedOut.args = {
	moduleType: 'appDownload',
	isSignedIn: false,
	icon: getThankYouModuleIcon('appDownload'),
	header: 'Download the Guardian app',
	bodyCopy: 'Unlock full access to our quality news app today',
	ctas: <AppDownloadBadges countryGroupId={'GBPCountries'} />,
};
