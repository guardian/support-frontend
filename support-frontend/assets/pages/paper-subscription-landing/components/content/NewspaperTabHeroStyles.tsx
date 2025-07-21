import { css } from '@emotion/react';
import {
	between,
	from,
	neutral,
	palette,
	space,
	textSans17,
	until,
} from '@guardian/source/foundations';

export const flexContainerOverride = css`
	${textSans17};
	background-color: #335182;
	align-items: center;
	justify-content: space-between;
	flex-direction: column-reverse;

	margin: ${space[6]}px ${space[4]}px ${space[10]}px;
	border-radius: ${space[1]}px;
	${from.tablet} {
		align-items: flex-start;
		margin: ${space[6]}px;
		border-radius: ${space[2]}px;
	}

	img {
		object-fit: cover;
		${until.mobile} {
			display: none;
		}
	}
`;
export const copyWidthStyle = css`
	padding: 0px ${space[3]}px ${space[3]}px;
	color: ${palette.neutral[100]};
	${from.tablet} {
		padding: ${space[3]}px ${space[5]}px;
		max-width: 669px;
	}
`;
export const imageHeightStyle = css`
	${from.tablet} {
		max-width: 669px;
	}
	${between.tablet.and.desktop} {
		padding-top: ${space[3]}px;
	}
`;
export const paragraphStyle = css`
	line-height: 115%;
	padding-top: ${space[4]}px;
	padding-bottom: ${space[5]}px;
	${from.tablet} {
		padding-top: 0px;
		padding-bottom: ${space[4]}px;
		max-width: 669px;
	}
`;
export const accordionOverride = css`
	border-top: 1px solid ${neutral[73]};
	border-bottom: none;
	p,
	button {
		color: ${palette.neutral[100]};
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
		padding-bottom: ${space[2]}px;
	}
`;
export const linkStyle = css`
	& a {
		color: ${neutral[100]};
		:visited {
			color: ${neutral[100]};
		}
	}
`;
