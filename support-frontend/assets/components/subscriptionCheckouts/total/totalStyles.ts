import { css } from '@emotion/react';
import {
	breakpoints,
	from,
	palette,
	textSansBold17,
} from '@guardian/source/foundations';

export const container = css`
	padding: 10px;
	border-top: 1px solid ${palette.neutral[86]};
	${from.tablet} {
		display: none;
	}
`;
export const wrapper = css`
	display: flex;
	justify-content: space-between;
	max-width: ${breakpoints.mobileMedium}px;
	${textSansBold17};
`;
