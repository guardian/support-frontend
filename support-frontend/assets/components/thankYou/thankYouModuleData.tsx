import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import {
	OPHAN_COMPONENT_ID_AUS_MAP,
	OPHAN_COMPONENT_ID_SET_REMINDER,
	OPHAN_COMPONENT_ID_SIGN_IN,
	OPHAN_COMPONENT_ID_SIGN_UP,
	OPHAN_COMPONENT_ID_SOCIAL,
	OPHAN_COMPONENT_ID_SURVEY,
} from 'helpers/thankYouPages/utils/ophan';
import AppDownloadBadges, {
	AppDownloadBadgesEditions,
} from './appDownload/AppDownloadBadges';
import {
	AppDownloadBodyCopy,
	AppDownloadEditionsBodyCopy,
	appDownloadEditionsHeader,
	appDownloadHeader,
} from './appDownload/appDownloadItems';
import { ausMapBodyCopy, AusMapCTA, ausMapHeader } from './ausMap/ausMapItems';
import {
	FeedbackBodyCopy,
	FeedbackCTA,
	getFeedbackHeader,
} from './feedback/FeedbackItems';
import { SignInBodyCopy, SignInCTA, signInHeader } from './signIn/signInItems';
import { SignUpBodyCopy, signUpHeader } from './signUp/signUpItems';
import {
	getSocialShareCopy,
	socialShareHeader,
	SocialShareIcons,
} from './socialShare/SocialShareItems';
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
	countryId: IsoCountry,
	countryGroupId: CountryGroupId,
	csrf: CsrfState,
	email: string,
	isOneOff: boolean,
	amountIsAboveThreshold: boolean,
	campaignCode?: string,
): Record<ThankYouModuleType, ThankYouModuleData> => {
	const { feedbackSurveyHasBeenCompleted, supportReminder } =
		useContributionsSelector((state) => state.page.checkoutForm.thankYou);

	const thankYouModuleData: Record<ThankYouModuleType, ThankYouModuleData> = {
		appDownload: {
			icon: getThankYouModuleIcon('appDownload'),
			header: appDownloadHeader,
			bodyCopy: <AppDownloadBodyCopy />,
			ctas: <AppDownloadBadges countryGroupId={countryGroupId} />,
		},
		appDownloadEditions: {
			icon: getThankYouModuleIcon('appDownload'),
			header: appDownloadEditionsHeader,
			bodyCopy: <AppDownloadEditionsBodyCopy />,
			ctas: <AppDownloadBadgesEditions countryGroupId={countryGroupId} />,
		},
		ausMap: {
			icon: getThankYouModuleIcon('ausMap'),
			header: ausMapHeader,
			bodyCopy: ausMapBodyCopy,
			ctas: <AusMapCTA />,
			trackComponentLoadId: OPHAN_COMPONENT_ID_AUS_MAP,
		},
		feedback: {
			icon: getThankYouModuleIcon('feedback'),
			header: getFeedbackHeader(feedbackSurveyHasBeenCompleted),
			bodyCopy: (
				<FeedbackBodyCopy
					feedbackSurveyHasBeenCompleted={feedbackSurveyHasBeenCompleted}
				/>
			),
			ctas: feedbackSurveyHasBeenCompleted ? null : (
				<FeedbackCTA
					feedbackSurveyLink={
						isOneOff
							? 'https://guardiannewsandmedia.formstack.com/forms/guardian_supporter_single'
							: amountIsAboveThreshold
							? 'https://guardiannewsandmedia.formstack.com/forms/guardian_supporter_above'
							: 'https://guardiannewsandmedia.formstack.com/forms/guardian_supporter_below'
					}
				/>
			),
			trackComponentLoadId: OPHAN_COMPONENT_ID_SURVEY,
		},
		signIn: {
			icon: getThankYouModuleIcon('signIn'),
			header: signInHeader,
			bodyCopy: <SignInBodyCopy />,
			ctas: <SignInCTA email={email} csrf={csrf} />,
			trackComponentLoadId: OPHAN_COMPONENT_ID_SIGN_IN,
		},
		signUp: {
			icon: getThankYouModuleIcon('signUp'),
			header: signUpHeader,
			bodyCopy: <SignUpBodyCopy />,
			ctas: null,
			trackComponentLoadId: OPHAN_COMPONENT_ID_SIGN_UP,
		},
		socialShare: {
			icon: getThankYouModuleIcon('socialShare'),
			header: socialShareHeader,
			bodyCopy: getSocialShareCopy(countryId),
			ctas: (
				<SocialShareIcons countryId={countryId} campaignCode={campaignCode} />
			),
			trackComponentLoadId: OPHAN_COMPONENT_ID_SOCIAL,
		},
		supportReminder: {
			icon: getThankYouModuleIcon('supportReminder'),
			header: supportReminder.hasBeenCompleted
				? 'Your support reminder is set'
				: 'Set a support reminder',
			bodyCopy: (
				<SupportReminderBodyCopy supportReminderState={supportReminder} />
			),
			ctas: supportReminder.hasBeenCompleted ? null : (
				<SupportReminderCTAandPrivacy
					email={email}
					supportReminderState={supportReminder}
				/>
			),
			trackComponentLoadId: OPHAN_COMPONENT_ID_SET_REMINDER,
		},
	};

	return thankYouModuleData;
};
