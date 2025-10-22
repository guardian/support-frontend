import { css } from '@emotion/react';
import { brand, from, neutral, until } from '@guardian/source/foundations';

export const subscriptions__product = css`
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

export const subscriptions__product__feature = css`
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

export const subscriptions__image_container = css`
	position: relative;
	overflow: hidden;
	width: 30%;

	${from.tablet} {
		width: 50%;
	}
`;

export const subscriptions__image_container_subscriptions__product__feature = css`
	padding: 10px 10px 0 10px;
	width: 100%;
	margin-bottom: 0;

	${from.tablet} {
		position: relative;
		width: 50%;
		padding: 0;
	}
`;

export const subscriptions__feature_image_wrapper = css`
	overflow: hidden;
	display: initial;
`;

export const subscriptions__packshot = css`
	width: 100%;
	padding: 6px;
`;

export const subscriptions__copy_container = css`
	position: relative;
	width: 70%;
	overflow: hidden;

	${from.tablet} {
		width: 50%;
	}
`;

export const subscriptions__copy_container_subscriptions__product__feature = css`
	position: relative;
	width: 100%;

	${from.tablet} {
		width: 50%;
	}

	.subscriptions__copy-wrapper {
		padding: 0 10px 10px;
		${from.tablet} {
			padding: 0 20px 20px 50px;
		}
	}

	.subscriptions__product-title {
		line-height: 115%;
		${until.desktop} {
			font-size: 28px;
		}
		${until.tablet} {
			font-size: 24px;
			padding-top: 15px;
		}
	}

	.subscriptions__product-subtitle--large {
		line-height: 115%;
		font-size: 24px;
		${until.desktop} {
			font-size: 20px;
		}
		${until.tablet} {
			font-size: 17px;
		}
	}
`;

export const subscriptions__copy_wrapper = css`
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
		padding: 6px 0 30px 10px;
		position: static;
		transform: none;
	}
`;
