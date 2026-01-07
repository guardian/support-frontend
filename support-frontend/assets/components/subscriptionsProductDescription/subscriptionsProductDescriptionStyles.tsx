import { css } from '@emotion/react';
import {
	brandAlt,
	from,
	headlineBold34,
	headlineLight24,
	headlineLight28,
	neutral,
	space,
	textEgyptian14,
	textEgyptian17,
	until,
} from '@guardian/source/foundations';

export const subscriptionDescription = css`
	position: relative;
	&:before {
		width: 200%;
		right: 0;

		content: '';
		position: absolute;
		border-top: 1px solid ${neutral[86]};
		width: 100%;
		margin-top: -6px;
	}

	${textEgyptian14}
	line-height: 16px;
	margin: 16px 10px 18px 0;

	${from.mobileMedium} {
		margin: 16px 0 18px 0;
	}
	${from.mobileLandscape} {
		font-size: 16px;
		line-height: 18px;
		margin: 27px 0 25px 0;
	}
	${until.tablet} {
		max-width: 100%;
	}
	${from.desktop} {
		font-size: 20px;
		line-height: 28px;
		margin: 45px 20px 25px 0;
	}
`;

export const subscriptionBenefit = css`
	display: block;
	${textEgyptian17}
	margin: 16px 20px 18px 0;

	> p:first-child {
		font-weight: 400;
	}

	${from.mobileLandscape} {
		margin: 27px 20px 25px 0;
	}
	${from.desktop} {
		margin: 45px 20px 25px 0;
	}

	:before {
		content: '';
		display: block;
		border-top: 1px solid ${neutral[86]};
		margin-right: -${space[10]}px;
		${from.desktop} {
			margin-left: -${space[14]}px;
		}
	}
`;

export const subscriptionTitle = css`
	${headlineBold34};
	margin: 0;

	& mark {
		background-color: unset;
		color: ${brandAlt[400]};
	}

	${until.desktop} {
		font-size: 32px;
	}

	${until.tablet} {
		font-size: 34px;
		line-height: 34px;
	}

	${until.mobileLandscape} {
		font-size: 24px;
		line-height: 28px;
	}

	${until.mobileMedium} {
		font-size: 22px;
		line-height: 22px;
	}
`;

export const subscriptionTitleFeature = css`
	line-height: 115%;
	${until.desktop} {
		font-size: 28px;
	}
	${until.tablet} {
		font-size: 24px;
	}
`;

export const subscriptionOffer = css`
	${textEgyptian17};
	font-size: 20px;
	line-height: 24px;
	display: inline-block;
	color: ${neutral[7]};
	background-color: ${brandAlt[400]};
	vertical-align: middle;
	padding: 0px 7px 3px;
	margin: 6px 0px;

	${from.mobileLandscape} {
		font-size: 24px;
		line-height: 30px;
	}
	${from.desktop} {
		font-size: 28px;
	}
`;

export const subscriptionOfferFeature = css`
	color: ${neutral[7]};
`;

export const subscriptionSubtitleSmall = css`
	${headlineLight24};

	${until.desktop} {
		font-size: 20px;
	}

	${until.mobileLandscape} {
		font-size: 18px;
		line-height: 24px;
	}

	${until.mobileMedium} {
		font-size: 16px;
		line-height: 20px;
	}
`;

export const subscriptionSubtitleLarge = css`
	${headlineLight28};

	${until.desktop} {
		font-size: 24px;
	}

	${until.tablet} {
		font-size: 24px;
		line-height: 30px;
	}

	${until.mobileLandscape} {
		font-size: 20px;
		line-height: 24px;
	}
`;

export const subscriptionButtonsContainer = css`
	display: flex;
	margin-bottom: ${space[6]}px;
	gap: 10px;
	flex-wrap: wrap;
`;

export const subscriptionButtonsContainerFeature = css`
	${until.mobileLandscape} {
		flex-direction: column;
		> a {
			justify-content: center;
		}
	}
`;
