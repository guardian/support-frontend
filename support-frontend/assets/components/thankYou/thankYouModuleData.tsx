import { Button } from '@guardian/source-react-components';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import AppDownloadBadges from './downloadTheApp/AppDownloadBadges';
import type { ThankYouModuleType } from './thankYouModule';
import { getThankYouModuleIcon } from './thankYouModuleIcons';

type ThankYouModuleData = {
	icon: JSX.Element;
	header: string;
	bodyCopy: string;
	ctas: JSX.Element;
};

export const getThankYouModuleData = (
	countryGroupId: CountryGroupId,
): Record<ThankYouModuleType, ThankYouModuleData> => {
	const thankYouModuleData: Record<ThankYouModuleType, ThankYouModuleData> = {
		appDownload: {
			icon: getThankYouModuleIcon('appDownload'),
			header: 'Download the Guardian app',
			bodyCopy: 'Unlock full access to our quality news app today',
			ctas: <AppDownloadBadges countryGroupId={countryGroupId} />,
		},

		//////////////////////
		// PLACEHOLDER DATA //
		//////////////////////
		feedback: {
			icon: getThankYouModuleIcon('feedback'),
			header: 'Send us your thoughts',
			bodyCopy:
				'We would love to hear more about your experience of supporting the Guardian today. Please fill out this short form – it only takes a minute.',
			ctas: <Button>Provide Feedback</Button>,
		},
		socialShare: {
			icon: <p>Social Share Icon</p>,
			header: 'Social Share Heading',
			bodyCopy: 'Body Copy',
			ctas: <p>icons</p>,
		},
		continueToAccount: {
			icon: <p>Continue To Account</p>,
			header: 'Continue To Account Heading',
			bodyCopy: 'Body Copy',
			ctas: <Button>Continue</Button>,
		},
		newsletters: {
			icon: <p>Newsletters</p>,
			header: 'Newsletters Heading',
			bodyCopy: 'Body Copy',
			ctas: <Button>Continue</Button>,
		},
		supportReminder: {
			icon: <p>Support Reminder</p>,
			header: 'CSupport Reminder Heading',
			bodyCopy: 'Body Copy',
			ctas: <Button>Continue</Button>,
		},
	};

	return thankYouModuleData;
};
