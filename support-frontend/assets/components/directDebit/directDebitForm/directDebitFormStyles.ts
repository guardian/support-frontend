import { css } from '@emotion/react';
import { from, space, until } from '@guardian/source-foundations';
import { palette } from '@guardian/source-foundations/cjs/colour/palette';

export const fieldLabel = css`
	display: block;
	margin-top: ${space[3]}px;
	margin-bottom: ${space[1]}px;

	${from.tablet} {
		margin-top: ${space[5]}px;
		margin-bottom: ${space[1]}px;
	}
`;

export const textField = css`
	height: 44px;
	border: 1px solid #707070;
	border-radius: ${space[1]}px;
	padding: 10px 8px;
	width: 100%;
`;

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
`;

export const accountHolderConfirmation = css`
	margin-top: ${space[5]}px;
`;

export const confirmationInputContainer = css`
	display: flex;
`;

export const confirmationInput = css`
	margin-top: ${space[2]}px;
`;

export const confirmationText = css`
	font-size: 14px;
	padding-left: 12px;
	display: block;
	overflow: hidden;
`;

export const confirmationCheckbox = css`
	width: 25px;
	position: relative;
`;

export const confirmationLabel = css`
	cursor: pointer;
	position: absolute;
	width: 20px;
	height: 20px;
	top: 2px;
	left: 0;
	background: #fff;
	border: solid 1px #121212;
	border-radius: 2px;
	&:after {
		opacity: 0;
		content: '';
		position: absolute;
		width: 9px;
		height: 5px;
		background: transparent;
		top: 4px;
		left: 4px;
		border: 3px solid #333;
		border-top: none;
		border-right: none;
		transform: rotate(-45deg);
	}
	&:hover::after {
		opacity: 0.5;
	}
}`;

export const recaptcha = css`
	margin-top: 24px;
	margin-bottom: 4px;
	// This is the set width of the recaptcha iframe, to fix the helper text below to the same size
	max-width: 304px;
`;

export const sortCodeField = css`
	text-align: center;
	font-size: 14px;
	background-color: white;
	color: ${palette.neutral[7]};
	border: 1px solid #707070;
	height: 41px;
	width: 5ch;

	height: 44px;
	border-radius: 4px;
	padding: 10px 8px;
`;

export const sortCodeSeparator = css`
	margin: 4px;
	font-size: 18px;
`;

export const legalNotice = css`
	font-size: 12px;
	color: ${palette.neutral[46]};
	margin-top: 20px;
	margin-bottom: 20px;
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
	font-size: 12px;
	color: ${palette.neutral[46]};
	margin-bottom: 20px;
	a {
		color: ${palette.neutral[46]};
	}
`;

export const guaranteeList = css`
	list-style-type: disc;
	margin-left: 16px;
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
