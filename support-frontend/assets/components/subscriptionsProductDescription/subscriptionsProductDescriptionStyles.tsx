import { css } from '@emotion/react';
import {
	brandAlt,
	from,
	headlineBold34,
	headlineLight24,
	headlineLight28,
	neutral,
	textEgyptian17,
	until,
} from '@guardian/source/foundations';

export const subscriptions__description = css`
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

	font-weight: 400;
	margin: 45px 20px 25px 0;
	font-size: 20px;
	line-height: 28px;

	${until.desktop} {
		margin: 27px 20px 25px 0;
		font-size: 16px;
		line-height: 18px;
	}

	${until.tablet} {
		max-width: 100%;
	}

	${until.mobileLandscape} {
		font-size: 14px;
		line-height: 16px;
		margin: 16px 20px 18px 0;
	}

	${until.mobileMedium} {
		margin: 16px 10px 18px 0;
	}
`;

export const checkmarkBenefitList = css`
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
		position: absolute;
		width: 100%;
		margin-top: -6px;
		margin-left: -52px;
		${from.tablet} {
			border-top: 1px solid ${neutral[86]};
		}
	}
`;

export const subscriptions__product_title = css`
	${headlineBold34};
	margin: 0;

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

export const subscriptions__sales = css`
	font-size: 28px;
	line-height: 30px;
	font-weight: 300;
	display: inline-block;
	color: ${neutral[7]};
	background-color: ${brandAlt[400]};
	vertical-align: middle;
	padding: 0px 7px 3px;
	margin: 6px 0px;

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

export const subscriptions__product_subtitle_small = css`
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

export const subscriptions__product_subtitle__large = css`
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
