import { css } from '@emotion/react';
import { brand, from, neutral, until } from '@guardian/source/foundations';

export const subscriptionsProductContainer = css`
	position: relative;
	display: flex;
	align-items: stretch;
	width: 100%;
	margin: 0 auto;
	flex-wrap: wrap;
	max-width: 1290px;
	border: 1px solid ${neutral[86]};
	min-height: 320px;
	background-color: ${neutral[97]};
	margin-top: 40px;
	z-index: 1;
	padding-top: 0.625rem;

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
	background-color: ${brand[400]}; // brand-main
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

export const subscriptionsImageContainer = css`
	position: relative;
	overflow: hidden;
	width: 30%;

	${from.tablet} {
		width: 50%;
	}
`;

export const subscriptionsImageContainerFeature = css`
	padding: 10px 10px 0 10px;
	width: 100%;
	margin-bottom: 0;
	right: 0;
	position: relative;

	${from.tablet} {
		width: 50%;
		padding: 0;
	}
`;

export const subscriptionsImageFeature = css`
	overflow: hidden;
	display: initial;
`;

export const subscriptionsImage = css`
	width: 100%;
	padding: 6px;
`;

export const subscriptionsDescriptionContainer = css`
	position: relative;
	width: 70%;
	overflow: hidden;

	${from.tablet} {
		width: 50%;
	}
`;

export const subscriptionsDescriptionContainerFeature = css`
	position: relative;
	width: 100%;

	${from.tablet} {
		width: 50%;
	}
`;

export const subscriptionsDescription = css`
	top: 0;
	transform: none;
	position: relative;
	padding: 0 80px;

	${until.leftCol} {
		padding: 0 50px;
	}
	${until.desktop} {
		padding: 6px 20px 20px;
		top: 0;
		transform: translateY(0);
	}
	${until.phablet} {
		padding: 6px 20px 30px 10px;
		position: static;
		transform: none;
	}
`;

export const subscriptionsDescriptionFeature = css`
	padding: 0 10px 10px;
	${from.tablet} {
		padding: 0 20px 20px 50px;
	}
`;
