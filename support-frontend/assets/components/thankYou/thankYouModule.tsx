import { css } from '@emotion/react';
import { from, headline, neutral, space } from '@guardian/source-foundations';
import { getThankYouModuleData } from './thankYouModuleData';

const container = css`
	background: white;
	padding-top: ${space[2]}px;
	padding-bottom: ${space[5]}px;

	${from.tablet} {
		padding-left: ${space[4]}px;
		padding-right: 72px;
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
	grid-template-columns: min-content 1fr min-content;
	grid-template-areas:
		'img img'
		'icon header'
		'body body';

	${from.tablet} {
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
`;

const bodyContainer = css`
	grid-area: body;
	max-width: 300px;
`;

const bodyCopyStyle = css`
	margin-bottom: ${space[1]}px;
`;

const imgContainer = css`
	grid-area: img;
`;

const qrCodesContainer = css`
	display: none;

	${from.tablet} {
		display: block;
		grid-area: qrCodes;
	}
`;

export type ThankYouModuleType = 'downloadTheApp' | 'feedback' | 'shareSupport';

export interface ThankYouModuleProps {
	moduleType: ThankYouModuleType;
	isSignedIn: boolean;
}

function ThankYouModule({
	moduleType,
	isSignedIn,
}: ThankYouModuleProps): JSX.Element {
	const { icon, header, bodyCopy, ctas, qrCodes } =
		getThankYouModuleData(moduleType);

	const isDownloadModule = moduleType === 'downloadTheApp';

	const gridContainer = isDownloadModule
		? downloadAppGridContainer
		: defaultGridContainer;

	return (
		<section css={container}>
			<div css={gridContainer}>
				<div css={iconContainer}>{icon}</div>
				<div css={headerContainer}>{header}</div>
				<div css={bodyContainer}>
					<p css={bodyCopyStyle}>{bodyCopy}</p>
					{ctas}
				</div>

				<div css={imgContainer}>[img here]</div>
				{/* {isDownloadModule && images ? img component : null} */}

				{isDownloadModule && isSignedIn && qrCodes ? (
					<div css={qrCodesContainer}>{qrCodes}</div>
				) : null}
			</div>
		</section>
	);
}

export default ThankYouModule;
