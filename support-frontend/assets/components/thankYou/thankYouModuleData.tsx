import { Button } from '@guardian/source-react-components';
import { useState } from 'react';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import AppDownloadBadges from './appDownload/AppDownloadBadges';
import {
	FeedbackCTA,
	getFeedbackBodyCopy,
	getFeedbackHeader,
} from './feedback/FeedbackItems';
import {
	getShareSupportCopy,
	ShareSupportSocialIcons,
} from './shareYourSupport/ShareYourSupportItems';
import type { ThankYouModuleType } from './thankYouModule';
import { getThankYouModuleIcon } from './thankYouModuleIcons';

type ThankYouModuleData = {
	icon: JSX.Element;
	header: string;
	bodyCopy: string | JSX.Element;
	ctas: JSX.Element | null;
};

export const getThankYouModuleData = (
	countryId: IsoCountry,
	countryGroupId: CountryGroupId,
	campaignCode: string,
	createReferralCodes: boolean,
	email: string,
): Record<ThankYouModuleType, ThankYouModuleData> => {
	const [feedbackSurveyHasBeenCompleted, setFeedbackSurveyHasBeenCompleted] =
		useState(false);

	const thankYouModuleData: Record<ThankYouModuleType, ThankYouModuleData> = {
		appDownload: {
			icon: getThankYouModuleIcon('appDownload'),
			header: 'Download the Guardian app',
			bodyCopy: 'Unlock full access to our quality news app today',
			ctas: <AppDownloadBadges countryGroupId={countryGroupId} />,
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
		},
		feedback: {
			icon: getThankYouModuleIcon('feedback'),
			header: getFeedbackHeader(countryId, feedbackSurveyHasBeenCompleted),
			bodyCopy: getFeedbackBodyCopy(countryId, feedbackSurveyHasBeenCompleted),
			ctas: feedbackSurveyHasBeenCompleted ? null : (
				<FeedbackCTA
					countryId={countryId}
					setFeedbackSurveyHasBeenCompleted={setFeedbackSurveyHasBeenCompleted}
				/>
			),
		},

		//////////////////////
		// PLACEHOLDER DATA //
		//////////////////////
		continueToAccount: {
			icon: <p>Continue To Account</p>,
			header: 'Continue To Account Heading',
			bodyCopy: 'Continue To Account Body Copy',
			ctas: <Button>Continue</Button>,
		},
		newsletters: {
			icon: <p>Hear from our newsroom</p>,
			header: 'Hear from our newsroom Heading',
			bodyCopy: 'Hear from our newsroom Body Copy',
			ctas: <Button>Subscribe</Button>,
		},
		supportReminder: {
			icon: <p>Set a support reminder</p>,
			header: 'Set a support reminder Heading',
			bodyCopy: 'Set a support reminder Body Copy',
			ctas: <Button>Set a reminder</Button>,
		},
	};

	return thankYouModuleData;
};
