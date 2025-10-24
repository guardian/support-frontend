import { css } from '@emotion/react';
import { brandAlt, from, neutral } from '@guardian/source/foundations';

export const subscriptionsProductContainerStyle = css`
	position: relative;
	padding: 0 0 40px;
	background-color: ${neutral[93]};

	${from.desktop} {
		padding: 0 10px 40px;
	}

	&:after {
		content: '';
		position: absolute;
		width: 100%;
		height: 100px;
		border-bottom: 1px solid ${neutral[86]};
		background-color: ${brandAlt[400]};
		display: block;
		top: 0;
		left: 0;
	}
`;
