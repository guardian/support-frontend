import { css } from '@emotion/react';
import { brand, from, neutral, space } from '@guardian/source/foundations';

export const subscriptionsProductContainer = css`
	display: flex;
	flex-direction: column;
	background-color: ${brand[400]};
	color: ${neutral[100]};
	max-width: 1290px;
	margin: 0 ${space[3]}px;
	flex-grow: 1;
	margin-top: 40px;

	${from.desktop} {
		flex-direction: row-reverse;
		margin: 0 ${space[3]}px;
	}

	${from.wide} {
		margin: 0 auto;
	}
`;

export const subscriptionsImageContainer = css`
	display: flex;
	flex: 1;
	align-self: flex-end;
	background-color: ${brand[300]};
	width: 100%;

	picture {
		flex-grow: 1;
		justify-self: center;
		display: flex;

		img {
			max-width: 100%;
		}
	}

	${from.desktop} {
		background-color: ${brand[400]};
	}
`;

export const subscriptionsImage = css`
	width: 100%;
	align-self: flex-end;
`;

export const subscriptionsDescriptionContainer = css`
	flex: 1;
`;

export const subscriptionsDescription = css`
	padding: ${space[3]}px ${space[6]}px;

	${from.desktop} {
		padding-left: ${space[14]}px;
	}
`;
