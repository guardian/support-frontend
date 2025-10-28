import { css } from '@emotion/react';
import { neutral } from '@guardian/source/foundations';

export const weeklySubscriptionsProductCardStyle = css`
	color: ${neutral[0]};
	background-color: #cadbe8;

	.subscriptions__image-container {
		right: 0;
		margin-bottom: 0;
		position: relative;
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
