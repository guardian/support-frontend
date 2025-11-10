import { css } from '@emotion/react';
import {
	between,
	from,
	neutral,
	space,
	textEgyptian15,
	textEgyptian17,
	textEgyptianBold17,
	until,
} from '@guardian/source/foundations';
import { useEffect } from 'react';
import AppImageGuardianNews from 'components/svgs/appGuardianNews';
import AppImageFeast from 'components/svgs/appImageFeast';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import AppDownloadImage from './appDownload/AppDownloadImage';
import AppDownloadQRCodes from './appDownload/AppDownloadQRCodes';
import NewspaperArchiveImage from './newspaperArchive/newspaperArchiveImage';

const container = css`
	background: white;
	padding-left: 10px;
	padding-right: 10px;
	padding-top: ${space[2]}px;
	padding-bottom: ${space[5]}px;
	border-bottom: 1px solid ${neutral[86]};
	break-inside: avoid;
	:not(:first-child) {
		margin-top: ${space[4]}px;
	}

	${from.tablet} {
		max-width: 620px;
		padding-left: ${space[4]}px;
		padding-right: 0px;
		border: 1px solid ${neutral[86]};
	}
`;

const defaultGridContainer = css`
	display: grid;
	grid-column-gap: ${space[3]}px;
	grid-template-columns: min-content 1fr;
	grid-template-areas:
		'icon header'
		'body body';

	${from.tablet} {
		grid-template-areas:
			'icon header'
			'---- body';
	}
`;

const defaultContainerNoIcon = css`
	margin: ${space[3]}px ${space[2]}px;
	${until.tablet} {
		margin-top: ${space[0]}px;
	}
`;

const imageryAndQrCodesGridContainer = css`
	display: grid;
	grid-column-gap: ${space[3]}px;
	grid-template-columns: min-content 1fr;
	grid-template-areas:
		'icon header'
		'body body'
		'img img';

	${from.tablet} {
		grid-template-columns: min-content 270px 1fr;
		grid-template-areas:
			'icon header img'
			'---- body img'
			'---- qrCodes qrCodes';
	}

	${between.desktop.and.leftCol} {
		grid-template-areas:
			'icon header header'
			'---- body body'
			'---- qrCodes qrCodes';
	}
`;

const iconContainer = css`
	grid-area: icon;
	display: flex;
	align-self: center;

	svg {
		display: block;
	}

	${from.tablet} {
		display: block;
	}
`;

const headerContainer = css`
	grid-area: header;
	${textEgyptianBold17};
	align-self: center;

	${from.desktop} {
		font-size: 20px;
		margin-top: 2px;
	}
`;
const bodyContainer = css`
	grid-area: body;
`;
const sizeContainer = css`
	z-index: 1;
	${between.tablet.and.desktop} {
		width: 330px;
	}
	${between.leftCol.and.wide} {
		width: 330px;
	}
	${from.wide} {
		width: 350px;
	}
`;

const bodyApps = css`
	display: flex;
	justify-content: space-between;
	margin-top: ${space[6]}px;
`;
const bodyAppsTop = css`
	${from.tablet} {
		border-bottom: 1px solid ${neutral[86]};
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
const bodyCopyMarginTop = css`
	margin-top: ${space[3]}px;
	${from.tablet} {
		margin-top: ${space[2]}px;
	}
`;

const appContainer = css`
	width: 55px;
	${from.mobileLandscape} {
		width: 75px;
	}
`;

const imgContainer = css`
	grid-area: img;
	align-self: flex-end;
`;

const sizeImgContainer = css`
	margin-top: ${space[2]}px;
	${until.tablet} {
		margin-top: ${space[4]}px;
	}
`;

const qrCodesContainer = css`
	${from.tablet} {
		grid-area: qrCodes;
		margin-top: ${space[5]}px;
		margin-right: ${space[5]}px;
		padding-top: 30px;
		border-top: 1px solid ${neutral[86]};
	}
`;

const paddingRight = css`
	${from.tablet} {
		padding-right: 54px;
	}
`;
const paddingRightApps = css`
	${from.tablet} {
		padding-right: ${space[4]}px;
	}
`;

const imageryStyle = css`
	overflow: hidden;

	${until.tablet} {
		padding-bottom: 0;
	}
`;

const hideBelowTablet = css`
	display: none;

	${from.tablet} {
		display: block;
	}
`;

const ctaContainerApps = css`
	margin-top: ${space[4]}px;

	// appDownload ctas require margin-top but appsDownload does not
	> div {
		margin-top: 0;
	}
