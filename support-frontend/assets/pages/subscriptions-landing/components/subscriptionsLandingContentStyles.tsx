import { css } from '@emotion/react';
import { brand, brandAlt, from, neutral } from '@guardian/source/foundations';

export const subscriptions__product_container = css`
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

export const subscriptions__guardian_weekly_subscriptions__product__feature = css`
	color: ${neutral[0]};
	background-color: #cadbe8;

	.subscriptions__image-container {
		right: 0;
		margin-bottom: 0;
		position: relative;
	}

	.subscriptions-feature-packshot {
		width: 100%;

		img {
			width: 100%;
			vertical-align: bottom;
		}

		${from.tablet} {
			position: absolute;
			bottom: 0;
		}
	}

	.component-button--primary.component-button--guardian-weekly {
		color: ${neutral[100]};
		background-color: ${neutral[20]};
	}

	.component-button--tertiaryFeature.component-button--guardian-weekly,
	.component-button--tertiaryFeature.component-button--guardian-weekly:hover,
	.component-button--tertiaryFeature.component-button--guardian-weekly:focus {
		color: ${neutral[20]};
		border: solid 1px ${neutral[20]};
		background-color: transparent;
	}
`;

export const subscriptions__digital_subscriptions__product__feature = css`
	color: ${neutral[100]};
	background-color: ${brand[400]};

	.subscriptions__digital-feature-packshot {
		width: 100%;

		${from.tablet} {
			position: absolute;
			bottom: 0;
		}

		img {
			width: 100%;
			vertical-align: bottom;
		}
	}

	.component-button--primary.component-button--digital {
		color: ${neutral[7]};
		background-color: ${brandAlt[400]};
	}

	.component-button--primary.component-button--digital:hover,
	.component-button--primary.component-button--digital:focus {
		background-color: ${brandAlt[200]};
	}

	.component-button--tertiaryFeature.component-button--digital,
	.component-button--tertiaryFeature.component-button--digital:hover,
	.component-button--tertiaryFeature.component-button--digital:focus {
		color: ${brandAlt[400]};
		border: solid 1px ${brandAlt[400]};
		background-color: transparent;
	}
`;
