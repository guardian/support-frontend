import { css } from '@emotion/react';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { androidAppUrl, getIosAppUrl } from 'helpers/urls/externalLinks';
import {
	OPHAN_COMPONENT_ID_APP_STORE_BADGE,
	OPHAN_COMPONENT_ID_GOOGLE_PLAY_BADGE,
} from 'pages/contributions-landing/components/ContributionThankYou/utils/ophan';

const container = css`
	display: flex;
	align-items: center;
`;

const imgHeight = 40;

// According to the Google Play Badge Guidelines: https://play.google.com/intl/en_us/badges/
// There must be clear space surrounding the badge equal to one-quarter the height of the badge
// As the extra space has been baked into the image we must work around it as follows:
const googlePlayLink = css`
	margin-left: -${imgHeight * 0.25}px;
	display: block;
`;

const googlePlayImg = css`
	height: ${imgHeight * 1.5}px;
	width: auto;
	display: block;
`;

const appStoreLink = css`
	padding: ${imgHeight * 0.25}px;
	display: block;
`;

const appStoreImg = css`
	height: ${imgHeight}px;
	width: auto;
	display: block;
`;

function AppDownloadBadges({
	countryGroupId,
}: {
	countryGroupId: CountryGroupId;
}): JSX.Element {
	return (
		<div css={container}>
			{/* Google Play */}
			<a
				href={androidAppUrl}
				target="blank"
				onClick={() =>
					trackComponentClick(OPHAN_COMPONENT_ID_GOOGLE_PLAY_BADGE)
				}
				css={googlePlayLink}
			>
				<img
					alt="Get it on Google Play"
					//////////////////////
					// PLACEHOLDER LINK //
					//////////////////////
					src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
					css={googlePlayImg}
				/>
			</a>

			{/* App Store */}
			<a
				href={getIosAppUrl(countryGroupId)}
				target="blank"
				onClick={() => trackComponentClick(OPHAN_COMPONENT_ID_APP_STORE_BADGE)}
				css={appStoreLink}
			>
				<img
					//////////////////////
					// PLACEHOLDER LINK //
					//////////////////////
					src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1295395200&h=5d04f8512e72f9edf165c49777299f49"
					alt="Download on the App Store"
					css={appStoreImg}
				/>
			</a>
		</div>
	);
}

export default AppDownloadBadges;
