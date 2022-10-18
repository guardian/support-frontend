import { css } from '@emotion/react';
import { from, neutral, space } from '@guardian/source-foundations';
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
	grid-template-columns: min-content 1fr 1fr;
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

const iconContainer = css`
	grid-area: icon;

	svg {
		display: block;
	}
`;

const headerContainer = css`
	grid-area: header;

	display: flex;
	align-items: center;
`;

const bodyContainer = css`
	grid-area: body;
	max-width: 300px;
`;

const qrCodesContainer = css`
	grid-area: qrCodes;
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
	const { icon, heading, bodyCopy, ctas, qrCodes } =
		getThankYouModuleData(moduleType);

	const isDownloadModule = moduleType === 'downloadTheApp';

	const gridContainer = isDownloadModule
		? downloadAppGridContainer
		: defaultGridContainer;

	return (
		<section css={container}>
			<div css={gridContainer}>
				<div css={iconContainer}>{icon}</div>
				<div css={headerContainer}>{heading}</div>
				<div css={bodyContainer}>
					{bodyCopy}
					{ctas}
				</div>

				{/* {isDownloadModule && images ? img component : null} */}

				{isDownloadModule && isSignedIn && qrCodes ? (
					<div css={qrCodesContainer}>{qrCodes}</div>
				) : null}
			</div>
		</section>
	);
}

export default ThankYouModule;
