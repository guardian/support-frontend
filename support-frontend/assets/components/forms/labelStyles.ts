import { css } from '@emotion/react';
import { neutral, textSans17 } from '@guardian/source/foundations';
import { gu_v_spacing } from 'stylesheets/emotion/layout';

// .component-form-label__label {
// 	@include label;
// 	margin-bottom: $gu-v-spacing * 0.5;
// 	display: block;
// 	display: flex;
// 	align-items: center;
// 	justify-content: space-between;
// }

export const optionalItalics = css`
	font-style: italic;
	color: ${neutral[46]};
	font-weight: 400;
`;

export const footerContainer = css`
	${textSans17};
	font-size: 16px;
	line-height: 1.15;

	margin-top: ${gu_v_spacing * 0.5}px;
`;
