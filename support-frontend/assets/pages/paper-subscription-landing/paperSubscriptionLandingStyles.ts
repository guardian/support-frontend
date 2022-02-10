import { css } from '@emotion/react';
import { between, space } from '@guardian/source-foundations';

export const tabsTabletSpacing = css`
	${between.tablet.and.leftCol} {
		padding: 0 ${space[5]}px;
	}
`;
