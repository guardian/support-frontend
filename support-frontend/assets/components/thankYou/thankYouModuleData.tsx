import { Button } from '@guardian/source-react-components';
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

type ThankYouModuleData = {
	icon: JSX.Element;
	heading: string;
	bodyCopy: string;
	ctas: JSX.Element;
	img?: JSX.Element;
	qrCodes?: JSX.Element;
};

const thankYouModuleData: Record<ThankYouModuleType, ThankYouModuleData> = {
	downloadTheApp: {
		icon: <p>Download Icon</p>,
		heading: 'Download The App Heading',
		bodyCopy: 'Body Copy',
		ctas: <AppDownloadBadges />,
		img: <p>Placeholder Img</p>,
		qrCodes: <p>QR Codes</p>,
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
