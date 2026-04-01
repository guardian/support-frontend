import { css } from '@emotion/react';
import { from, neutral, palette } from '@guardian/source/foundations';

export const weeklySubscriptionProductCardStyle = css`
	color: ${neutral[0]};
	background-color: ${palette.brandAlt[400]};
	div {
		background-color: #cadbe8;
	}
	${from.tablet} {
		div:nth-child(2) {
			align-self: center;
		}
	}
	${from.tablet} {
		background-color: #cadbe8;
	}
`;

export const paperSubscriptionProductCardStyle = css`
	${from.tablet} {
		div {
			flex-direction: row-reverse;
		}
	}
`;
