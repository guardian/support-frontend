import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';

export const accountNumberSortCodeContainer = css`
	display: flex;
	flex-direction: column;
	gap: 0;

	& > * {
		width: 100%;
	}

	${from.tablet} {
		flex-direction: row;
		gap: ${space[3]}px;
	}
	margin: ${space[3]}px 0;
`;

export const recaptcha = css`
	margin-top: ${space[5]}px;
	margin-bottom: ${space[1]}px;
	// This is the set width of the recaptcha iframe, to fix the helper text below to the same size
	max-width: 304px;
`;
