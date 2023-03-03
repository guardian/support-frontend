import { css } from '@emotion/react';
import {
	between,
	body,
	from,
	neutral,
	space,
} from '@guardian/source-foundations';
import { useEffect } from 'react';
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

const bodyCopyStyle = css`
	${body.small()};
	margin-top: ${space[3]}px;
	margin-bottom: ${space[1]}px;

	${from.tablet} {
		margin-top: ${space[2]}px;
		font-size: 17px;
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

export type ThankYouModuleType =
	| 'appDownload'
	| 'appDownloadDigiSub'
	| 'ausMap'
	| 'feedback'
	| 'marketingConsent'
	| 'signIn'
	| 'signUp'
	| 'socialShare'
	| 'supportReminder';

export interface ThankYouModuleProps {
	moduleType: ThankYouModuleType;
	isSignedIn: boolean;
	icon: JSX.Element;
	header: string;
	bodyCopy: JSX.Element | string;
	ctas: JSX.Element | null;
	trackComponentLoadId?: string;
}

function ThankYouModule({
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

export default ThankYouModule;
