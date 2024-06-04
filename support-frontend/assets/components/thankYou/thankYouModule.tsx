import { css } from '@emotion/react';
import {
	between,
	body,
	from,
	neutral,
	space,
} from '@guardian/source/foundations';
import { useEffect } from 'react';
import AppImageGuardianNews from 'components/svgs/appGuardianNews';
import AppImageFeast from 'components/svgs/appImageFeast';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import AppDownloadImage from './appDownload/AppDownloadImage';
import AppDownloadQRCodes from './appDownload/AppDownloadQRCodes';

const container = css`
	background: white;
	padding-top: ${space[2]}px;
	padding-bottom: ${space[5]}px;
	border-bottom: 1px solid ${neutral[86]};

	${from.tablet} {
		max-width: 620px;
		padding-left: ${space[4]}px;
		border: 1px solid ${neutral[86]};
	}
`;
const containerDualDownload = css`
	padding-right: ${space[4]}px;
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

const downloadAppGridContainer = css`
	display: grid;
	grid-column-gap: ${space[3]}px;
	grid-template-columns: min-content 1fr;
	grid-template-areas:
		'img img'
		'icon header'
		'body body';

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

const downloadAppsGridContainer = css`
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
	${body.medium({ fontWeight: 'bold' })}
	align-self: center;

	${from.desktop} {
		font-size: 20px;
		margin-top: 2px;
	}
`;

const bodyContainer = css`
	grid-area: body;
`;

const bodyDualDownload = css`
	grid-area: body;

	> div {
		display: flex;
		justify-content: space-between;
		margin-top: ${space[3]}px;
	}
`;

const bodyTop = css`
	border-bottom: 1px solid ${neutral[86]};
`;

const bodyCopyStyle = css`
	${body.small()};
	margin-top: ${space[3]}px;
	margin-bottom: ${space[1]}px;

	${from.tablet} {
		margin-top: ${space[2]}px;
		font-size: 17px;
	}

	> h2 {
		font-weight: 700;
	}
`;

const imgContainer = css`
	grid-area: img;
	align-self: flex-end;
	border-bottom: 1px solid ${neutral[86]};
	margin-bottom: ${space[3]}px;

	${from.tablet} {
		border-bottom: none;
		margin-bottom: 0;
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
		padding-right: 72px;
	}
`;

const hideBelowTablet = css`
	display: none;

	${from.tablet} {
		display: block;
	}
`;

const marginTop = css`
	margin-top: ${space[6]}px;
`;

const ctaContainer = css`
	margin-top: ${space[4]}px;

	> div {
		margin-top: 0px;
	}
`;
const ctaTop = css`
	padding-bottom: 32px;
`;

const ctaBottom = css`
	padding-bottom: ${space[4]}px;
`;

export type ThankYouModuleType =
	| 'appDownload'
	| 'appsDownload'
	| 'appDownloadEditions'
	| 'ausMap'
	| 'feedback'
	| 'signIn'
	| 'signUp'
	| 'socialShare'
	| 'supportReminder';

export interface ThankYouModuleProps {
	icon: JSX.Element;
	header: string;
	bodyCopy: JSX.Element | string;
	ctas: JSX.Element | null;
	moduleType?: ThankYouModuleType;
	isSignedIn?: boolean;
	trackComponentLoadId?: string;
	bodyCopySecond?: JSX.Element | string;
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
}: ThankYouModuleProps): JSX.Element {
	return bodyCopySecond ? (
		<ThankYouModuleAppsDownload
			icon={icon}
			header={header}
			bodyCopy={bodyCopy}
			ctas={ctas}
			trackComponentLoadId={trackComponentLoadId}
			bodyCopySecond={bodyCopySecond}
		/>
	) : (
		<ThankYouModules
			moduleType={moduleType}
			isSignedIn={isSignedIn}
			icon={icon}
			header={header}
			bodyCopy={bodyCopy}
			ctas={ctas}
			trackComponentLoadId={trackComponentLoadId}
		/>
	);
}

function ThankYouModules({
	moduleType,
	isSignedIn,
	icon,
	header,
	bodyCopy,
	ctas,
	trackComponentLoadId,
}: ThankYouModuleProps): JSX.Element {
	useEffect(() => {
		trackComponentLoadId && trackComponentLoad(trackComponentLoadId);
	}, []);

	const isDownloadModule = moduleType === 'appDownload';

	const gridContainer = isDownloadModule
		? downloadAppGridContainer
		: defaultGridContainer;
	const maybePaddingRight = !isDownloadModule && paddingRight;
	const maybeMarginTop = !isDownloadModule && marginTop;

	return (
		<section css={[container, maybePaddingRight]}>
			<div css={gridContainer}>
				<div css={iconContainer}>{icon}</div>
				<div css={headerContainer}>{header}</div>
				<div css={bodyContainer}>
					<p css={bodyCopyStyle}>{bodyCopy}</p>
					<div css={maybeMarginTop}>{ctas}</div>
				</div>

				{isDownloadModule ? (
					<div css={[imgContainer, !isSignedIn && hideBelowTablet]}>
						<AppDownloadImage />
					</div>
				) : null}

				{isDownloadModule && isSignedIn ? (
					<div css={[qrCodesContainer, hideBelowTablet]}>
						<AppDownloadQRCodes />
					</div>
				) : null}
			</div>
		</section>
	);
}

function ThankYouModuleAppsDownload({
	icon,
	header,
	bodyCopy,
	ctas,
	trackComponentLoadId,
	bodyCopySecond,
}: ThankYouModuleProps): JSX.Element {
	useEffect(() => {
		trackComponentLoadId && trackComponentLoad(trackComponentLoadId);
	}, []);
	return (
		<section css={[container, containerDualDownload]}>
			<div css={downloadAppsGridContainer}>
				<div css={iconContainer}>{icon}</div>
				<div css={headerContainer}>{header}</div>
				<div css={bodyDualDownload}>
					<div css={bodyTop}>
						<div>
							<p css={bodyCopyStyle}>{bodyCopy}</p>
							<div css={[ctaContainer, ctaTop]}>{ctas}</div>
						</div>
						<AppImageGuardianNews></AppImageGuardianNews>
					</div>
					<div>
						<div>
							<p css={bodyCopyStyle}>{bodyCopySecond}</p>
							<div css={[ctaContainer, ctaBottom]}>{ctas}</div>
						</div>
						<AppImageFeast></AppImageFeast>
					</div>
				</div>
			</div>
		</section>
	);
}

export default ThankYouModule;
