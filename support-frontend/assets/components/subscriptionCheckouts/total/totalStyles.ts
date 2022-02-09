import { css } from '@emotion/react';
import {
	border,
	breakpoints,
	from,
	textSans,
} from '@guardian/source-foundations';

export const container = css`
	padding: 10px;
	border-top: 1px solid ${border.secondary};
	${from.tablet} {
		display: none;
	}
`;
export const wrapper = css`
	display: flex;
	justify-content: space-between;
	max-width: ${breakpoints.mobileMedium}px;
	${textSans.medium({
		fontWeight: 'bold',
	})};
`;
