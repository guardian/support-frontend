import { css } from '@emotion/react';
import {
	from,
	space,
	textEgyptian15,
	textEgyptian17,
} from '@guardian/source/foundations';
import { useState } from 'react';
import {
	BenefitsCheckList,
	type BenefitsCheckListData,
} from 'components/checkoutBenefits/benefitsCheckList';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { ActiveProductKey } from 'helpers/productCatalog';
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
import { manageSubsUrl } from 'helpers/urls/externalLinks';
import type { ObserverPrint } from 'pages/paper-subscription-landing/helpers/products';
import { isPrintProduct } from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/isPrintProduct';
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
} from './appDownload/appDownloadItems';
import { ausMapBodyCopy, AusMapCTA, ausMapHeader } from './ausMap/ausMapItems';
import {
	FeedbackBodyCopy,
	FeedbackCTA,
	getFeedbackHeader,
} from './feedback/FeedbackItems';
import { ActivateSubscriptionReminder } from './guardianAdLite/activateSubscriptionReminder';
import { AddressCta } from './guardianAdLite/addressCta';
import { WhatNext } from './guardianAdLite/whatNext';
import { SignInBodyCopy, SignInCTA, signInHeader } from './signIn/signInItems';
import { SignUpBodyCopy, signUpHeader } from './signUp/signUpItems';
import {
	getSocialShareCopy,
	socialShareHeader,
	SocialShareIcons,
} from './socialShare/SocialShareItems';
import {
	BenefitsBodyCopy,
	benefitsHeader,
	subscriptionStartHeader,
	SubscriptionStartItems,
} from './subscriptionStart/subscriptionStartItems';
import {
	SupportReminderBodyCopy,
	SupportReminderCTAandPrivacy,
} from './supportReminder/supportReminderItems';
import type { ThankYouModuleType } from './thankYouModule';
import { getThankYouModuleIcon } from './thankYouModuleIcons';

export interface ThankYouModuleData {
	header: string;
	bodyCopy: string | JSX.Element;
	ctas: JSX.Element | null;
	icon?: JSX.Element;
	trackComponentLoadId?: string;
	bodyCopySecond?: string | JSX.Element;
	ctasSecond?: JSX.Element | null;
}

const headingCss = css`
	font-weight: 700;
`;

const checklistCss = css`
	margin-top: ${space[4]}px;
	${textEgyptian15}
	${from.tablet} {
		${textEgyptian17}
	}
`;

const strongBold = css`
	strong {
		font-weight: bold;
	}
`;

const defaultSupportReminder = {
	selectedChoiceIndex: 0,
	hasBeenCompleted: false,
	errorMessage: '',
};
const defaultFeedbackSurveyHasBeenCompleted = false;

export const getThankYouModuleData = (
	productKey: ActiveProductKey,
	countryGroupId: CountryGroupId,
	countryId: IsoCountry,
	csrf: CsrfState,
	isOneOff: boolean,
	amountIsAboveThreshold: boolean,
	startDate?: string,
	email?: string,
	campaignCode?: string,
	isTierThree?: boolean,
	checklistData?: BenefitsCheckListData[],
	supportReminder?: ThankYouSupportReminderState,
	feedbackSurveyHasBeenCompleted?: boolean,
	finalAmount?: number,
	returnAddress?: string,
	isSignedIn?: boolean,
	observerPrint?: ObserverPrint,
): Record<ThankYouModuleType, ThankYouModuleData> => {
	const initialFeedbackSurveyHasBeenCompleted =
		feedbackSurveyHasBeenCompleted ?? defaultFeedbackSurveyHasBeenCompleted;
	const [feedbackSurveyCompleted, setFeedbackSurveyCompleted] =
		useState<boolean>(initialFeedbackSurveyHasBeenCompleted);
	const [supportReminderCompleted, setSupportReminderCompleted] =
		useState<ThankYouSupportReminderState>(
			supportReminder ?? defaultSupportReminder,
		);
	const printProduct = isPrintProduct(productKey);

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
						<BenefitsCheckList
							benefitsCheckListData={checklistData}
							cssOverrides={checklistCss}
						/>
					)}
				</>
			),
			ctas: null,
		},
		newspaperArchiveBenefit: {
			icon: getThankYouModuleIcon('newspaperArchiveBenefit'),
			header: 'The Guardian newspaper archive',
			bodyCopy: (
				<>
					Sign in to start exploring more than 200 years of world history with
					our newspaper archive. View digital reproductions of every front page,
					article and advertisement as it was printed in the Guardian from 1821.
				</>
			),
			ctas: null,
		},
		subscriptionStart: {
			icon: getThankYouModuleIcon('subscriptionStart'),
			header: subscriptionStartHeader,
			bodyCopy: (
				<SubscriptionStartItems productKey={productKey} startDate={startDate} />
			),
			ctas: null,
		},
		signIn: {
			icon: getThankYouModuleIcon('signIn'),
			header: signInHeader(isTierThree, observerPrint, printProduct),
			bodyCopy: (
				<SignInBodyCopy
					isTierThree={isTierThree}
					observerPrint={observerPrint}
					isPrintProduct={printProduct}
				/>
			),
			ctas: (
				<SignInCTA
					email={email}
					csrf={csrf}
					isTierThree={isTierThree}
					observerPrint={observerPrint}
				/>
			),
			trackComponentLoadId: OPHAN_COMPONENT_ID_SIGN_IN,
		},
		signUp: {
			icon: getThankYouModuleIcon('signUp'),
			header: signUpHeader,
			bodyCopy: (
				<SignUpBodyCopy
					isTierThree={isTierThree}
					observerPrint={observerPrint}
					isPrintProduct={printProduct}
				/>
			),
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
		whatNext: {
			icon: getThankYouModuleIcon('whatNext'),
			header: 'What happens next?',
			bodyCopy: (
				<WhatNext
					amount={(finalAmount ?? '').toString()}
					startDate={startDate}
					isSignedIn={isSignedIn}
					observerPrint={observerPrint}
					isPrintProduct={printProduct}
				/>
			),
			ctas: null,
		},
		reminderToSignIn: {
			header: 'Important reminder',
			bodyCopy: (
				<p css={strongBold}>
					To enjoy reading the Guardian website with non-personalised
					advertising on all your devices,{' '}
					<strong>
						please remember to sign in on each device or browser session.
					</strong>{' '}
					This will enable you to read with non-personalised advertising no
					matter where you log in.
				</p>
			),
			ctas: null,
		},
		reminderToActivateSubscription: {
			header:
				'Complete your Guardian account for full access to your subscription',
			bodyCopy: <ActivateSubscriptionReminder />,
			ctas: null,
		},
		headlineReturn: {
			header: 'Time to start reading',
			bodyCopy: (
				<p>
					Continue where you left off and return to our site, now with
					non-personalised advertising.
				</p>
			),
			ctas: (
				<AddressCta
					address={returnAddress ?? ''}
					copy={'Head back to the Guardian'}
					hasArrow={true}
				/>
			),
		},
		signInToActivate: {
			header: 'To get started, sign in to activate your subscription',
			bodyCopy: (
				<p>
					To be able to read the Guardian website with non-personalised
					advertising, you must be signed in across all your devices.
				</p>
			),
			ctas: (
				<AddressCta
					address={manageSubsUrl}
					copy={'Sign in to activate your subscription'}
				/>
			),
		},
	};

	return thankYouModuleData;
};
