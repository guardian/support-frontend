import { css } from '@emotion/react';
import { from, neutral } from '@guardian/source/foundations';

export const weeklySubscriptionProductCardStyle = css`
	color: ${neutral[0]};
	background-color: #cadbe8;
	${from.tablet} {
		div:nth-child(1) {
			align-self: center;
		}
	}
	div {
		background-color: #cadbe8;
	}
`;

export const paperSubscriptionProductCardStyle = css`
	div {
		flex-direction: row-reverse;
	}
`;
