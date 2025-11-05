import { css } from '@emotion/react';
import { until } from '@guardian/source/foundations';

export const paperPackShotContainer = css`
	width: 382px;

	${until.tablet} {
		width: 100%;
	}

	img:nth-child(1) {
		z-index: 2;
		left: 80px;
		position: absolute;
		bottom: 0;

		${until.leftCol} {
			left: 50px;
			width: 90%;
		}

		${until.desktop} {
			left: 20px;
		}

		${until.tablet} {
			width: 100%;
			position: inherit;
		}
	}
`;
