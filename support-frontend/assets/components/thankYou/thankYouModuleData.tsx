import { css } from '@emotion/react';
import { from } from '@guardian/source-foundations';
import { Button } from '@guardian/source-react-components';
import AppDownloadBadges from './moduleComponents/AppDownloadBadges';
import QRCodes from './moduleComponents/QRCodes';
import downloadIcon from './temp/icons/download.png';
import packshotDesktop from './temp/imgs/packshotDesktop.png';
import packshotMob from './temp/imgs/packshotMob.png';
import type { ThankYouModuleType } from './thankYouModule';

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

const iconStyle = css`
	width: 38px;
	height: 38px;

	${from.tablet} {
		width: 42px;
		height: 42px;
	}
`;

interface Images {
	mobile: string;
	desktop: string;
}

type ThankYouModuleData = {
	icon: JSX.Element;
	header: string;
	bodyCopy: string;
	ctas: JSX.Element;
	images?: Images;
	qrCodes?: JSX.Element;
};

const thankYouModuleData: Record<ThankYouModuleType, ThankYouModuleData> = {
	downloadTheApp: {
		icon: <img src={downloadIcon} alt="download" css={iconStyle} />,
		header: 'Download the Guardian app',
		bodyCopy: 'Unlock full access to our quality news app today',
		ctas: <AppDownloadBadges />,
		images: {
			mobile: packshotMob,
			desktop: packshotDesktop,
		},
		qrCodes: <QRCodes />,
	},
	feedback: {
		icon: <p>Feedback Icon</p>,
		header: 'Feedback Heading',
		bodyCopy: 'Body Copy',
		ctas: <FeedbackButton />,
	},
	shareSupport: {
		icon: <p>Share Support Icon</p>,
		header: 'Share Support Heading',
		bodyCopy: 'Body Copy',
		ctas: <SocialIcons />,
	},
};

export const getThankYouModuleData = (
	moduleType: ThankYouModuleType,
): ThankYouModuleData => thankYouModuleData[moduleType];
