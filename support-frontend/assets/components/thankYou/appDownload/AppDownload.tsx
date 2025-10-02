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

const descriptionStyle = css`
	${textEgyptian15};
	margin-bottom: ${space[1]}px;
	${from.tablet} {
		${textEgyptian17};
	}

	${between.desktop.and.leftCol} {
		max-width: 260px;
		display: block;
	}
`;

const ctaContainerApps = css`
	margin-top: ${space[4]}px;
	padding-bottom: 32px;

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

const headingCss = css`
	font-weight: 700;
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
					<div css={bodyApps} key={index}>
						<div css={bodyStyle}>
							<h2 css={headingCss}>{header}</h2>
							<p css={descriptionStyle}>{description}</p>
							<div css={[ctaContainerApps]}>
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
