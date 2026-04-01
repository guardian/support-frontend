import { css } from '@emotion/react';
import { from, neutral, palette } from '@guardian/source/foundations';

export const weeklySubscriptionProductCardStyle = css`
	color: ${neutral[0]};
	background-color: ${palette.brandAlt[400]};
	div {
		background-color: #cadbe8;
	}
	${from.tablet} {
		background-color: #cadbe8;
		div:nth-child(2) {
			align-self: center;
		}
	}
	${from.desktop} {
		margin: 10px auto;
		width: calc(100% - 20px);
	}
`;

export const paperSubscriptionProductCardStyle = css`
	${from.tablet} {
		div {
			flex-direction: row-reverse;
			margin-bottom: 0;
		}
	}
	${from.desktop} {
		margin: 20px auto;
		width: calc(100% - 20px);
	}
`;
