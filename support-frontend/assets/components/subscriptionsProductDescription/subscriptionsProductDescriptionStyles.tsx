import { css } from '@emotion/react';
import {
	from,
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
