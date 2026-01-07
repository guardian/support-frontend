import { css } from '@emotion/react';
import { until } from '@guardian/source/foundations';

export const anchorButtonStyle = css`
	svg {
		transition: 0.3s ease-in-out transform;
		will-change: transform;
	}
	&:hover svg,
	&:focus svg {
		transform: translateX(20%);
	}

	${until.tablet} {
		width: 100%;
	}
`;
