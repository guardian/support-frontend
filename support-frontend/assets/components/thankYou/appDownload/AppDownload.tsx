import { css } from '@emotion/react';
import {
	between,
	from,
	neutral,
	space,
	textEgyptian15,
	textEgyptian17,
} from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { AppStoreBadges } from './AppDownloadBadges';
import { type AppDownload } from './appDownloadItems';


const bodyApps = css`
	display: flex;
	justify-content: space-between;
	margin-top: ${space[6]}px;
`;
const bodyAppsTop = css`
	${from.tablet} {
		&:not(:last-child) {
			border-bottom: 1px solid ${neutral[86]};
		}
	}
`;

const bodyStyle = css`
	max-width: 240px;
	${from.mobileMedium} {
		max-width: 340px;
	}
`;

const bodyCopyStyle = css`
	${textEgyptian15};
	margin-bottom: ${space[1]}px;
	${from.tablet} {
		${textEgyptian17};
	}
`;
const ctaContainerApps = css`
	margin-top: ${space[4]}px;

	// appDownload ctas require margin-top but appsDownload does not
	> div {
		margin-top: 0;
	}
`;

const appContainer = css`
	width: 55px;
	${from.mobileLandscape} {
		width: 75px;
	}
`;

const ctaTop = css`
	padding-bottom: 32px;
`;

const headingCss = css`
	font-weight: 700;
`;

const downloadCopy = css`
	${between.desktop.and.leftCol} {
		max-width: 260px;
		display: block;
	}
`;

export default function AppDownload({
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
					{ header, description, appIcon, playStoreUrl, getAppStoreUrl },
					index,
				) => (
					<div css={[bodyApps, bodyAppsTop]} key={index}>
						<div css={bodyStyle}>
							<h2 css={headingCss}>{header}</h2>
							<p css={bodyCopyStyle}>
								<span css={downloadCopy}>{description}</span>
							</p>
							<div css={[ctaContainerApps, ctaTop]}>
								<AppStoreBadges
									playStoreUrl={playStoreUrl}
									appStoreUrl={getAppStoreUrl(countryGroupId)}
								/>
							</div>
						</div>
						<span css={appContainer}>{appIcon}</span>
					</div>
				),
			)}
		</>
	);
}
