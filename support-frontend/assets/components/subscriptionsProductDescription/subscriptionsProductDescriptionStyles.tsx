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
		margin: 16px 20px 18px 0;
	}
	${from.mobileLandscape} {
		font-size: 16px;
		line-height: 18px;
		margin: 27px 20px 25px 0;
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
	line-height: 140%;
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
		padding-top: 15px;
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
	display: block;

	${from.phablet} {
		width: 80%;
		padding-bottom: 20px;
	}

	${from.tablet} {
		display: inline-block;
		padding-bottom: 0;
	}

	${from.desktop} {
		width: 100%;
		padding-bottom: 20px;
	}

	& a:nth-of-type(2) {
		margin-top: 10px;

		${from.desktop} {
			margin-top: 0;
			margin-left: 5px;
		}
	}
`;

export const subscriptionButtonsContainerFeature = css`
	& a:nth-of-type(2) {
		${from.mobileLandscape} {
			margin-left: 10px;
			margin-top: 0;
		}

		${from.tablet} {
			margin-left: 0;
			margin-top: 10px;
		}

		${from.desktop} {
			margin: 0 0 0 10px;
		}
	}
`;
