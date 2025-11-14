import { css } from '@emotion/react';
import {
	from,
	neutral,
	space,
	textEgyptian15,
	textEgyptian17,
	textSansBold12,
} from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { AppStoreBadges } from './AppDownloadBadges';
import { type AppDownload } from './appDownloadItems';

const bodyApps = css`
	padding-top: ${space[4]}px;
	&:not(:last-child) {
		padding-bottom: ${space[8]}px;
	}

	${from.tablet} {
		&:not(:first-child) {
			border-top: 1px solid ${neutral[86]};
		}
	}
`;

const headingstyle = css`
	font-weight: 700;
`;

const descriptionStyle = css`
	${textEgyptian15};

	${from.tablet} {
		${textEgyptian17};
	}
`;

const downloadLinks = css`
	display: flex;
	justify-content: flex-start;
	margin-top: ${space[6]}px;
	${from.tablet} {
		justify-content: space-evenly;
	}
`;

const qrCode = css`
	display: none;

	${from.tablet} {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
`;

const qrInstrucion = css`
	${textSansBold12};
	text-align: center;
	margin-top: ${space[1]}px;
`;

const verticalSeparator = css`
	${from.tablet} {
		margin-left: ${space[4]}px;
		border-left: 1px solid ${neutral[73]};
	}
`;

export default function AppDownloadWithQRCode({
	apps,
	countryGroupId,
}: {
	apps: AppDownload[];
	countryGroupId: CountryGroupId;
}): JSX.Element {
	return (
		<>
			{apps.map(
				(
					{ title, description, playStoreUrl, getAppStoreUrl, qrCodeImage },
					index,
				) => (
					<div css={bodyApps} key={index}>
						{title && <h2 css={headingstyle}>{title}</h2>}
						<p css={descriptionStyle}>{description}</p>

						<div css={downloadLinks}>
							<AppStoreBadges
								playStoreUrl={playStoreUrl}
								appStoreUrl={getAppStoreUrl(countryGroupId)}
								responsiveLayout={true}
							/>

							<span css={verticalSeparator}></span>
							<div css={qrCode}>
								{qrCodeImage}
								<p css={qrInstrucion}>Scan to get the App</p>
							</div>
						</div>
					</div>
				),
			)}
		</>
	);
}
