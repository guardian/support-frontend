import { css } from '@emotion/react';
import { from } from '@guardian/source/foundations';

export const weeklyPackShotContainer = css`
	.subscriptions-feature-packshot {
		width: 140%;

		${from.tablet} {
			width: 600px;
			margin-top: 45px;
		}

		img {
			width: 100%;

			${from.desktop} {
				width: 700px;
				right: -50px;
			}
		}
	}
`;
