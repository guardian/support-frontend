import { useState } from 'react';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import {
	OPHAN_COMPONENT_ID_AUS_MAP,
	OPHAN_COMPONENT_ID_MARKETING,
	OPHAN_COMPONENT_ID_SET_REMINDER,
	OPHAN_COMPONENT_ID_SIGN_IN,
	OPHAN_COMPONENT_ID_SIGN_UP,
	OPHAN_COMPONENT_ID_SOCIAL,
	OPHAN_COMPONENT_ID_SURVEY,
} from 'pages/contributions-landing/components/ContributionThankYou/utils/ophan';
import AppDownloadBadges from './appDownload/AppDownloadBadges';
import { AusMapCTA } from './ausMap/ausMap';
import {
	FeedbackBodyCopy,
	FeedbackCTA,
	getFeedbackHeader,
} from './feedback/FeedbackItems';
import ThankYouMarketingConsentCTA, {
	ThankYouMarketingConsentBodyCopy,
} from './marketingConsent/marketingConsentItems';
import {
	getShareSupportCopy,
	ShareSupportSocialIcons,
} from './shareYourSupport/ShareYourSupportItems';
import { SignInBodyCopy, SignInCTA } from './signIn/signInItems';
import { SignUpBodyCopy } from './signUp/signUpItems';
import {
	SupportReminderBodyCopy,
	SupportReminderCTAandPrivacy,
} from './supportReminder/supportReminderItems';
import type { ThankYouModuleType } from './thankYouModule';
import { getThankYouModuleIcon } from './thankYouModuleIcons';

interface ThankYouModuleData {
	icon: JSX.Element;
	header: string;
	bodyCopy: string | JSX.Element;
	ctas: JSX.Element | null;
	trackComponentLoadId?: string;
}

export const getThankYouModuleData = (
	countryId: string,
	countryGroupId: CountryGroupId,
	createReferralCodes: boolean,
	csrf: CsrfState,
	email: string,
	campaignCode?: string,
): Record<ThankYouModuleType, ThankYouModuleData> => {
	const [feedbackSurveyHasBeenCompleted, setFeedbackSurveyHasBeenCompleted] =
		useState(false);

	const [marketingConsentState, setMarketingConsentState] = useState({
		hasBeenCompleted: false,
		hasConsented: false,
		errorMessage: '',
	});

	const [supportReminderState, setSupportReminderState] = useState({
		selectedChoiceIndex: 0,
		hasBeenCompleted: false,
		errorMessage: '',
	});

	const thankYouModuleData: Record<ThankYouModuleType, ThankYouModuleData> = {
		appDownload: {
			icon: getThankYouModuleIcon('appDownload'),
			header: 'Download the Guardian app',
			bodyCopy: 'Unlock full access to our quality news app today',
			ctas: <AppDownloadBadges countryGroupId={countryGroupId} />,
		},
		ausMap: {
			icon: getThankYouModuleIcon('ausMap'),
			header: 'Hear from supporters across Australia',
			bodyCopy:
				'Open up our interactive map to see messages from readers in every state. Learn why others chose to support Guardian Australia, and you can send us your thoughts too.',
			ctas: <AusMapCTA />,
			trackComponentLoadId: OPHAN_COMPONENT_ID_AUS_MAP,
		},
		feedback: {
			icon: getThankYouModuleIcon('feedback'),
			header: getFeedbackHeader(countryId, feedbackSurveyHasBeenCompleted),
			bodyCopy: (
				<FeedbackBodyCopy
					countryId={countryId}
					feedbackSurveyHasBeenCompleted={feedbackSurveyHasBeenCompleted}
				/>
			),
			ctas: feedbackSurveyHasBeenCompleted ? null : (
				<FeedbackCTA
					countryId={countryId}
					setFeedbackSurveyHasBeenCompleted={setFeedbackSurveyHasBeenCompleted}
				/>
			),
			trackComponentLoadId: OPHAN_COMPONENT_ID_SURVEY,
		},
		marketingConsent: {
			icon: getThankYouModuleIcon('marketingConsent'),
			header: marketingConsentState.hasBeenCompleted
				? "You're signed up"
				: 'Hear from our newsroom',
			bodyCopy: (
				<ThankYouMarketingConsentBodyCopy
					marketingConsentState={marketingConsentState}
					setMarketingConsentState={setMarketingConsentState}
				/>
			),
			ctas: (
				<ThankYouMarketingConsentCTA
					email={email}
					csrf={csrf}
					marketingConsentState={marketingConsentState}
					setMarketingConsentState={setMarketingConsentState}
				/>
			),
			trackComponentLoadId: OPHAN_COMPONENT_ID_MARKETING,
		},
		signIn: {
			icon: getThankYouModuleIcon('signIn'),
			header: 'Continue to your account',
			bodyCopy: <SignInBodyCopy />,
			ctas: <SignInCTA email={email} csrf={csrf} />,
			trackComponentLoadId: OPHAN_COMPONENT_ID_SIGN_IN,
		},
		signUp: {
			icon: getThankYouModuleIcon('signUp'),
			header: 'Check your inbox',
			bodyCopy: SignUpBodyCopy(),
			ctas: null,
			trackComponentLoadId: OPHAN_COMPONENT_ID_SIGN_UP,
		},
		socialShare: {
			icon: getThankYouModuleIcon('socialShare'),
			header: 'Share your support',
			bodyCopy: getShareSupportCopy(countryId),
			ctas: (
				<ShareSupportSocialIcons
					countryId={countryId}
					campaignCode={campaignCode}
					createReferralCodes={createReferralCodes}
					email={email}
				/>
			),
			trackComponentLoadId: OPHAN_COMPONENT_ID_SOCIAL,
		},
		supportReminder: {
			icon: getThankYouModuleIcon('supportReminder'),
			header: supportReminderState.hasBeenCompleted
				? 'Your support reminder is set'
				: 'Set a support reminder',
			bodyCopy: (
				<SupportReminderBodyCopy
					supportReminderState={supportReminderState}
					setSupportReminderState={setSupportReminderState}
				/>
			),
			ctas: (
				<SupportReminderCTAandPrivacy
					email={email}
					supportReminderState={supportReminderState}
					setSupportReminderState={setSupportReminderState}
				/>
			),
			trackComponentLoadId: OPHAN_COMPONENT_ID_SET_REMINDER,
		},
	};

	return thankYouModuleData;
};
