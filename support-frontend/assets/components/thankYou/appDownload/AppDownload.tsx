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
	padding-top: ${space[6]}px;
	&:not(:last-child) {
		padding-bottom: ${space[8]}px;
	}

	${from.tablet} {
		&:not(:first-child) {
			border-top: 1px solid ${neutral[86]};
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

const appStoreBadges = css`
	margin-top: ${space[4]}px;
`;

const headingstyle = css`
	font-weight: 700;
`;

const appIconContainer = css`
	width: 55px;
	${from.mobileLandscape} {
		width: 75px;
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
					{ name, description, appIcon, playStoreUrl, getAppStoreUrl },
					index,
				) => (
					<div css={bodyApps} key={index}>
						<div css={bodyStyle}>
							<h2 css={headingstyle}>{name}</h2>
							<p css={descriptionStyle}>{description}</p>
							<div css={[appStoreBadges]}>
								<AppStoreBadges
									playStoreUrl={playStoreUrl}
									appStoreUrl={getAppStoreUrl(countryGroupId)}
								/>
							</div>
						</div>
						<div css={appIconContainer}>{appIcon}</div>
					</div>
				),
			)}
		</>
	);
}
