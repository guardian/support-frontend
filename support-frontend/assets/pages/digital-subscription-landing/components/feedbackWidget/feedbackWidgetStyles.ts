// ----- Imports ----- //
import { css } from '@emotion/react';
import { brand, space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { background, success, text } from '@guardian/src-foundations/palette';
import { textSans } from '@guardian/src-foundations/typography';
// ----- Constants ----- //
export const hideWidget = css`
	visibility: hidden;
	max-height: 0;
`;
export const wrapper = css`
	visibility: visible;
	position: fixed;
	z-index: 10;
	bottom: 0;
	width: 100%;
	max-height: 200px;
	transition: max-height 0.5s ease;

	${from.phablet} {
		width: 300px;
		right: 0;
	}
`;
export const header = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
	${textSans.small({
		fontWeight: 'bold',
	})};
	color: ${background.primary};
	background: ${background.ctaPrimary};
	padding: ${space[2]}px ${space[3]}px;
	border-radius: 5px 5px 0 0;
	border-top: ${brand[600]} solid 1px;
	border-right: ${brand[600]} solid 1px;
	border-left: ${brand[600]} solid 1px;

	${from.desktop} {
		${textSans.medium({
			fontWeight: 'bold',
		})};
	}
`;
export const widgetTitle = css`
	display: block;
`;
export const clickedCss = css`
	background: ${success[400]};
	border-radius: 50%;
`;
export const buttonStyles = css`
	border: ${brand[600]} solid 1px;
	border-radius: 50%;
	:first-of-type {
		margin-right: ${space[2]}px;
	}
	svg {
		display: block;
		padding: ${space[1]}px;
	}
`;
export const feedbackLink = css`
	background: ${background.primary};
	color: ${text.primary};
	${textSans.small()};
	padding: ${space[3]}px;
	label {
		display: block;
		margin-bottom: ${space[2]}px;
	}
`;
