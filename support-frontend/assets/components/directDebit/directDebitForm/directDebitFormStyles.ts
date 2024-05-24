import { css } from '@emotion/react';
import { from, palette, space, until } from '@guardian/source/foundations';

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

export const legalNotice = css`
	font-size: ${space[3]}px;
	color: ${palette.neutral[46]};
	margin-top: ${space[5]}px;
	margin-bottom: ${space[3]}px;
	display: inline-block;

	a {
		color: ${palette.neutral[46]};
	}

	strong {
		font-weight: bold;
	}

	${until.tablet} {
		p {
			margin-bottom: ${space[1]}px;
		}
	}
`;

export const guarantee = css`
	font-size: ${space[3]}px;
	color: ${palette.neutral[46]};
	margin-bottom: ${space[5]}px;
	a {
		color: ${palette.neutral[46]};
	}
`;

export const guaranteeList = css`
	list-style-type: disc;
	margin-left: ${space[4]}px;
`;

export const guaranteeListClosed = css`
	display: none;
`;

export const guaranteeListOpenLink = css`
	background: none;
	outline: none;
	color: inherit;
	border: none;
	padding: 0;
	font: inherit;
	text-decoration: underline;
	cursor: pointer;
`;
