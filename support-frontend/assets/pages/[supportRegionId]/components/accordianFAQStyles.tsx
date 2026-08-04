import { css } from '@emotion/react';
import {
	article15,
	article17,
	from,
	headlineBold17,
	headlineBold20,
	headlineBold28,
	headlineBold34,
	palette,
	space,
} from '@guardian/source/foundations';

export const container = css`
	background-color: ${palette.neutral[97]};
	position: relative;

	> div {
		padding: ${space[5]}px 10px;

		${from.tablet} {
			padding: ${space[5]}px ${space[3]}px;
			display: flex;
			justify-content: center;
		}

		${from.desktop} {
			padding-top: ${space[9]}px;
		}
	}
`;
export const bodyContainer = css`
	width: 100%;
	color: ${palette.neutral[7]};
	background-color: ${palette.neutral[100]};
	border-radius: ${space[3]}px;
	padding: ${space[3]}px;
	${from.tablet} {
		padding: ${space[5]}px ${space[6]}px ${space[1]}px;
	}
	${from.desktop} {
		max-width: 940px;
	}
`;
export const heading = css`
	text-align: left;
	${headlineBold28}
	margin-bottom: ${space[6]}px;
	${from.desktop} {
		${headlineBold34}
		margin-bottom: ${space[9]}px;
	}
`;
export const accordian = css`
	justify-content: space-between;
	border-bottom: 0px;
	& a {
		color: ${palette.brand[500]};
	}
`;
export const accordianRow = (expanded: boolean) => css`
	border-top: 1px solid ${palette.neutral[73]};
	text-align: left;
	> button {
		align-items: flex-start;
		padding: ${space[1]}px 0px ${expanded ? 0 : space[6]}px;
		${from.desktop} {
			padding: ${space[2]}px 0px ${expanded ? 0 : space[8]}px;
		}
	} // title
	> button > * {
		margin-right: ${space[1]}px;
		${headlineBold17}
		${from.desktop} {
			${headlineBold20}
		}
	} // title (content)
	> div > * {
		${article15}
		padding-bottom: ${expanded ? space[1] : 0}px;
		${from.desktop} {
			padding-bottom: ${expanded ? space[3] : 0}px;
			${article17}
		}
	} // body
	> button > div > span {
		display: none;
	} // remove label
	p {
		padding-top: ${space[2]}px;
		${from.desktop} {
			max-width: 648px;
		}
	}
`;
