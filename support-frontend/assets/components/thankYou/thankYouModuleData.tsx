import { useState } from 'react';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import {
	setThankYouFeedbackSurveyHasBeenCompleted,
	setThankYouSupportReminder,
} from 'helpers/redux/checkout/thankYouState/actions';
import type { ThankYouSupportReminderState } from 'helpers/redux/checkout/thankYouState/state';
import { useContributionsDispatch } from 'helpers/redux/storeHooks';
import {
	OPHAN_COMPONENT_ID_AUS_MAP,
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

const defaultSupportReminder = {
	selectedChoiceIndex: 0,
	hasBeenCompleted: false,
	errorMessage: '',
};
const defaultFeedbackSurveyHasBeenCompleted = false;

export const getThankYouModuleData = (
	countryId: IsoCountry,
	countryGroupId: CountryGroupId,
	csrf: CsrfState,
	email: string,
	isOneOff: boolean,
	amountIsAboveThreshold: boolean,
	campaignCode?: string,
	supportReminder?: ThankYouSupportReminderState,
	feedbackSurveyHasBeenCompleted?: boolean,
): Record<ThankYouModuleType, ThankYouModuleData> => {
	const initialFeedbackSurveyHasBeenCompleted =
		feedbackSurveyHasBeenCompleted ?? defaultFeedbackSurveyHasBeenCompleted;
	const [feedbackSurveyCompleted, setFeedbackSurveyCompleted] =
		useState<boolean>(initialFeedbackSurveyHasBeenCompleted);
	const [supportRemind, setSupportRemind] =
		useState<ThankYouSupportReminderState>(
			supportReminder ?? defaultSupportReminder,
		);

	const getFeedbackSurveyLink = (countryId: IsoCountry) => {
		const surveyBasePath = 'https://guardiannewsandmedia.formstack.com/forms/';
		if (countryId === 'AU') {
			return `${surveyBasePath}guardian_australia_message`;
		}
		if (isOneOff) {
			return `${surveyBasePath}guardian_supporter_single`;
		}
		return `${surveyBasePath}${
			amountIsAboveThreshold
				? 'guardian_supporter_above'
				: 'guardian_supporter_below'
		}`;
	};

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
			header: getFeedbackHeader(feedbackSurveyCompleted),
			bodyCopy: (
				<FeedbackBodyCopy
					feedbackSurveyHasBeenCompleted={feedbackSurveyCompleted}
				/>
			),
			ctas: feedbackSurveyCompleted ? null : (
				<FeedbackCTA
					feedbackSurveyLink={getFeedbackSurveyLink(countryId)}
					onClick={() => {
						setFeedbackSurveyCompleted(true);
						if (feedbackSurveyHasBeenCompleted) {
							const dispatch = useContributionsDispatch();
							dispatch(setThankYouFeedbackSurveyHasBeenCompleted(true));
						}
					}}
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
			header: supportRemind.hasBeenCompleted
				? 'Your support reminder is set'
				: 'Set a support reminder',
			bodyCopy: (
				<SupportReminderBodyCopy
					supportReminderState={supportRemind}
					onChange={(index) => {
						setSupportRemind({
							...supportRemind,
							selectedChoiceIndex: index,
						});
						if (supportReminder) {
							const dispatch = useContributionsDispatch();
							dispatch(
								setThankYouSupportReminder({
									...supportRemind,
									selectedChoiceIndex: index,
								}),
							);
						}
					}}
				/>
			),
			ctas: supportRemind.hasBeenCompleted ? null : (
				<SupportReminderCTAandPrivacy
					email={email}
					supportReminderState={supportRemind}
					onClick={() => {
						setSupportRemind({
							...supportRemind,
							hasBeenCompleted: true,
						});
						if (supportReminder) {
							const dispatch = useContributionsDispatch();
							dispatch(
								setThankYouSupportReminder({
									...supportRemind,
									hasBeenCompleted: true,
								}),
							);
						}
					}}
				/>
			),
		},
	};

	return thankYouModuleData;
};
