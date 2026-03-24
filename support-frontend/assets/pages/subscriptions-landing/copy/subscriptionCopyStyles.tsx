import { css } from '@emotion/react';
import { from, neutral } from '@guardian/source/foundations';

export const weeklySubscriptionProductCardStyle = css`
	color: ${neutral[0]};
	background-color: #cadbe8;
	${from.tablet} {
		div {
			align-self: center;
		}
	}
`;
