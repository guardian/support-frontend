import { css } from '@emotion/react';
import { from, neutral, palette } from '@guardian/source/foundations';

export const subscriptionsProductContainer = css`
	position: relative;
	z-index: 1;
	display: flex;
	max-width: 1290px;
	margin-top: 40px;
	background-color: ${neutral[97]};

	align-items: stretch;
	width: 100%;
	flex-wrap: wrap;
	border: 1px solid ${neutral[86]};
	min-height: 320px;
	padding-top: 0.625rem;

	a {
		background-color: black;
		color: white;
	}

	${from.desktop} {
		margin: 20px auto;
		width: calc(100% - 40px);
		min-height: 0;
	}

	${from.mobileLandscape} {
		width: calc(100% - 20px);
	}

	&:first-child {
		margin-top: 0;
	}

	&:nth-child(odd) {
		${from.tablet} {
			flex-direction: row-reverse;
		}
	}
`;

export const subscriptionsProductContainerFeature = css`
	color: ${neutral[100]};
	border: none;
	padding-top: 10px;
	background-color: ${palette.brand[400]}; // brand-main
	overflow: hidden;

	&:before {
		content: none;
	}

	.subscriptions__description {
		&:before {
			border-top: solid #9aa4ad 1px;
		}
	}
`;
