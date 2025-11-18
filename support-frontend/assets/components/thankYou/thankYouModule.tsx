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
import { trackComponentLoad } from 'helpers/tracking/behaviour';
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
		padding-right: ${space[4]}px;
		border: 1px solid ${neutral[86]};
	}
`;

const defaultContainerNoIcon = css`
	margin: ${space[3]}px ${space[2]}px;
	${until.tablet} {
		margin-top: ${space[0]}px;
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

const imageryGridContainer = css`
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

const imgContainer = css`
	grid-area: img;
	align-self: flex-end;
`;

const paddingRight = css`
	${from.tablet} {
		padding-right: 54px;
	}
`;

const imageryStyle = css`
	overflow: hidden;

	${until.tablet} {
		padding-bottom: 0;
	}
`;

const ctaStyle = css`
	margin-top: ${space[6]}px;
`;

export const TEST_ID_PREFIX = 'tyModule';

export type ThankYouModuleType =
	| 'appDownload'
	| 'appsDownload'
	| 'appDownloadEditions'
	| 'observerAppDownload'
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
}

function ThankYouModule({
	moduleType,
	icon,
	header,
	bodyCopy,
	ctas,
	trackComponentLoadId,
}: ThankYouModuleProps): JSX.Element {
	useEffect(() => {
		trackComponentLoadId && trackComponentLoad(trackComponentLoadId);
	}, []);

	const isNewspaperArchiveBenefit = moduleType === 'newspaperArchiveBenefit';
	const isAppDownloadModule = ['appsDownload', 'appDownloadEditions'].includes(
		moduleType,
	);

	const resizeContainer = isNewspaperArchiveBenefit && sizeContainer;

	return (
		<section
			css={[
				container,
				!isAppDownloadModule && paddingRight,
				isNewspaperArchiveBenefit && imageryStyle,
			]}
			data-testid={`${TEST_ID_PREFIX}-${moduleType}`}
		>
			<div
				css={[
					icon ? defaultGridContainer : defaultContainerNoIcon,
					isNewspaperArchiveBenefit && imageryGridContainer,
				]}
			>
				<div css={iconContainer}>{icon}</div>
				<div css={[headerContainer, resizeContainer]}>{header}</div>
				<div css={[bodyContainer, resizeContainer]}>
					<div css={[bodyCopyStyle, bodyCopyMarginTop]}>{bodyCopy}</div>
					<div css={ctaStyle}>{ctas}</div>
				</div>

				{isNewspaperArchiveBenefit && (
					<div css={[imgContainer]}>
						<NewspaperArchiveImage />
					</div>
				)}
			</div>
		</section>
	);
}

export default ThankYouModule;
