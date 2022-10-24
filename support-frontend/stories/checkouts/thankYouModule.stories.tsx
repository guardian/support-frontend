import { css } from '@emotion/react';
import { between, from, space, sport } from '@guardian/source-foundations';
import { Column, Columns, Container } from '@guardian/source-react-components';
import React from 'react';
import AppDownloadBadges from 'components/thankYou/appDownload/AppDownloadBadges';
import { AusMapCTA } from 'components/thankYou/ausMap/ausMap';
import { FeedbackCTA } from 'components/thankYou/feedback/FeedbackItems';
import ThankYouMarketingConsentCTA, {
	ThankYouMarketingConsentBodyCopy,
} from 'components/thankYou/marketingConsent/marketingConsentItems';
import {
	SignInBodyCopy,
	SignInCTA,
} from 'components/thankYou/signIn/signInItems';
import { SignUpBodyCopy } from 'components/thankYou/signUp/signUpItems';
import { SocialShareIcons } from 'components/thankYou/socialShare/SocialShareItems';
import { SupportReminderBodyCopy } from 'components/thankYou/supportReminder/supportReminderItems';
import type { ThankYouModuleProps } from 'components/thankYou/thankYouModule';
import ThankYouModule from 'components/thankYou/thankYouModule';
import { getThankYouModuleIcon } from 'components/thankYou/thankYouModuleIcons';

const container = css`
	padding: ${space[9]}px 0;

	${from.tablet} {
		background-color: ${sport[800]};
	}
`;

const downloadCopy = css`
	${between.desktop.and.leftCol} {
		max-width: 260px;
		display: block;
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
	argTypes: {
		moduleType: {
			table: {
				disable: true,
			},
		},
		isSignedIn: {
			table: {
				disable: true,
			},
		},
		icon: {
			table: {
				disable: true,
			},
		},
		header: {
			table: {
				disable: true,
			},
		},
		bodyCopy: {
			table: {
				disable: true,
			},
		},
		ctas: {
			table: {
				disable: true,
			},
		},
	},
};

function Template(args: ThankYouModuleProps): JSX.Element {
	return (
		<Container>
			<Columns collapseUntil="desktop">
				<Column>
					<ThankYouModule
						moduleType={args.moduleType}
						isSignedIn={args.isSignedIn}
						icon={args.icon}
						header={args.header}
						bodyCopy={args.bodyCopy}
						ctas={args.ctas}
					/>
				</Column>
				<Column></Column>
			</Columns>
		</Container>
	);
}

Template.args = {} as Record<string, unknown>;

export const DownloadTheAppSignedIn = Template.bind({});

DownloadTheAppSignedIn.args = {
	moduleType: 'appDownload',
	isSignedIn: true,
	icon: getThankYouModuleIcon('appDownload'),
	header: 'Download the Guardian app',
	bodyCopy: (
		<span css={downloadCopy}>
			Unlock full access to our quality news app today
		</span>
	),
	ctas: <AppDownloadBadges countryGroupId={'GBPCountries'} />,
};

export const DownloadTheAppSignedOut = Template.bind({});

DownloadTheAppSignedOut.args = {
	moduleType: 'appDownload',
	isSignedIn: false,
	icon: getThankYouModuleIcon('appDownload'),
	header: 'Download the Guardian app',
	bodyCopy: (
		<span css={downloadCopy}>
			Unlock full access to our quality news app today
		</span>
	),
	ctas: <AppDownloadBadges countryGroupId={'GBPCountries'} />,
};

export const ShareYourSupport = Template.bind({});

ShareYourSupport.args = {
	moduleType: 'socialShare',
	isSignedIn: true,
	icon: getThankYouModuleIcon('socialShare'),
	header: 'Share your support',
	bodyCopy:
		'Invite your followers to join you and support the Guardian’s open, independent reporting.',
	ctas: (
		<SocialShareIcons
			countryId="GB"
			campaignCode="Us_eoy_2021"
			createReferralCodes={false}
			email=""
		/>
	),
};

export const Feedback = Template.bind({});

Feedback.args = {
	moduleType: 'feedback',
	isSignedIn: true,
	icon: getThankYouModuleIcon('feedback'),
	header: 'Send us your thoughts',
	bodyCopy:
		'We would love to hear more about your experience of supporting the Guardian today. Please fill out this short form – it only takes a minute.',
	ctas: (
		<FeedbackCTA
			countryId={'GB'}
			setFeedbackSurveyHasBeenCompleted={() => null}
		/>
	),
};

export const SignUp = Template.bind({});

SignUp.args = {
	moduleType: 'signUp',
	isSignedIn: false,
	icon: getThankYouModuleIcon('signUp'),
	header: 'Check your inbox',
	bodyCopy: <SignUpBodyCopy />,
	ctas: null,
};

export const SignIn = Template.bind({});

SignIn.args = {
	moduleType: 'signIn',
	isSignedIn: false,
	icon: getThankYouModuleIcon('signIn'),
	header: 'Continue to your account',
	bodyCopy: <SignInBodyCopy />,
	ctas: <SignInCTA email={''} csrf={{ token: undefined }} />,
};

export const AusMap = Template.bind({});

AusMap.args = {
	moduleType: 'ausMap',
	isSignedIn: true,
	icon: getThankYouModuleIcon('ausMap'),
	header: 'Hear from supporters across Australia',
	bodyCopy:
		'Open up our interactive map to see messages from readers in every state. Learn why others chose to support Guardian Australia, and you can send us your thoughts too.',
	ctas: <AusMapCTA />,
};

export const MarketingConsent = Template.bind({});

MarketingConsent.args = {
	moduleType: 'marketingConsent',
	isSignedIn: true,
	icon: getThankYouModuleIcon('marketingConsent'),
	header: 'Hear from our newsroom',
	bodyCopy: (
		<ThankYouMarketingConsentBodyCopy
			marketingConsentState={{
				hasBeenCompleted: false,
				hasConsented: false,
				errorMessage: '',
			}}
			setMarketingConsentState={() => null}
		/>
	),
	ctas: (
		<ThankYouMarketingConsentCTA
			email={''}
			csrf={{ token: undefined }}
			marketingConsentState={{
				hasBeenCompleted: false,
				hasConsented: false,
				errorMessage: '',
			}}
			setMarketingConsentState={() => null}
		/>
	),
};

export const SupportReminder = Template.bind({});

SupportReminder.args = {
	moduleType: 'supportReminder',
	isSignedIn: true,
	icon: getThankYouModuleIcon('supportReminder'),
	header: 'Set a support reminder',
	bodyCopy: (
		<SupportReminderBodyCopy
			supportReminderState={{
				selectedChoiceIndex: 0,
				hasBeenCompleted: false,
				errorMessage: '',
			}}
			setSupportReminderState={() => null}
		/>
	),
	ctas: (
		<ThankYouMarketingConsentCTA
			email={''}
			csrf={{ token: undefined }}
			marketingConsentState={{
				hasBeenCompleted: false,
				hasConsented: false,
				errorMessage: '',
			}}
			setMarketingConsentState={() => null}
		/>
	),
};
