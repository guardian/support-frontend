import { css } from '@emotion/react';

const container = css`
	display: flex;
	align-items: center;
`;

const imgHeight = 40;

const googlePlayImg = css`
	// According to the Google Play Badge Guidelines: https://play.google.com/intl/en_us/badges/
	// There must be clear space surrounding the badge equal to one-quarter the height of the badge
	// This clear space has been baked into the image, so we must work around it as follows:

	height: ${imgHeight * 1.5}px;
	width: auto;
	margin-left: -${imgHeight * 0.25}px;
`;

const appStoreImg = css`
	height: ${imgHeight}px;
	width: auto;
`;

function AppDownloadBadges(): JSX.Element {
	return (
		<div css={container}>
			{/* Google Play */}
			<a href="https://play.google.com/store/apps/details?id=com.guardian&hl=en_GB&gl=US&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
				<img
					alt="Get it on Google Play"
					src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
					css={googlePlayImg}
				/>
			</a>
			{/* App Store */}
			<a href="https://apps.apple.com/gb/app/the-guardian-live-world-news/id409128287?itsct=apps_box_badge&amp;itscg=30200">
				<img
					src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1295395200&h=5d04f8512e72f9edf165c49777299f49"
					alt="Download on the App Store"
					css={appStoreImg}
				/>
			</a>
		</div>
	);
}

export default AppDownloadBadges;
