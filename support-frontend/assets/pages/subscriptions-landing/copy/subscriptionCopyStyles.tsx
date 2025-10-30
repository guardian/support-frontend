import { css } from '@emotion/react';
import { neutral } from '@guardian/source/foundations';

export const weeklySubscriptionProductCardStyle = css`
	color: ${neutral[0]};
	background-color: #cadbe8;

	// weekly
	& a {
		color: ${neutral[100]};
		background-color: ${neutral[20]};
		:hover {
			background-color: ${neutral[20]};
		}
	}

	// weekly gift
	& a:nth-of-type(2) {
		color: ${neutral[20]};
		background-color: transparent;
		border: solid 1px ${neutral[20]};
	}
`;
