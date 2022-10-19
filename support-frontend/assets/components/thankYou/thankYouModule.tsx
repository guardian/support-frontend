import { css } from '@emotion/react';
import { from, headline, neutral, space } from '@guardian/source-foundations';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { getThankYouModuleData } from './thankYouModuleData';

const container = css`
	background: white;
	padding-top: ${space[2]}px;
	padding-bottom: ${space[5]}px;
	border-bottom: 1px solid ${neutral[86]};

	${from.tablet} {
		width: 620px;
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
		'body body'
		'qrCodes qrCodes';

	${from.tablet} {
		grid-template-areas:
			'icon header'
			'---- body'
			'---- qrCodes';
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
			'icon body img'
			'icon qrCodes qrCodes';
	}
`;

const iconContainer = css`
	grid-area: icon;
	display: flex;

	svg {
		display: block;
	}

	${from.tablet} {
		display: block;
	}
`;

const headerContainer = css`
	grid-area: header;
	${headline.xxxsmall({ fontWeight: 'bold' })}
	align-self: center;

	${from.tablet} {
		font-size: 20px;
		margin-top: 2px;
	}
`;

const bodyContainer = css`
	grid-area: body;

	${from.tablet} {
		max-width: 473px;
	}
`;

const bodyCopyStyle = css`
	font-size: 17px;
	margin-top: ${space[3]}px;
	margin-bottom: ${space[1]}px;

	${from.tablet} {
		margin-top: ${space[2]}px;
	}
`;

const imgContainer = css`
	grid-area: img;
	border-bottom: 1px solid ${neutral[86]};
	margin-bottom: ${space[3]}px;

	${from.tablet} {
		border-bottom: none;
		margin-bottom: none;
	}
`;

const qrCodesContainer = css`
	display: none;

	${from.tablet} {
		display: block;
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

const marginTop = css`
	margin-top: ${space[6]}px;
`;

export type ThankYouModuleType =
	| 'downloadTheApp'
	| 'feedback'
	| 'shareSupport'
	| 'continueToAccount';

export interface ThankYouModuleProps {
	moduleType: ThankYouModuleType;
	contryGroupId: CountryGroupId;
	isSignedIn: boolean;
}

function ThankYouModule({
	moduleType,
	isSignedIn,
	contryGroupId,
}: ThankYouModuleProps): JSX.Element {
	const { icon, header, bodyCopy, ctas, image, qrCodes } =
		getThankYouModuleData(moduleType, contryGroupId);

	const isDownloadModule = moduleType === 'downloadTheApp';

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

				{isDownloadModule && image ? (
					<div css={imgContainer}>{image}</div>
				) : null}

				{isDownloadModule && qrCodes && isSignedIn ? (
					<div css={qrCodesContainer}>{qrCodes}</div>
				) : null}
			</div>
		</section>
	);
}

export default ThankYouModule;
