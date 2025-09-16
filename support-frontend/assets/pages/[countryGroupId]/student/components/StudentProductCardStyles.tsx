import { css } from '@emotion/react';
import {
	from,
	neutral,
	palette,
	space,
	textSans12,
	textSans17,
	textSansBold15,
	textSansBold17,
	textSansBold20,
	textSansBold24,
	textSansBold28,
} from '@guardian/source/foundations';

export const container = css`
	background-color: ${palette.neutral[100]};
	border-radius: 0 0 ${space[2]}px ${space[2]}px;
	padding: ${space[6]}px ${space[4]}px ${space[5]}px;
	position: relative;
	width: 350px;
	${from.tablet} {
		width: 366px;
		border-radius: ${space[2]}px 0 0 ${space[2]}px;
		${textSansBold24}
	}
`;

export const heading = css`
	${textSansBold20}
	color: ${neutral[7]};

	${from.tablet} {
		${textSansBold24}
	}
`;

export const priceCss = css`
	${textSansBold28};
	small {
		${textSansBold17};
	}
`;

export const discountSummaryCss = css`
	${textSans12}
	color: ${neutral[20]}px;
	text-align: center;
`;

export const originalPriceStrikeThrough = css`
	${textSans17}
	color: ${neutral[46]};
	text-decoration: line-through;
	margin-left: ${space[2]}px;
`;

export const btnStyleOverrides = css`
	width: 100%;
	margin-bottom: ${space[2]}px;
`;

export const benefitsListCSS = css`
	width: 100%;
	text-align: left;
	border-top: 1px solid ${neutral[73]};
	margin-top: ${space[6]}px;
	padding-top: ${space[2]}px;
`;

export const pill = css`
	position: absolute;
	top: 0;
	left: 50%;
	transform: translate(-50%, -50%);
	white-space: nowrap;
	padding: ${space[1]}px ${space[4]}px;
	border-radius: ${space[1]}px;
	background-color: ${palette.brand[500]};
	color: ${palette.neutral[100]};
	${textSansBold15};
`;

export const headWrapper = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: ${space[6]}px;
`;
