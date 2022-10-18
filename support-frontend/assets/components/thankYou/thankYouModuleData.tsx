import { Button } from '@guardian/source-react-components';
import QRCodes from './moduleComponents/QRCodes';
import downloadIcon from './temp/icons/download.png';
import packshotDesktop from './temp/imgs/packshotDesktop.png';
import packshotMob from './temp/imgs/packshotMob.png';
import type { ThankYouModuleType } from './thankYouModule';

function AppDownloadBadges(): JSX.Element {
	return (
		<div>
			{/* Google Play */}
			<a href="https://play.google.com/store/apps/details?id=com.guardian&hl=en_GB&gl=US&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
				<img
					alt="Get it on Google Play"
					src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
				/>
			</a>
			{/* App Store */}
			<a
				href="https://apps.apple.com/gb/app/the-guardian-live-world-news/id409128287?itsct=apps_box_badge&amp;itscg=30200"
				style={{
					display: 'inline-block',
					overflow: 'hidden',
					borderRadius: '13px',
					width: '250px',
					height: '83px',
				}}
			>
				<img
					src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1295395200&h=5d04f8512e72f9edf165c49777299f49"
					alt="Download on the App Store"
					style={{ borderRadius: '13px', width: '250px', height: ' 83px' }}
				/>
			</a>
		</div>
	);
}

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

function FeedbackButton(): JSX.Element {
	return <Button>Provide Feedback</Button>;
}

interface Images {
	mobile: JSX.Element;
	desktop: JSX.Element;
}

type ThankYouModuleData = {
	icon: JSX.Element;
	heading: string;
	bodyCopy: string;
	ctas: JSX.Element;
	images?: Images;
	qrCodes?: JSX.Element;
};

const thankYouModuleData: Record<ThankYouModuleType, ThankYouModuleData> = {
	downloadTheApp: {
		icon: <img src={downloadIcon} alt="download" />,
		heading: 'Download the Guardian app',
		bodyCopy: 'Unlock full access to our quality news app today',
		ctas: <AppDownloadBadges />,
		images: {
			mobile: <img src={packshotMob} alt="download" />,
			desktop: <img src={packshotDesktop} alt="download" />,
		},
		qrCodes: <QRCodes />,
	},
	feedback: {
		icon: <p>Feedback Icon</p>,
		heading: 'Feedback Heading',
		bodyCopy: 'Body Copy',
		ctas: <FeedbackButton />,
	},
	shareSupport: {
		icon: <p>Share Support Icon</p>,
		heading: 'Share Support Heading',
		bodyCopy: 'Body Copy',
		ctas: <SocialIcons />,
	},
};

export const getThankYouModuleData = (
	moduleType: ThankYouModuleType,
): ThankYouModuleData => thankYouModuleData[moduleType];
