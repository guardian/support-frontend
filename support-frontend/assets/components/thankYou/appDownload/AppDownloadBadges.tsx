import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import {
	OPHAN_COMPONENT_ID_APP_STORE_BADGE,
	OPHAN_COMPONENT_ID_GOOGLE_PLAY_BADGE,
} from 'helpers/thankYouPages/utils/ophan';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import {
	androidAppUrl,
	feastAppUrl,
	getIosAppUrl,
} from 'helpers/urls/externalLinks';
import AppleAppStoreBadge from './badges/AppleAppStoreBadge';
import GooglePlayStoreBadge from './badges/GooglePlayStoreBadge';

const container = css`
	display: flex;
	align-items: center;
	gap: ${space[3]}px;

	${from.tablet} {
		gap: ${space[4]}px;
	}
`;

const responsiveLayoutStyles = css`
	${from.tablet} {
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		a {
			width: 190px;
			background-color: #000;
			border-radius: ${space[2]}px;

			svg {
				margin: 0 auto;
			}
		}
	}
`;

function AppDownloadBadges({
	countryGroupId,
	isFeast,
}: {
	countryGroupId: CountryGroupId;
	isFeast?: boolean;
}): JSX.Element {
	return (
		<div css={container}>
			{/* App Store */}
			<a
				href={isFeast ? feastAppUrl : getIosAppUrl(countryGroupId)}
				target="blank"
				onClick={() => trackComponentClick(OPHAN_COMPONENT_ID_APP_STORE_BADGE)}
				aria-label="Download on the Apple App Store"
			>
				<AppleAppStoreBadge />
			</a>

			{/* Google Play */}
			<a
				href={isFeast ? feastAppUrl : androidAppUrl}
				target="blank"
				onClick={() =>
					trackComponentClick(OPHAN_COMPONENT_ID_GOOGLE_PLAY_BADGE)
				}
				aria-label="Get it on Google Play"
			>
				<GooglePlayStoreBadge />
			</a>
		</div>
	);
}

/* Generic App Store bagdes component */

export function AppStoreBadges({
	playStoreUrl,
	appStoreUrl,
	responsiveLayout = false,
}: {
	playStoreUrl: string;
	appStoreUrl: string;
	responsiveLayout?: boolean;
}) {
	return (
		<div css={[container, responsiveLayout && responsiveLayoutStyles]}>
			{appStoreUrl && (
				<a
					href={appStoreUrl}
					target="blank"
					onClick={() =>
						trackComponentClick(OPHAN_COMPONENT_ID_APP_STORE_BADGE)
					}
					aria-label="Download on the Apple App Store"
				>
					<AppleAppStoreBadge />
				</a>
			)}

			{playStoreUrl && (
				<a
					href={playStoreUrl}
					target="blank"
					onClick={() =>
						trackComponentClick(OPHAN_COMPONENT_ID_GOOGLE_PLAY_BADGE)
					}
					aria-label="Get it on Google Play"
				>
					<GooglePlayStoreBadge />
				</a>
			)}
		</div>
	);
}
export default AppDownloadBadges;
