import { css } from '@emotion/react';
import { from, palette, space, until } from '@guardian/source/foundations';

export const brandAwarenessSection = css`
	background-color: ${palette.neutral[97]};

	${until.desktop} {
		> div {
			padding: 0 10px;
		}
	}
`;

export const brandAwarenessContainer = css`
	max-width: 940px;
	padding-top: ${space[6]}px;

	${from.desktop} {
		padding-top: ${space[9]}px;
		margin: 0 auto;
	}
`;
