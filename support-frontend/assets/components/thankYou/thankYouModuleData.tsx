import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { useState } from 'react';
import { CheckList, type CheckListData } from 'components/checkList/checkList';
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
import {
	formatMachineDate,
	formatUserDate,
} from 'helpers/utilities/dateConversions';
import { getWeeklyDays } from 'pages/weekly-subscription-checkout/helpers/deliveryDays';
import AppDownloadBadges, {
	AppDownloadBadgesEditions,
} from './appDownload/AppDownloadBadges';
import {
	AppDownloadBodyCopy,
	AppDownloadEditionsBodyCopy,
	appDownloadEditionsHeader,
	appDownloadHeader,
	AppFeastDownloadBodyCopy,
	appFeastDownloadHeader,
	AppNewsDownloadBodyCopy,
	appNewsDownloadHeader,
	appsDownloadHeader,
	BenefitsBodyCopy,
	benefitsHeader,
	SubscriptionStartBodyCopy,
	subscriptionStartHeader,
} from './appDownload/appDownloadItems';
import { ausMapBodyCopy, AusMapCTA, ausMapHeader } from './ausMap/ausMapItems';
import {
	FeedbackBodyCopy,
	FeedbackCTA,
	getFeedbackHeader,
} from './feedback/FeedbackItems';
import {
	SignedInBodyCopy,
	SignedInCTA,
	signedInHeader,
} from './signedIn/signedInItems';
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
	bodyCopySecond?: string | JSX.Element;
	ctasSecond?: JSX.Element | null;
}

const headingCss = css`
	font-weight: 700;
`;

const checklistCss = css`
	margin-top: ${space[4]}px;
	font-family: 'GuardianTextEgyptian';
`;

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
	isOneOff: boolean,
	amountIsAboveThreshold: boolean,
	email?: string,
	campaignCode?: string,
	isTier3?: boolean,
	checklistData?: CheckListData[],
	supportReminder?: ThankYouSupportReminderState,
	feedbackSurveyHasBeenCompleted?: boolean,
): Record<ThankYouModuleType, ThankYouModuleData> => {
	const initialFeedbackSurveyHasBeenCompleted =
		feedbackSurveyHasBeenCompleted ?? defaultFeedbackSurveyHasBeenCompleted;
	const [feedbackSurveyCompleted, setFeedbackSurveyCompleted] =
		useState<boolean>(initialFeedbackSurveyHasBeenCompleted);
	const [supportReminderCompleted, setSupportReminderCompleted] =
		useState<ThankYouSupportReminderState>(
			supportReminder ?? defaultSupportReminder,
		);

	const days = getWeeklyDays();
	const publicationStartDays = days.filter((day) => {
		const invalidPublicationDates = ['-12-24', '-12-25', '-12-30'];
		const date = formatMachineDate(day);
		return !invalidPublicationDates.some((dateSuffix) =>
			date.endsWith(dateSuffix),
		);
	});

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
		appsDownload: {
			icon: getThankYouModuleIcon('appsDownload'),
			header: appsDownloadHeader,
			bodyCopy: (
				<>
					<h2 css={headingCss}>{appNewsDownloadHeader}</h2>
					<AppNewsDownloadBodyCopy />
				</>
			),
			ctas: <AppDownloadBadges countryGroupId={countryGroupId} />,
			bodyCopySecond: (
				<>
					<h2 css={headingCss}>{appFeastDownloadHeader}</h2>
					<AppFeastDownloadBodyCopy />
				</>
			),
			ctasSecond: (
				<AppDownloadBadges countryGroupId={countryGroupId} isFeast={true} />
			),
		},
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
		benefits: {
			icon: getThankYouModuleIcon('benefits'),
			header: benefitsHeader,
			bodyCopy: (
				<>
					<BenefitsBodyCopy />
					{checklistData && (
						<CheckList
							checkListData={checklistData}
							cssOverrides={checklistCss}
						/>
					)}
				</>
			),
			ctas: null,
		},
		subscriptionStart: {
			icon: getThankYouModuleIcon('subscriptionStart'),
			header: subscriptionStartHeader,
			bodyCopy: (
				<>
					<SubscriptionStartBodyCopy
						startDateGW={formatUserDate(publicationStartDays[0])}
					/>
				</>
			),
			ctas: null,
		},
		signIn: {
			icon: getThankYouModuleIcon('signIn'),
			header: signInHeader(isTier3),
			bodyCopy: <SignInBodyCopy isTier3={isTier3} />,
			ctas: <SignInCTA email={email} csrf={csrf} isTier3={isTier3} />,
			trackComponentLoadId: OPHAN_COMPONENT_ID_SIGN_IN,
		},
		signedIn: {
			icon: getThankYouModuleIcon('signedIn'),
			header: signedInHeader,
			bodyCopy: <SignedInBodyCopy />,
			ctas: <SignedInCTA email={email} csrf={csrf} />,
		},
		signUp: {
			icon: getThankYouModuleIcon('signUp'),
			header: signUpHeader,
			bodyCopy: <SignUpBodyCopy isTier3={isTier3} />,
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
			header: supportReminderCompleted.hasBeenCompleted
				? 'Your support reminder is set'
				: 'Set a support reminder',
			bodyCopy: (
				<SupportReminderBodyCopy
					supportReminderState={supportReminderCompleted}
					onChange={(index) => {
						setSupportReminderCompleted({
							...supportReminderCompleted,
							selectedChoiceIndex: index,
						});
						if (supportReminder) {
							const dispatch = useContributionsDispatch();
							dispatch(
								setThankYouSupportReminder({
									...supportReminderCompleted,
									selectedChoiceIndex: index,
								}),
							);
						}
					}}
				/>
			),
			ctas: supportReminderCompleted.hasBeenCompleted ? null : (
				<SupportReminderCTAandPrivacy
					email={email}
					supportReminderState={supportReminderCompleted}
					onClick={() => {
						setSupportReminderCompleted({
							...supportReminderCompleted,
							hasBeenCompleted: true,
						});
						if (supportReminder) {
							const dispatch = useContributionsDispatch();
							dispatch(
								setThankYouSupportReminder({
									...supportReminderCompleted,
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
