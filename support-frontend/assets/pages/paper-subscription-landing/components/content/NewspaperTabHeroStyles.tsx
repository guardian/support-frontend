import { css } from '@emotion/react';
import {
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
	align-items: flex-start;
	justify-content: space-between;

	margin: ${space[6]}px ${space[4]}px ${space[10]}px;
	padding: ${space[2]}px ${space[3]}px ${space[3]}px;
	border-radius: ${space[1]}px;
	${from.tablet} {
		margin: ${space[6]}px;
		padding: ${space[3]}px ${space[5]}px;
		border-radius: ${space[2]}px;
	}

	img {
		object-fit: cover;
		${until.tablet} {
			display: none;
		}
	}
`;
export const copyWidthStyle = css`
	color: ${palette.neutral[100]};
	${from.tablet} {
		max-width: 669px;
	}
`;
export const paragraphStyle = css`
	line-height: 115%;
	padding-bottom: ${space[2]}px;
	${from.tablet} {
		padding-bottom: ${space[4]}px;
		max-width: 669px;
	}
	${from.desktop} {
		text-align: justify;
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
