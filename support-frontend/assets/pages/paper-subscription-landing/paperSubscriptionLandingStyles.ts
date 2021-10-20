import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { between } from '@guardian/src-foundations/mq';

export const tabsTabletSpacing = css`
	${between.tablet.and.leftCol} {
		padding: 0 ${space[5]}px;
	}
`;
