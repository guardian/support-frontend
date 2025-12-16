// ----- Imports ----- //
import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';

const lineStyles = css`
	position: absolute;
	border: 0;
	left: 0;
	margin: -7px 0 0 0;
	right: 0;
	background-image: repeating-linear-gradient(
		to bottom,
		${palette.neutral[86]},
		${palette.neutral[86]} 1px,
		transparent 0,
		transparent 4px
	);
	background-repeat: repeat-x;
	background-position: 'bottom';
	background-size: 1px 14px;
	height: 14px;
`;

const dividerStyles = css`
	padding-bottom: ${space[5]}px;
`;

export default function Divider(): JSX.Element {
	return (
		<div css={dividerStyles}>
			<hr css={lineStyles} />
		</div>
	);
}
