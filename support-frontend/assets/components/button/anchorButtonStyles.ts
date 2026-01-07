import { css } from '@emotion/react';

export const anchorButtonStyle = css`
	svg {
		transition: 0.3s ease-in-out transform;
		will-change: transform;
	}
	&:hover svg,
	&:focus svg {
		transform: translateX(20%);
	}
`;
