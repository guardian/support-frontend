import { css } from '@emotion/react';
import { from, space, sport } from '@guardian/source/foundations';
import { Column, Columns, Container } from '@guardian/source/react-components';
import type React from 'react';
import AppDownloadBadges from 'components/thankYou/appDownload/AppDownloadBadges';
import {
	AppDownloadBodyCopy,
	appDownloadHeader,
	AppFeastDownloadBodyCopy,
	appFeastDownloadHeader,
	AppNewsDownloadBodyCopy,
	appNewsDownloadHeader,
	appsDownloadHeader,
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
import { SubscriptionStartItems } from 'components/thankYou/subscriptionStart/subscriptionStartItems';
import {
	SupportReminderBodyCopy,
	SupportReminderCTAandPrivacy,
} from 'components/thankYou/supportReminder/supportReminderItems';
import type { ThankYouModuleProps } from 'components/thankYou/thankYouModule';
import ThankYouModule from 'components/thankYou/thankYouModule';
import { getThankYouModuleIcon } from 'components/thankYou/thankYouModuleIcons';
import { WhatNext } from 'components/thankYou/whatNext/whatNext';
import { ObserverPrint } from 'pages/paper-subscription-landing/helpers/products';

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
						bodyCopySecond={args.bodyCopySecond}
						ctasSecond={args.ctasSecond}
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

export const NewsFeastApps = Template.bind({});
NewsFeastApps.args = {
	moduleType: 'appsDownload',
	isSignedIn: true,
	icon: getThankYouModuleIcon('appsDownload'),
	header: appsDownloadHeader,
	bodyCopy: (
		<>
			<h2>{appNewsDownloadHeader}</h2>
			<AppNewsDownloadBodyCopy />
		</>
	),
	ctas: <AppDownloadBadges countryGroupId={'GBPCountries'} />,
	bodyCopySecond: (
		<>
			<h2>{appFeastDownloadHeader}</h2>
			<AppFeastDownloadBodyCopy />
		</>
	),
	ctasSecond: (
		<AppDownloadBadges countryGroupId={'GBPCountries'} isFeast={true} />
	),
};

export const NewspaperArchiveBenefit = Template.bind({});
NewspaperArchiveBenefit.args = {
	moduleType: 'newspaperArchiveBenefit',
	isSignedIn: true,
	icon: getThankYouModuleIcon('newspaperArchiveBenefit'),
	header: 'Discover your Guardian archives benefit',
	bodyCopy: <>Lorum ipsum</>,
	ctas: null,
};

export const ShareYourSupport = Template.bind({});
ShareYourSupport.args = {
	moduleType: 'socialShare',
	isSignedIn: true,
	icon: getThankYouModuleIcon('socialShare'),
	header: socialShareHeader,
	bodyCopy: getSocialShareCopy('GB'),
	ctas: <SocialShareIcons countryId="GB" campaignCode="Us_eoy_2021" />,
};

export const Feedback = Template.bind({});
Feedback.args = {
	moduleType: 'feedback',
	isSignedIn: true,
	icon: getThankYouModuleIcon('feedback'),
	header: getFeedbackHeader(false),
	bodyCopy: <FeedbackBodyCopy feedbackSurveyHasBeenCompleted={false} />,
	ctas: (
		<FeedbackCTA
			feedbackSurveyLink={
				'https://guardiannewsandmedia.formstack.com/forms/guardian_supporter'
			}
		/>
	),
};

export const SignUp = Template.bind({});
SignUp.args = {
	moduleType: 'signUp',
	isSignedIn: false,
	icon: getThankYouModuleIcon('signUp'),
	header: signUpHeader,
	bodyCopy: <SignUpBodyCopy />,
	ctas: null,
};

export const SignUpTier3 = Template.bind({});
SignUpTier3.args = {
	moduleType: 'signUp',
	isSignedIn: false,
	icon: getThankYouModuleIcon('signUp'),
	header: signUpHeader,
	bodyCopy: <SignUpBodyCopy isTierThree={true} />,
	ctas: null,
};

export const SignIn = Template.bind({});
SignIn.args = {
	moduleType: 'signIn',
	isSignedIn: false,
	icon: getThankYouModuleIcon('signIn'),
	header: signInHeader(),
	bodyCopy: <SignInBodyCopy isGuardianPrint={false} isTierThree={false} />,
	ctas: (
		<SignInCTA email={''} csrf={{ token: undefined }} buttonLabel="Continue" />
	),
};

export const SignInTier3 = Template.bind({});
SignInTier3.args = {
	moduleType: 'signIn',
	isSignedIn: false,
	icon: getThankYouModuleIcon('signIn'),
	header: signInHeader(true),
	bodyCopy: <SignInBodyCopy isTierThree={true} isGuardianPrint={false} />,
	ctas: (
		<SignInCTA email={''} csrf={{ token: undefined }} buttonLabel="Sign in" />
	),
};

export const AusMap = Template.bind({});
AusMap.args = {
	moduleType: 'ausMap',
	isSignedIn: true,
	icon: getThankYouModuleIcon('ausMap'),
	header: ausMapHeader,
	bodyCopy: ausMapBodyCopy,
	ctas: <AusMapCTA />,
};

export const WhatNextGuardianAdLiteNoStartDate = Template.bind({});
WhatNextGuardianAdLiteNoStartDate.args = {
	moduleType: 'whatNext',
	icon: getThankYouModuleIcon('whatNext'),
	header: 'What happens next?',
	bodyCopy: (
		<WhatNext
			productKey="GuardianAdLite"
			ratePlanKey="Monthly"
			currency={'GBP'}
			amount={'5'}
		/>
	),
};

export const WhatNextGuardianAdLiteSignedIn = Template.bind({});
WhatNextGuardianAdLiteSignedIn.args = {
	moduleType: 'whatNext',
	icon: getThankYouModuleIcon('whatNext'),
	header: 'What happens next?',
	bodyCopy: (
		<WhatNext
			productKey="GuardianAdLite"
			ratePlanKey="Monthly"
			currency={'GBP'}
			amount={'5'}
			startDate={'Friday, March 28, 2025'}
			isSignedIn={true}
		/>
	),
};

export const WhatNextGuardianAdLiteSignedOut = Template.bind({});
WhatNextGuardianAdLiteSignedOut.args = {
	moduleType: 'whatNext',
	icon: getThankYouModuleIcon('whatNext'),
	header: 'What happens next?',
	bodyCopy: (
		<WhatNext
			productKey="GuardianAdLite"
			ratePlanKey="Monthly"
			currency={'GBP'}
			amount={'5'}
			startDate={'Friday, March 28, 2025'}
			isSignedIn={false}
		/>
	),
};

export const WhatNextObserverPaper = Template.bind({});
WhatNextObserverPaper.args = {
	moduleType: 'whatNext',
	icon: getThankYouModuleIcon('whatNext'),
	header: 'What happens next?',
	ctas: (
		<WhatNext
			productKey="HomeDelivery"
			ratePlanKey="Monthly"
			currency={'GBP'}
			amount={'20.99'}
			startDate={'Friday, March 28, 2025'}
			isSignedIn={false}
			observerPrint={ObserverPrint.Paper}
		/>
	),
};

export const WhatNextObserverSubsCard = Template.bind({});
WhatNextObserverSubsCard.args = {
	moduleType: 'whatNext',
	icon: getThankYouModuleIcon('whatNext'),
	header: 'What happens next?',
	ctas: (
		<WhatNext
			productKey="SubscriptionCard"
			ratePlanKey="Monthly"
			currency={'GBP'}
			amount={'20.99'}
			startDate={'Friday, March 28, 2025'}
			isSignedIn={false}
			observerPrint={ObserverPrint.SubscriptionCard}
		/>
	),
};

export const WhatNextGuardianWeekly = Template.bind({});
WhatNextGuardianWeekly.args = {
	moduleType: 'whatNext',
	icon: getThankYouModuleIcon('whatNext'),
	header: 'What happens next?',
	ctas: (
		<WhatNext
			productKey="GuardianWeeklyDomestic"
			ratePlanKey="Monthly"
			currency={'GBP'}
			amount={'16.50'}
			startDate={'Friday, March 28, 2025'}
			isSignedIn={false}
		/>
	),
};

export const WhatNextGuardianWeeklyGift = Template.bind({});
WhatNextGuardianWeeklyGift.args = {
	moduleType: 'whatNext',
	icon: getThankYouModuleIcon('whatNext'),
	header: 'What happens next?',
	ctas: (
		<WhatNext
			productKey="GuardianWeeklyDomestic"
			ratePlanKey="OneYearGift"
			currency={'GBP'}
			amount={'198'}
			startDate={'Friday, March 28, 2025'}
			isSignedIn={false}
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

export const SubscriptionStartPaperDelivery = Template.bind({});
SubscriptionStartPaperDelivery.args = {
	icon: getThankYouModuleIcon('subscriptionStart'),
	header: 'When will your subscription start?',
	bodyCopy: (
		<SubscriptionStartItems
			productKey={'NationalDelivery'}
			startDate={'Friday, March 28, 2025'}
		/>
	),
	ctas: null,
};

export const SubscriptionStartPaperSubsCard = Template.bind({});
SubscriptionStartPaperSubsCard.args = {
	icon: getThankYouModuleIcon('subscriptionStart'),
	header: 'When will your subscription start?',
	bodyCopy: (
		<SubscriptionStartItems
			productKey={'SubscriptionCard'}
			startDate={'Friday, March 28, 2025'}
		/>
	),
	ctas: null,
};

export const SubscriptionStartGuardianWeekly = Template.bind({});
SubscriptionStartGuardianWeekly.args = {
	icon: getThankYouModuleIcon('subscriptionStart'),
	header: 'When will your subscription start?',
	bodyCopy: (
		<SubscriptionStartItems
			productKey={'GuardianWeeklyDomestic'}
			startDate={'Friday, March 28, 2025'}
		/>
	),
	ctas: null,
};

export const SubscriptionStartTierThree = Template.bind({});
SubscriptionStartTierThree.args = {
	icon: getThankYouModuleIcon('subscriptionStart'),
	header: 'When will your subscription start?',
	bodyCopy: (
		<SubscriptionStartItems
			productKey={'TierThree'}
			startDate={'Friday, March 28, 2025'}
		/>
	),
	ctas: null,
};
