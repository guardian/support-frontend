import { css } from '@emotion/react';
import {
	from,
	neutral,
	palette,
	space,
	textSans17,
	textSansBold17,
	until,
} from '@guardian/source/foundations';

export const flexContainerOverride = css`
	${textSans17};
	background-color: #335182;
	align-items: center;
	justify-content: space-between;
	flex-direction: column-reverse;

	margin: ${space[4]}px ${space[1]}px ${space[10]}px;
	border-radius: ${space[2]}px;
	${from.tablet} {
		align-items: stretch;
		margin: ${space[4]}px ${space[3]}px ${space[4]}px;
	}

	& img {
		object-fit: fill;
		${until.mobile} {
			display: none;
		}
	}
`;
export const copyWidthStyle = css`
	padding: 0px ${space[4]}px ${space[3]}px;
	color: ${palette.neutral[100]};
	${from.tablet} {
		padding-top: ${space[4]}px;
		max-width: 734px;
	}
`;
export const paragraphStyle = css`
	line-height: 130%;
	padding-top: ${space[4]}px;
	padding-bottom: ${space[5]}px;
	${from.tablet} {
		padding-top: 0px;
		padding-bottom: ${space[4]}px;
		max-width: 734px;
	}
`;
export const accordionOverride = css`
	border-top: 1px solid ${neutral[73]};
	border-bottom: none;
	p,
	button {
		color: ${palette.neutral[100]};
	}
	button > strong {
		${textSansBold17};
	}
`;
export const accordionRowOverride = css`
	border: none;

	> button {
		display: flex;
	}
	> button > div > span {
		display: none;
	} // remove label
	> button > div > svg > path {
		fill: ${palette.neutral[100]};
	}
	> div > div > p {
		padding-bottom: ${space[1]}px;
	}

	& a {
		color: ${neutral[100]};
		:visited {
			color: ${neutral[100]};
		}
	}
`;
