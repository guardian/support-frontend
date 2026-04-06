import { css } from '@emotion/react';
import { until } from '@guardian/source/foundations';

export const paperPackShotContainer = css`
	width: 382px;

	${until.tablet} {
		width: 100%;
	}
`;
