import Button from 'components/button/button';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import AppDownloadBadges from './appDownload/AppDownloadBadges';
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
		ausMap: {
			icon: <i>icon</i>,
			header: '',
			bodyCopy: '',
			ctas: <Button>Click me</Button>,
		},
		feedback: {
			icon: getThankYouModuleIcon('feedback'),
			header: 'Send us your thoughts',
			bodyCopy:
				'We would love to hear more about your experience of supporting the Guardian today. Please fill out this short form – it only takes a minute.',
			ctas: <Button>Provide Feedback</Button>,
		},
		marketingConsent: {
			icon: <i>icon</i>,
			header: '',
			bodyCopy: '',
			ctas: <Button>Click me</Button>,
		},
		signIn: {
			icon: <i>icon</i>,
			header: '',
			bodyCopy: '',
			ctas: <Button>Click me</Button>,
		},
		signUp: {
			icon: <i>icon</i>,
			header: '',
			bodyCopy: '',
			ctas: <Button>Click me</Button>,
		},
		socialShare: {
			icon: <i>icon</i>,
			header: '',
			bodyCopy: '',
			ctas: <Button>Click me</Button>,
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
