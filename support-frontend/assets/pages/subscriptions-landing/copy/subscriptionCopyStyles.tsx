import { css } from '@emotion/react';
import { from, palette } from '@guardian/source/foundations';

export const weeklySubscriptionProductCardStyle = css`
	color: ${palette.neutral[0]};
	background-color: #cadbe8;

	${from.tablet} {
		div:nth-child(1) {
			align-self: center;
		}
	}

	p::before {
		border-color: ${palette.neutral[60]};
	}
`;
