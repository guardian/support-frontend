import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { background, border, text } from '@guardian/src-foundations/palette';
import { textSans } from '@guardian/src-foundations/typography/obj';

export const list = css`
	${from.desktop} {
		color: ${text.primary};
		width: calc(100%-${space[3]}px * 2);
		margin: ${space[3]}px;
		padding-top: ${space[3]}px;
		border-top: 1px solid ${border.secondary};
	}

	li {
		margin-bottom: ${space[4]}px;
	}
`;
export const listMain = css`
	${textSans.medium({
		fontWeight: 'bold',
	})};
	margin-left: ${space[3]}px;
	display: inline-block;
	max-width: 90%;
`;
export const subText = css`
	display: block;
	${textSans.small()};
	margin-left: ${space[5]}px;
	line-height: 135%;
`;
export const dot = css`
	display: inline-block;
	height: 9px;
	width: 9px;
	border-radius: 50%;
	background-color: ${background.ctaPrimary};
	vertical-align: top;
	margin-top: ${space[2]}px;
`;