`;
const ctaTop = css`
	padding-bottom: 32px;
`;

const ctaBottom = css`
	padding-bottom: ${space[4]}px;
`;

export const TEST_ID_PREFIX = 'tyModule';

export type ThankYouModuleType =
	| 'appDownload'
	| 'appsDownload'
	| 'appDownloadEditions'
	| 'ausMap'
	| 'feedback'
	| 'signIn'
	| 'signUp'
	| 'socialShare'
	| 'supportReminder'
	| 'benefits'
	| 'subscriptionStart'
	| 'newspaperArchiveBenefit'
	| 'whatNext'
	| 'reminderToSignIn'
	| 'reminderToActivateSubscription'
	| 'headlineReturn'
	| 'signInToActivate';

export interface ThankYouModuleProps {
	header: string;
	bodyCopy: JSX.Element | string;
	ctas: JSX.Element | null;
	moduleType: ThankYouModuleType;
	icon?: JSX.Element;
	isSignedIn?: boolean;
	trackComponentLoadId?: string;
	bodyCopySecond?: JSX.Element | string;
	ctasSecond?: JSX.Element | null;
}

function ThankYouModule({
	moduleType,
	isSignedIn,
	icon,
	header,
	bodyCopy,
	ctas,
	trackComponentLoadId,
	bodyCopySecond,
	ctasSecond,
}: ThankYouModuleProps): JSX.Element {
	useEffect(() => {
		trackComponentLoadId && trackComponentLoad(trackComponentLoadId);
	}, []);

	const hasQrCodes = moduleType === 'appDownload';
	const appDownloadEditions = moduleType === 'appDownloadEditions';
	const isDownloadModules = moduleType === 'appsDownload';
	const hasImagery = ['appDownload', 'newspaperArchiveBenefit'].includes(
		moduleType,
	);

	const gridContainer =
		hasImagery || hasQrCodes
			? imageryAndQrCodesGridContainer
			: icon
			? defaultGridContainer
			: defaultContainerNoIcon;

	const maybePaddingRight =
		!hasImagery && (isDownloadModules || appDownloadEditions)
			? paddingRightApps
			: paddingRight;

	const isNewspaperArchiveBenefit = moduleType === 'newspaperArchiveBenefit';
	const resizeContainer = isNewspaperArchiveBenefit ? sizeContainer : css``;
	const resizeImgContainer = !isNewspaperArchiveBenefit
		? sizeImgContainer
		: css``;
	const resizeMarginTop = !isNewspaperArchiveBenefit
		? css`
				margin-top: ${space[6]}px;
		  `
		: css``;

	return (
		<section
			css={[container, maybePaddingRight, hasImagery && imageryStyle]}
			data-testid={`${TEST_ID_PREFIX}-${moduleType}`}
		>
			<div css={gridContainer}>
				<div css={iconContainer}>{icon}</div>
				<div css={[headerContainer, resizeContainer]}>{header}</div>
				<div css={[bodyContainer, resizeContainer]}>
					{isDownloadModules ? (
						<>
							<div css={[bodyApps, bodyAppsTop]}>
								<div css={bodyStyle}>
									<p css={bodyCopyStyle}>{bodyCopy}</p>
									<div css={[ctaContainerApps, ctaTop]}>{ctas}</div>
								</div>
								<span css={appContainer}>
									<AppImageGuardianNews></AppImageGuardianNews>
								</span>
							</div>
							<div css={bodyApps}>
								<div css={bodyStyle}>
									<p css={bodyCopyStyle}>{bodyCopySecond}</p>
									<div css={[ctaContainerApps, ctaBottom]}>{ctasSecond}</div>
								</div>
								<span css={appContainer}>
									<AppImageFeast></AppImageFeast>
								</span>
							</div>
						</>
					) : (
						<>
							<p css={[bodyCopyStyle, bodyCopyMarginTop]}>{bodyCopy}</p>
							{ctas && <div css={resizeMarginTop}>{ctas}</div>}
						</>
					)}
				</div>

				{hasImagery ? (
					<div css={[imgContainer, resizeImgContainer]}>
						{isNewspaperArchiveBenefit ? (
							<NewspaperArchiveImage />
						) : (
							<AppDownloadImage />
						)}
					</div>
				) : null}

				{hasQrCodes && isSignedIn ? (
					<div css={[qrCodesContainer, hideBelowTablet]}>
						<AppDownloadQRCodes />
					</div>
				) : null}
			</div>
		</section>
	);
}

export default ThankYouModule;
