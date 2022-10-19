import { Button } from '@guardian/source-react-components';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import AppDownloadBadges from './downloadTheApp/AppDownloadBadges';
import AppDownloadImage from './downloadTheApp/AppDownloadImage';
import AppDownloadQRCodes from './downloadTheApp/AppDownloadQRCodes';
import type { ThankYouModuleType } from './thankYouModule';
import { getThankYouModuleIcon } from './thankYouModuleIcons';

function SocialIcons(): JSX.Element {
	return (
		<div>
			<span>fb</span>
			<span>tw</span>
			<span>In</span>
			<span>@</span>
		</div>
	);
}

type ThankYouModuleData = {
	icon: JSX.Element;
	header: string;
	bodyCopy: string;
	ctas: JSX.Element;
	image?: JSX.Element;
	qrCodes?: JSX.Element;
};

export const getThankYouModuleData = (
	moduleType: ThankYouModuleType,
	countryGroupId: CountryGroupId,
): ThankYouModuleData => {
	const thankYouModuleData: Record<ThankYouModuleType, ThankYouModuleData> = {
		downloadTheApp: {
			icon: getThankYouModuleIcon('downloadTheApp'),
			header: 'Download the Guardian app',
			bodyCopy: 'Unlock full access to our quality news app today',
			ctas: <AppDownloadBadges countryGroupId={countryGroupId} />,
			image: <AppDownloadImage />,
			qrCodes: <AppDownloadQRCodes />,
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
		shareSupport: {
			icon: <p>Share Support Icon</p>,
			header: 'Share Support Heading',
			bodyCopy: 'Body Copy',
			ctas: <SocialIcons />,
		},
		continueToAccount: {
			icon: <p>Continue To Account</p>,
			header: 'Continue To Account Heading',
			bodyCopy: 'Body Copy',
			ctas: <Button>Continue</Button>,
		},
	};

	return thankYouModuleData[moduleType];
};
