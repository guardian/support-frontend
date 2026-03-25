import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	space,
	until,
} from '@guardian/source/foundations';

export const centredContainerDigitalWeekly = css`
	padding: ${space[5]}px ${space[3]}px ${space[10]}px;
	${from.tablet} {
		width: 100%;
		padding: ${space[8]}px ${space[5]}px ${space[12]}px;
	}
	${from.wide} {
		padding-left: ${space[8]}px;
		padding-right: ${space[8]}px;
	}
`;
export const displayRowEvenlyWeeklyDigital = css`
	display: block;
	${from.phablet} {
		display: flex;
		flex-direction: row;
		justify-content: left;
	}
	section {
		padding-top: 0;
		padding-bottom: 0;
		${from.tablet} {
			padding-left: 0;
		}
		div > h2 {
			${headlineBold24};
			${from.tablet} {
				font-size: 28px;
			}
			${from.wide} {
				font-size: 34px;
			}
		}
	}
	section:nth-child(1) {
		${until.tablet} {
			border-top: none;
			margin-bottom: ${space[8]}px;
		}
	}
	section:nth-child(2) {
		${until.tablet} {
			padding-top: ${space[5]}px;
		}
	}
`;
