import { css } from '@emotion/react';
import { from, space, sport } from '@guardian/source-foundations';
import { Column, Columns, Container } from '@guardian/source-react-components';
import React from 'react';
import { Provider } from 'react-redux';
import { createTestStoreForContributions } from '__test-utils__/testStore';
import AppDownloadBadges from 'components/thankYou/appDownload/AppDownloadBadges';
import {
	AppDownloadBodyCopy,
	appDownloadHeader,
} from 'components/thankYou/appDownload/appDownloadItems';
import {
	ausMapBodyCopy,
	AusMapCTA,
	ausMapHeader,
} from 'components/thankYou/ausMap/ausMapItems';
import {
	FeedbackBodyCopy,
	FeedbackCTA,
	getFeedbackHeader,
} from 'components/thankYou/feedback/FeedbackItems';
import ThankYouMarketingConsentCTA, {
	ThankYouMarketingConsentBodyCopy,
} from 'components/thankYou/marketingConsent/marketingConsentItems';
import {
	SignInBodyCopy,
	SignInCTA,
	signInHeader,
} from 'components/thankYou/signIn/signInItems';
import {
	SignUpBodyCopy,
	signUpHeader,
} from 'components/thankYou/signUp/signUpItems';
import {
	getSocialShareCopy,
	socialShareHeader,
	SocialShareIcons,
} from 'components/thankYou/socialShare/SocialShareItems';
import {
	SupportReminderBodyCopy,
	SupportReminderCTAandPrivacy,
} from 'components/thankYou/supportReminder/supportReminderItems';
import type { ThankYouModuleProps } from 'components/thankYou/thankYouModule';
import ThankYouModule from 'components/thankYou/thankYouModule';
import { getThankYouModuleIcon } from 'components/thankYou/thankYouModuleIcons';

const container = css`
	padding: ${space[9]}px 0;

	${from.tablet} {
		background-color: ${sport[800]};
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
Template.decorators = [] as unknown[];

export const DownloadTheAppSignedIn = Template.bind({});

DownloadTheAppSignedIn.args = {
	moduleType: 'appDownload',
	isSignedIn: true,
	icon: getThankYouModuleIcon('appDownload'),
	header: appDownloadHeader,
	bodyCopy: <AppDownloadBodyCopy />,
	ctas: <AppDownloadBadges countryGroupId={'GBPCountries'} />,
};

export const DownloadTheAppSignedOut = Template.bind({});

DownloadTheAppSignedOut.args = {
	moduleType: 'appDownload',
	isSignedIn: false,
	icon: getThankYouModuleIcon('appDownload'),
	header: appDownloadHeader,
	bodyCopy: <AppDownloadBodyCopy />,
	ctas: <AppDownloadBadges countryGroupId={'GBPCountries'} />,
};

export const ShareYourSupport = Template.bind({});

ShareYourSupport.args = {
	moduleType: 'socialShare',
	isSignedIn: true,
	icon: getThankYouModuleIcon('socialShare'),
	header: socialShareHeader,
	bodyCopy: getSocialShareCopy('GB'),
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
	header: getFeedbackHeader('GB', false),
	bodyCopy: (
		<FeedbackBodyCopy countryId={'GB'} feedbackSurveyHasBeenCompleted={false} />
	),
	ctas: <FeedbackCTA countryId={'GB'} />,
};

Feedback.decorators = [
	(Story: React.FC): JSX.Element => {
		const store = createTestStoreForContributions();

		return (
			<Provider store={store}>
				<Story />
			</Provider>
		);
	},
];

export const SignUp = Template.bind({});

SignUp.args = {
	moduleType: 'signUp',
	isSignedIn: false,
	icon: getThankYouModuleIcon('signUp'),
	header: signUpHeader,
	bodyCopy: <SignUpBodyCopy />,
	ctas: null,
};

export const SignIn = Template.bind({});

SignIn.args = {
	moduleType: 'signIn',
	isSignedIn: false,
	icon: getThankYouModuleIcon('signIn'),
	header: signInHeader,
	bodyCopy: <SignInBodyCopy />,
	ctas: <SignInCTA email={''} csrf={{ token: undefined }} />,
};

SignIn.decorators = [
	(Story: React.FC): JSX.Element => {
		const store = createTestStoreForContributions();

		return (
			<Provider store={store}>
				<Story />
			</Provider>
		);
	},
];

export const AusMap = Template.bind({});

AusMap.args = {
	moduleType: 'ausMap',
	isSignedIn: true,
	icon: getThankYouModuleIcon('ausMap'),
	header: ausMapHeader,
	bodyCopy: ausMapBodyCopy,
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
		/>
	),
};

MarketingConsent.decorators = [
	(Story: React.FC): JSX.Element => {
		const store = createTestStoreForContributions();

		return (
			<Provider store={store}>
				<Story />
			</Provider>
		);
	},
];

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
		/>
	),
	ctas: (
		<SupportReminderCTAandPrivacy
			email={''}
			supportReminderState={{
				hasBeenCompleted: false,
				selectedChoiceIndex: 0,
				errorMessage: '',
			}}
		/>
	),
};

SupportReminder.decorators = [
	(Story: React.FC): JSX.Element => {
		const store = createTestStoreForContributions();

		return (
			<Provider store={store}>
				<Story />
			</Provider>
		);
	},
];
