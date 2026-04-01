import { css } from '@emotion/react';
import { from, neutral } from '@guardian/source/foundations';

export const weeklySubscriptionProductCardStyle = css`
	color: ${neutral[0]};
	background-color: #cadbe8;
	div {
		background-color: #cadbe8;
	}
	${from.tablet} {
		div:nth-child(2) {
			align-self: center;
		}
	}
`;

export const paperSubscriptionProductCardStyle = css`
	${from.tablet} {
		div {
			flex-direction: row-reverse;
		}
	}
`;
