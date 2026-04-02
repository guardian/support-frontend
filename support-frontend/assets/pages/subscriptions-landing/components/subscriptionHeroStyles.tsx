import { css } from '@emotion/react';
import {
	from,
	neutral,
	palette,
	space,
	until,
} from '@guardian/source/foundations';

export const subscriptionsProductContainer = css`
	position: relative;
	z-index: 1;
	display: flex;
	max-width: 1290px;
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
		${until.tablet} {
			width: 100%;
		}
	}

	&:first-child {
		margin-top: 0;
	}

	margin-top: ${space[4]}px;
	${from.tablet} {
		margin-top: ${space[5]}px;
	}
	${from.desktop} {
		margin: ${space[5]}px auto;
		width: calc(100% - ${space[10]}px);
		min-height: 0;
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
