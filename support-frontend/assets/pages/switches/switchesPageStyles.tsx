import { css } from '@emotion/react';
import {
	space,
	textSans14,
	textSans17,
	titlepiece42,
} from '@guardian/source/foundations';

export const pageStyles = css`
	max-width: 740px;
	margin: 0 auto;
	padding: ${space[6]}px ${space[4]}px;
`;

export const bannerContainerStyles = css`
	min-height: 50px;
`;

export const headingStyles = css`
	${titlepiece42};
`;

export const switchRowStyles = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: ${space[3]}px 0;
	border-bottom: 1px solid #dcdcdc;
`;

export const labelStyles = css`
	${textSans17};
	font-weight: bold;
`;

export const labelActionsStyles = css`
	display: flex;
	align-items: center;
	gap: ${space[4]}px;
	margin: ${space[1]}px 0;
`;

export const statusStyles = (isOn: boolean) => css`
	${textSans14};
	color: ${isOn ? '#22874d' : '#c70000'};
	margin-left: ${space[2]}px;
`;

export const bannerStyles = css`
	${textSans14};
	background: #ffe500;
	padding: ${space[3]}px ${space[4]}px;
	margin-bottom: ${space[6]}px;
	border-left: 4px solid #ffbb00;
`;
